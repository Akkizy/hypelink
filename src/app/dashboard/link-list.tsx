"use client";

import { useOptimistic, useState, useTransition } from "react";
import type { Link as LinkRow, LinkCategory } from "@/lib/supabase/types";
import { LinkIcon } from "@/lib/link-icons";
import { groupLinksByCategory } from "@/lib/link-groups";
import { deleteLink, reorderLinks, toggleLink, updateLink } from "./links-actions";

type Action =
  | { type: "toggle"; id: string; value: boolean }
  | { type: "delete"; id: string }
  | { type: "reorderGroup"; groupKey: string | null; items: LinkRow[] }
  | { type: "update"; id: string; data: { title: string; url: string; category_id: string | null } };

function reducer(state: LinkRow[], action: Action): LinkRow[] {
  switch (action.type) {
    case "toggle":
      return state.map((l) => (l.id === action.id ? { ...l, is_active: action.value } : l));
    case "delete":
      return state.filter((l) => l.id !== action.id);
    case "update":
      return state.map((l) => (l.id === action.id ? { ...l, ...action.data } : l));
    case "reorderGroup": {
      let i = 0;
      return state.map((item) => {
        const belongs = (item.category_id ?? null) === action.groupKey;
        return belongs ? action.items[i++] : item;
      });
    }
  }
}

export function LinkList({ links, categories }: { links: LinkRow[]; categories: LinkCategory[] }) {
  const [items, applyOptimistic] = useOptimistic(links, reducer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/15 py-8 text-center text-sm text-black/50">
        Nenhum link ainda. Adicione o primeiro acima — ele já aparece pronto pra galera clicar.
      </p>
    );
  }

  function moveWithinGroup(groupKey: string | null, groupItems: LinkRow[], index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= groupItems.length) return;
    const next = [...groupItems];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      applyOptimistic({ type: "reorderGroup", groupKey, items: next });
      await reorderLinks(next.map((l) => l.id));
    });
  }

  const groups = groupLinksByCategory(items, categories);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.key ?? "none"}>
          {group.title && <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/40">{group.title}</h3>}
          <ul className="flex flex-col gap-2">
            {group.links.map((link, index) => {
              return (
                <li key={link.id} className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
                  {editingId === link.id ? (
                    <EditForm
                      link={link}
                      categories={categories}
                      onDone={(data) => {
                        startTransition(() => applyOptimistic({ type: "update", id: link.id, data }));
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-black/30">
                        <button
                          onClick={() => moveWithinGroup(group.key, group.links, index, -1)}
                          disabled={index === 0}
                          className="hover:text-black disabled:opacity-20"
                          aria-label="Mover para cima"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveWithinGroup(group.key, group.links, index, 1)}
                          disabled={index === group.links.length - 1}
                          className="hover:text-black disabled:opacity-20"
                          aria-label="Mover para baixo"
                        >
                          ▼
                        </button>
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                        <LinkIcon url={link.url} className="h-4.5 w-4.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{link.title}</p>
                        <p className="truncate text-xs text-black/40">{link.url}</p>
                      </div>

                      <span className="hidden shrink-0 text-xs text-black/40 sm:inline">{link.click_count} cliques</span>

                      <label className="flex shrink-0 items-center gap-1.5 text-xs text-black/60">
                        <input
                          type="checkbox"
                          checked={link.is_active}
                          onChange={(e) => {
                            const value = e.target.checked;
                            startTransition(async () => {
                              applyOptimistic({ type: "toggle", id: link.id, value });
                              await toggleLink(link.id, value);
                            });
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
                          startTransition(async () => {
                            applyOptimistic({ type: "delete", id: link.id });
                            await deleteLink(link.id);
                          });
                        }}
                        className="shrink-0 text-sm text-red-500 hover:text-red-700"
                      >
                        excluir
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EditForm({
  link,
  categories,
  onDone,
  onCancel,
}: {
  link: LinkRow;
  categories: LinkCategory[];
  onDone: (updated: { title: string; url: string; category_id: string | null }) => void;
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
            const categoryId = String(formData.get("category_id") ?? "").trim() || null;
            onDone({
              title: String(formData.get("title")),
              url: String(formData.get("url")),
              category_id: categoryId,
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar.");
          }
        });
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-wrap gap-2">
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
        {categories.length > 0 && (
          <select
            name="category_id"
            defaultValue={link.category_id ?? ""}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
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
