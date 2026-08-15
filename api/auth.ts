/**
 * Vercel Serverless Function — autenticação com PostgreSQL na Neon.
 *
 * Variáveis de ambiente necessárias:
 *   DATABASE_URL  -> connection string do projeto Neon (postgresql://...sslmode=require)
 *   AUTH_SECRET   -> segredo aleatório para assinar o token de sessão
 *
 * Endpoints:  POST /api/auth?action=login | ?action=cadastro
 */
import { neon } from "@neondatabase/serverless";

const ITERATIONS = 120_000;
const enc = new TextEncoder();

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function derive(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

async function hashPassword(password: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  return `${salt}:${await derive(password, salt)}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const candidate = await derive(password, salt);
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) diff |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

async function signSession(userId: string, secret: string) {
  const payload = toBase64Url(enc.encode(JSON.stringify({ sub: userId, exp: Date.now() + 7 * 864e5 })));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(sig))}`;
}

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    });

  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  const databaseUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;
  if (!databaseUrl || !authSecret) {
    return json({ error: "Servidor sem DATABASE_URL/AUTH_SECRET configurados." }, 500);
  }

  const action = new URL(req.url).searchParams.get("action");
  const body = (await req.json().catch(() => null)) as
    | { nome?: unknown; email?: unknown; senha?: unknown }
    | null;

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const senha = typeof body?.senha === "string" ? body.senha : "";
  const nome = typeof body?.nome === "string" ? body.nome.trim().slice(0, 100) : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return json({ error: "E-mail inválido." }, 400);
  }
  if (senha.length < 8 || senha.length > 128) {
    return json({ error: "Senha deve ter entre 8 e 128 caracteres." }, 400);
  }

  const sql = neon(databaseUrl);

  // Cria a tabela na primeira execução (idempotente).
  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      nome text NOT NULL DEFAULT '',
      email text NOT NULL UNIQUE,
      senha_hash text NOT NULL,
      criado_em timestamptz NOT NULL DEFAULT now()
    )
  `;

  const cookie = (token: string) =>
    `sessao=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 3600}`;

  if (action === "cadastro") {
    if (nome.length < 2) return json({ error: "Informe seu nome completo." }, 400);
    const existente = await sql`SELECT 1 FROM usuarios WHERE email = ${email}`;
    if (existente.length > 0) return json({ error: "E-mail já cadastrado." }, 409);

    const rows = await sql`
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES (${nome}, ${email}, ${await hashPassword(senha)})
      RETURNING id, nome, email
    `;
    const user = rows[0] as { id: string; nome: string; email: string };
    return json(
      { message: "Conta criada com sucesso!", user },
      201,
      { "Set-Cookie": cookie(await signSession(user.id, authSecret)) },
    );
  }

  if (action === "login") {
    const rows = await sql`SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ${email}`;
    const user = rows[0] as { id: string; nome: string; email: string; senha_hash: string } | undefined;
    if (!user || !(await verifyPassword(senha, user.senha_hash))) {
      return json({ error: "E-mail ou senha incorretos." }, 401);
    }
    return json(
      { message: "Autenticado com sucesso!", user: { id: user.id, nome: user.nome, email: user.email } },
      200,
      { "Set-Cookie": cookie(await signSession(user.id, authSecret)) },
    );
  }

  return json({ error: "Ação inválida. Use ?action=login ou ?action=cadastro." }, 400);
}

export const config = { runtime: "edge" };