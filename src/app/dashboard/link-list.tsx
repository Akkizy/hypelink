"use client";

import { useState, useTransition } from "react";
import type { Link as LinkRow } from "@/lib/supabase/types";
import { deleteLink, reorderLinks, toggleLink, updateLink } from "./links-actions";

export function LinkList({ links }: { links: LinkRow[] }) {
  const [items, setItems] = useState(links);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return <p className="text-sm text-black/50">Você ainda não tem nenhum link. Adicione o primeiro acima.</p>;
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(() => reorderLinks(next.map((l) => l.id)));
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((link, index) => (
        <li key={link.id} className="rounded-xl border border-black/10 bg-white p-3">
          {editingId === link.id ? (
            <EditForm
              link={link}
              onDone={(updated) => {
                setItems((prev) => prev.map((l) => (l.id === link.id ? { ...l, ...updated } : l)));
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-black/30 hover:text-black disabled:opacity-20"
                  aria-label="Mover para cima"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="text-black/30 hover:text-black disabled:opacity-20"
                  aria-label="Mover para baixo"
                >
                  ▼
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{link.title}</p>
                <p className="truncate text-sm text-black/50">{link.url}</p>
              </div>
              <span className="shrink-0 text-xs text-black/40">{link.click_count} cliques</span>
              <label className="flex shrink-0 items-center gap-1.5 text-xs text-black/60">
                <input
                  type="checkbox"
                  checked={link.is_active}
                  onChange={(e) => {
                    const isActive = e.target.checked;
                    setItems((prev) => prev.map((l) => (l.id === link.id ? { ...l, is_active: isActive } : l)));
                    startTransition(() => toggleLink(link.id, isActive));
                  }}
                />
                ativo
              </label>
              <button
                onClick={() => setEditingId(link.id)}
                className="shrink-0 text-sm text-black/60 hover:text-black"
              >
                editar
              </button>
              <button
                onClick={() => {
                  setItems((prev) => prev.filter((l) => l.id !== link.id));
                  startTransition(() => deleteLink(link.id));
                }}
                className="shrink-0 text-sm text-red-500 hover:text-red-700"
              >
                excluir
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function EditForm({
  link,
  onDone,
  onCancel,
}: {
  link: LinkRow;
  onDone: (updated: { title: string; url: string }) => void;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await updateLink(link.id, formData);
            onDone({
              title: String(formData.get("title")),
              url: String(formData.get("url")),
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar.");
          }
        });
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          name="title"
          defaultValue={link.title}
          required
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none"
        />
        <input
          name="url"
          defaultValue={link.url}
          required
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none"
        />
        <button disabled={pending} className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-50">
          Salvar
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm text-black/60">
          Cancelar
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
