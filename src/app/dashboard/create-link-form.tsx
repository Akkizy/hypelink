"use client";

import { useRef, useState, useTransition } from "react";
import { LinkIcon } from "@/lib/link-icons";
import { createLink } from "./links-actions";
import type { LinkCategory } from "@/lib/supabase/types";

const QUICK_ADD = [
  { label: "Instagram", title: "Meu Instagram", placeholder: "https://instagram.com/seuusuario" },
  { label: "YouTube", title: "Meu canal no YouTube", placeholder: "https://youtube.com/@seucanal" },
  { label: "TikTok", title: "Meu TikTok", placeholder: "https://tiktok.com/@seuusuario" },
  { label: "WhatsApp", title: "Fala comigo no WhatsApp", placeholder: "https://wa.me/55SEUNUMERO" },
];

export function CreateLinkForm({ categories }: { categories: LinkCategory[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        setSuccess(false);
        startTransition(async () => {
          try {
            await createLink(formData);
            formRef.current?.reset();
            setTitle("");
            setUrl("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar link.");
          }
        });
      }}
      className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5"
    >
      <div className="flex flex-wrap gap-1.5">
        {QUICK_ADD.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => {
              setTitle(q.title);
              setUrl(q.placeholder);
            }}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/60 hover:border-black/30 hover:text-black"
          >
            + {q.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/50">Título</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Meu Instagram"
            required
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black/30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/50">Link</label>
          <div className="flex items-center gap-2 rounded-lg border border-black/10 pl-3 focus-within:border-black/30">
            <LinkIcon url={url} className="h-4 w-4 shrink-0 text-black/40" />
            <input
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/50">Categoria</label>
          <select
            name="category_id"
            defaultValue=""
            className="w-fit rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">Link adicionado — já está visível na sua página. ✓</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Adicionar link"}
      </button>
    </form>
  );
}
