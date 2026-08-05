import Link from "next/link";
import type { Theme } from "@/lib/themes";
import { formatBRL } from "@/lib/utils";

type Block = {
  id: string;
  type: "donation" | "product";
  title: string;
  description: string | null;
  amount: number | null;
};

export function PixBlockCard({ block, theme }: { block: Block; theme: Theme }) {
  return (
    <Link
      href={`pix/${block.id}`}
      className={`group flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${theme.card} ${theme.link}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-base">
        {block.type === "donation" ? "💸" : "🛒"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{block.title}</span>
        {block.description && (
          <span className={`block truncate text-xs ${theme.subtext}`}>{block.description}</span>
        )}
      </span>
      <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-500">
        {block.amount ? formatBRL(block.amount) : "Pix livre"}
      </span>
    </Link>
  );
}
