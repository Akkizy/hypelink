"use client";

import Link from "next/link";
import { useOptimistic, useRef, useState, useTransition } from "react";
import type { LinkCategory } from "@/lib/supabase/types";
import { createCategory, deleteCategory, renameCategory, reorderCategories } from "./categories-actions";

type Action =
  | { type: "add"; category: LinkCategory }
  | { type: "rename"; id: string; title: string }
  | { type: "delete"; id: string }
  | { type: "reorder"; items: LinkCategory[] };

function reducer(state: LinkCategory[], action: Action): LinkCategory[] {
  switch (action.type) {
    case "add":
      return [...state, action.category];
    case "rename":
      return state.map((c) => (c.id === action.id ? { ...c, title: action.title } : c));
    case "delete":
      return state.filter((c) => c.id !== action.id);
    case "reorder":
      return action.items;
  }
}

export function CategoryManager({ categories, isPro }: { categories: LinkCategory[]; isPro: boolean }) {
  const [items, applyOptimistic] = useOptimistic(categories, reducer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isPro) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 p-4 text-sm text-black/60">
        Organize seus links em categorias (ex: &quot;Redes Sociais&quot;, &quot;Produtos&quot;) no{" "}
        <Link href="/dashboard/billing" className="font-medium underline">
          plano PRO
        </Link>
        .
      </div>
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      applyOptimistic({ type: "reorder", items: next });
      await reorderCategories(next.map((c) => c.id));
    });
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="mb-2 text-xs font-medium text-black/50">Categorias</p>
      <div className="flex flex-wrap gap-2">
        {items.map((cat, index) => (
          <div
            key={cat.id}
            className="flex items-center gap-1 rounded-full border border-black/10 bg-neutral-50 pl-3 pr-1 py-1 text-xs"
          >
            {editingId === cat.id ? (
              <input
                autoFocus
                defaultValue={cat.title}
                onBlur={(e) => {
                  const title = e.target.value;
                  setEditingId(null);
                  if (title.trim() && title !== cat.title) {
                    startTransition(async () => {
                      applyOptimistic({ type: "rename", id: cat.id, title });
                      await renameCategory(cat.id, title);
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-24 bg-transparent outline-none"
              />
            ) : (
              <button type="button" onClick={() => setEditingId(cat.id)} className="font-medium">
                {cat.title}
              </button>
            )}
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="px-0.5 text-black/30 hover:text-black disabled:opacity-20"
              aria-label="Mover categoria para a esquerda"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              className="px-0.5 text-black/30 hover:text-black disabled:opacity-20"
              aria-label="Mover categoria para a direita"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={() => {
                startTransition(async () => {
                  applyOptimistic({ type: "delete", id: cat.id });
                  await deleteCategory(cat.id);
                });
              }}
              className="rounded-full px-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Excluir categoria"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <form
        ref={formRef}
        action={(formData) => {
          setError(null);
          const title = String(formData.get("title") ?? "").trim();
          if (!title) return;
          startTransition(async () => {
            applyOptimistic({
              type: "add",
              category: {
                id: `optimistic-${Date.now()}`,
                profile_id: "",
                title,
                position: items.length,
                created_at: "",
                updated_at: "",
              },
            });
            try {
              await createCategory(formData);
              formRef.current?.reset();
              setNewTitle("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erro ao criar categoria.");
            }
          });
        }}
        className="mt-3 flex gap-2"
      >
        <input
          name="title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nova categoria (ex: Redes Sociais)"
          className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-black/30"
        />
        <button type="submit" className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-black/5">
          + categoria
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
