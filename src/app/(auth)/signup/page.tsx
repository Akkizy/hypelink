"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "../actions";

const initialState: AuthState = { error: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-bold">Criar sua página</h1>
      <p className="mb-6 text-sm text-black/60">Grátis, sem cartão de crédito.</p>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex items-center rounded-lg border border-black/10 pl-4 focus-within:border-black/30">
          <span className="text-black/40">hyperlink.app/</span>
          <input
            name="username"
            placeholder="seunome"
            required
            pattern="[a-z0-9_.]{3,30}"
            className="w-full bg-transparent py-2.5 pl-1 outline-none"
          />
        </div>
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
          placeholder="Senha (mín. 8 caracteres)"
          required
          minLength={8}
          className="rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-black/30"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-4 py-2.5 font-medium text-white disabled:opacity-50"
        >
          {pending ? "Criando…" : "Criar conta grátis"}
        </button>
      </form>
      <p className="mt-6 text-sm text-black/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-black underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
