import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Bone, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Informe um e-mail válido" }).max(255),
  senha: z.string().min(8, { message: "A senha deve ter ao menos 8 caracteres" }).max(128),
});

const cadastroSchema = loginSchema.extend({
  nome: z
    .string()
    .trim()
    .min(2, { message: "Informe seu nome completo" })
    .max(100, { message: "Nome muito longo" }),
});

type Mode = "login" | "cadastro";
type Errors = Partial<Record<"nome" | "email" | "senha" | "form", string>>;

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    const schema = mode === "login" ? loginSchema : cadastroSchema;
    const parsed = schema.safeParse(mode === "login" ? { email, senha } : { nome, email, senha });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof Errors] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`/api/auth?action=${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setErrors({ form: data.error ?? "Não foi possível concluir. Tente novamente." });
        return;
      }
      setOk(data.message ?? (mode === "login" ? "Autenticado com sucesso!" : "Conta criada com sucesso!"));
      setSenha("");
    } catch {
      setErrors({
        form: "Serviço de autenticação indisponível. Configure a variável DATABASE_URL (Neon) no ambiente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Entrar | Portal Megafauna Democrática"
        description="Acesse a área de pesquisadores do Portal Megafauna Democrática para gerenciar acervo, pesquisas e referências."
        path="/login"
      />

      <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden bg-deep">
        {/* Aurora animada */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/40 blur-3xl animate-aurora" />
          <div className="absolute -bottom-52 -right-32 h-[34rem] w-[34rem] rounded-full bg-amber/30 blur-3xl animate-aurora [animation-delay:-6s]" />
          <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-fossil/30 blur-3xl animate-aurora [animation-delay:-12s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,oklch(0.14_0.03_245/0.85))]" />
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-amber/70 animate-drift"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 61) % 100}%`,
                animationDelay: `${i * 0.9}s`,
                animationDuration: `${9 + (i % 5) * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container-page relative z-10 grid items-center gap-12 py-16 lg:grid-cols-2">
          {/* Lado institucional */}
          <div className="hidden animate-fade-up lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-amber backdrop-blur">
              <Bone className="h-3.5 w-3.5" /> Área de pesquisadores
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-deep-foreground xl:text-5xl">
              Acesso ao acervo científico da megafauna de Itapipoca
            </h1>
            <p className="mt-5 max-w-md text-deep-foreground/70">
              Gerencie fichas de espécies, publicações e referências bibliográficas. Os dados são
              persistidos em um banco PostgreSQL serverless na Neon.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-deep-foreground/80">
              {[
                "Senhas com hash seguro no servidor",
                "Sessão via cookie HttpOnly",
                "Compatível com Vercel Functions e StackBlitz",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card */}
          <div className="mx-auto w-full max-w-md animate-fade-up [animation-delay:120ms]">
            <div className="rounded-3xl border border-white/15 bg-white/8 p-1 shadow-[var(--shadow-elegant)] backdrop-blur-xl">
              <div className="rounded-[1.35rem] bg-background/92 p-7 sm:p-9">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-deep text-deep-foreground">
                    <Bone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-none">
                      {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Portal Megafauna Democrática
                    </p>
                  </div>
                </div>

                {/* Alternador */}
                <div className="relative mb-7 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-medium">
                  <span
                    className={cn(
                      "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-lg bg-card shadow-sm transition-transform duration-300 ease-out",
                      mode === "cadastro" && "translate-x-[calc(100%+0.5rem)]",
                    )}
                  />
                  {(["login", "cadastro"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setErrors({});
                        setOk(null);
                      }}
                      className={cn(
                        "relative z-10 rounded-lg py-2 transition-colors",
                        mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {m === "login" ? "Entrar" : "Cadastrar"}
                    </button>
                  ))}
                </div>

                <form onSubmit={onSubmit} noValidate className="space-y-4">
                  {mode === "cadastro" && (
                    <Field
                      id="nome"
                      label="Nome completo"
                      icon={<User className="h-4 w-4" />}
                      error={errors.nome}
                    >
                      <input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Ana Paleontóloga"
                        className="w-full bg-transparent py-3 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground/70"
                      />
                    </Field>
                  )}

                  <Field id="email" label="E-mail" icon={<Mail className="h-4 w-4" />} error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      autoComplete="email"
                      placeholder="voce@instituicao.br"
                      className="w-full bg-transparent py-3 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </Field>

                  <Field id="senha" label="Senha" icon={<Lock className="h-4 w-4" />} error={errors.senha}>
                    <input
                      id="senha"
                      type={showPass ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      maxLength={128}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-3 pl-10 pr-11 text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>

                  {errors.form && (
                    <p role="alert" className="animate-fade-in rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {errors.form}
                    </p>
                  )}
                  {ok && (
                    <p role="status" className="animate-fade-in rounded-lg bg-secondary/15 px-3 py-2 text-sm text-secondary">
                      {ok}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative inline-flex items-center justify-center gap-2">
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {mode === "login" ? "Entrar no portal" : "Criar minha conta"}
                    </span>
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Ao continuar você concorda com o uso educacional dos dados.{" "}
                  <Link to="/contato" className="font-medium text-primary hover:underline">
                    Falar com a curadoria
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "relative rounded-xl border bg-card transition-all duration-200 focus-within:ring-2 focus-within:ring-ring/40",
          error ? "border-destructive" : "border-border focus-within:border-primary",
        )}
      >
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}