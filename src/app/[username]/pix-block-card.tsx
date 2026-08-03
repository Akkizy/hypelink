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
      className={`flex w-full flex-col gap-0.5 rounded-xl px-5 py-3.5 text-left transition-colors ${theme.card} ${theme.link}`}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        {block.type === "donation" ? "💸" : "🛒"} {block.title}
      </span>
      {block.description && <span className={`text-xs ${theme.subtext}`}>{block.description}</span>}
      <span className="text-xs font-semibold">
        {block.amount ? `Pagar via Pix — ${formatBRL(block.amount)}` : "Pagar via Pix — valor livre"}
      </span>
    </Link>
  );
}
