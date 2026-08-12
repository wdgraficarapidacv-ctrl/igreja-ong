"use client";

import { useActionState, useState, type ReactNode } from "react";
import { loginAction, requestPasswordResetAction } from "./actions";
import { loginLocalAction, registerLocalAdminAction } from "./local-actions";

type Mode = "login" | "reset" | "register";

export function AuthCard({
  next,
  initialError,
  supabaseConfigured,
  canRegister,
}: {
  next: string;
  initialError?: string;
  supabaseConfigured: boolean;
  canRegister: boolean;
}) {
  const [mode, setMode] = useState<Mode>(canRegister ? "register" : "login");

  const loginFn = supabaseConfigured ? loginAction : loginLocalAction;
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginFn,
    initialError ? { error: initialError } : undefined
  );
  const [resetState, resetFormAction, resetPending] = useActionState(requestPasswordResetAction, undefined);
  const [registerState, registerFormAction, registerPending] = useActionState(registerLocalAdminAction, undefined);

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-line bg-bg-raised px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      {!supabaseConfigured && (
        <p className="mb-6 rounded-lg border border-warning/40 bg-warning/10 px-3.5 py-2.5 text-[12.5px] text-warning">
          Modo local (sem Supabase) — só pra teste. Veja <code>web/SETUP.md</code> antes de publicar o site.
        </p>
      )}

      {mode === "register" && (
        <>
          <h1 className="mb-1.5 font-serif text-2xl font-normal">Criar conta admin</h1>
          <p className="mb-7 text-sm text-ink-soft">
            Primeiro acesso — depois de criado, essa opção some e só dá pra entrar com login normal.
          </p>

          <form action={registerFormAction} className="grid gap-4">
            <Field label="Nome" name="full_name" type="text" autoComplete="name" required />
            <Field label="E-mail" name="email" type="email" autoComplete="email" required />
            <Field label="Senha" name="password" type="password" autoComplete="new-password" required />
            <Field label="Confirmar senha" name="confirm" type="password" autoComplete="new-password" required />

            {registerState?.error && <ErrorBox>{registerState.error}</ErrorBox>}

            <button
              type="submit"
              disabled={registerPending}
              className="mt-1 rounded-[10px] bg-accent px-5 py-3 text-[15px] font-bold text-accent-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {registerPending ? "Criando…" : "Criar conta e entrar"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode("login")}
            className="mt-5 block w-full text-center text-[13.5px] text-ink-soft hover:text-accent-ink"
          >
            Já tenho conta — entrar
          </button>
        </>
      )}

      {mode === "login" && (
        <>
          <h1 className="mb-1.5 font-serif text-2xl font-normal">Entrar</h1>
          <p className="mb-7 text-sm text-ink-soft">Área restrita à administração da MARN Church.</p>

          <form action={loginFormAction} className="grid gap-4">
            <input type="hidden" name="next" value={next} />
            <Field label="E-mail" name="email" type="email" autoComplete="email" required />
            <Field label="Senha" name="password" type="password" autoComplete="current-password" required />

            {loginState?.error && <ErrorBox>{loginState.error}</ErrorBox>}

            <button
              type="submit"
              disabled={loginPending}
              className="mt-1 rounded-[10px] bg-accent px-5 py-3 text-[15px] font-bold text-accent-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loginPending ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode("reset")}
            className="mt-5 block w-full text-center text-[13.5px] text-ink-soft hover:text-accent-ink"
          >
            Esqueci minha senha
          </button>

          {canRegister && (
            <button
              type="button"
              onClick={() => setMode("register")}
              className="mt-2 block w-full text-center text-[13.5px] text-accent-ink hover:underline"
            >
              Ainda não tenho conta — criar conta admin
            </button>
          )}
        </>
      )}

      {mode === "reset" && (
        <>
          <h1 className="mb-1.5 font-serif text-2xl font-normal">Redefinir senha</h1>
          <p className="mb-7 text-sm text-ink-soft">
            Informe o e-mail do seu acesso administrativo. Vamos enviar um link para você criar uma nova senha.
          </p>

          {resetState?.message ? (
            <p className="rounded-lg border border-success/40 bg-success-soft px-3.5 py-2.5 text-[13.5px] text-success">
              {resetState.message}
            </p>
          ) : (
            <form action={resetFormAction} className="grid gap-4">
              <Field label="E-mail" name="email" type="email" autoComplete="email" required />

              {resetState?.error && <ErrorBox>{resetState.error}</ErrorBox>}

              <button
                type="submit"
                disabled={resetPending}
                className="mt-1 rounded-[10px] bg-accent px-5 py-3 text-[15px] font-bold text-accent-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {resetPending ? "Enviando…" : "Enviar link"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => setMode("login")}
            className="mt-5 block w-full text-center text-[13.5px] text-ink-soft hover:text-accent-ink"
          >
            ← Voltar para o login
          </button>
        </>
      )}
    </div>
  );
}

function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-danger/40 bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">
      {children}
    </p>
  );
}

function Field(props: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const { label, name, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      <input
        name={name}
        {...rest}
        className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}
