import type { LinkCategory } from "./supabase/types";

export type LinkGroup<T> = { key: string | null; title: string | null; links: T[] };

export function groupLinksByCategory<T extends { category_id: string | null }>(
  links: T[],
  categories: LinkCategory[],
): LinkGroup<T>[] {
  const groups: LinkGroup<T>[] = [
    { key: null, title: null, links: links.filter((l) => !l.category_id) },
    ...categories.map((c) => ({
      key: c.id,
      title: c.title,
      links: links.filter((l) => l.category_id === c.id),
    })),
  ];

  return groups.filter((g) => g.links.length > 0 || g.key === null);
}
