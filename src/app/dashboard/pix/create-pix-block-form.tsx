"use client";

import { useRef, useState, useTransition } from "react";
import { createPixBlock } from "./actions";

export function CreatePixBlockForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await createPixBlock(formData);
            formRef.current?.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar bloco.");
          }
        });
      }}
      className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4"
    >
      <div className="flex gap-2">
        <select
          name="type"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none"
          defaultValue="donation"
        >
          <option value="donation">Doação</option>
          <option value="product">Produto/serviço</option>
        </select>
        <input
          name="title"
          placeholder="Título (ex: Pix da gorjeta)"
          required
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      </div>
      <input
        name="description"
        placeholder="Descrição (opcional)"
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
      />
      <div className="flex gap-2">
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Valor em R$ (deixe vazio p/ livre)"
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Criando…" : "Criar bloco"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
