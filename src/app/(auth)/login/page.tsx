"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthState } from "../actions";

const initialState: AuthState = { error: null };

function ConfirmationNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== "confirmation_failed") return null;

  return (
    <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
      O link de confirmação expirou ou já foi usado. Tente entrar normalmente ou crie uma conta de novo.
    </p>
  );
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-bold">Entrar</h1>
      <Suspense fallback={null}>
        <ConfirmationNotice />
      </Suspense>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-black/30"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          className="rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-black/30"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-4 py-2.5 font-medium text-white disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-sm text-black/60">
        Não tem conta?{" "}
        <Link href="/signup" className="font-medium text-black underline">
          Criar conta grátis
        </Link>
      </p>
    </main>
  );
}
