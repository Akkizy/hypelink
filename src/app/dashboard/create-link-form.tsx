"use client";

import { useRef, useState, useTransition } from "react";
import { createLink } from "./links-actions";

export function CreateLinkForm() {
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
            await createLink(formData);
            formRef.current?.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar link.");
          }
        });
      }}
      className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4"
    >
      <div className="flex gap-2">
        <input
          name="title"
          placeholder="Título (ex: Meu Instagram)"
          required
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
        <input
          name="url"
          placeholder="https://..."
          required
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Adicionando…" : "Adicionar"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
