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
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 120_000;

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256").toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const candidate = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  const expected = Buffer.from(derived, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function signSession(userId: string, secret: string) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 7 * 864e5 })).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
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
      VALUES (${nome}, ${email}, ${hashPassword(senha)})
      RETURNING id, nome, email
    `;
    const user = rows[0] as { id: string; nome: string; email: string };
    return json(
      { message: "Conta criada com sucesso!", user },
      201,
      { "Set-Cookie": cookie(signSession(user.id, authSecret)) },
    );
  }

  if (action === "login") {
    const rows = await sql`SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ${email}`;
    const user = rows[0] as { id: string; nome: string; email: string; senha_hash: string } | undefined;
    if (!user || !verifyPassword(senha, user.senha_hash)) {
      return json({ error: "E-mail ou senha incorretos." }, 401);
    }
    return json(
      { message: "Autenticado com sucesso!", user: { id: user.id, nome: user.nome, email: user.email } },
      200,
      { "Set-Cookie": cookie(signSession(user.id, authSecret)) },
    );
  }

  return json({ error: "Ação inválida. Use ?action=login ou ?action=cadastro." }, 400);
}

export const config = { runtime: "edge" };