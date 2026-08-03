"use client";

import { useState, useTransition } from "react";
import type { PixBlock } from "@/lib/supabase/types";
import { formatBRL } from "@/lib/utils";
import { deletePixBlock, togglePixBlock } from "./actions";

export function PixBlockRow({ block }: { block: PixBlock }) {
  const [isActive, setIsActive] = useState(block.is_active);
  const [removed, setRemoved] = useState(false);
  const [, startTransition] = useTransition();

  if (removed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {block.type === "donation" ? "💸" : "🛒"} {block.title}
        </p>
        <p className="truncate text-sm text-black/50">
          {block.amount ? formatBRL(block.amount) : "Valor livre"}
        </p>
      </div>
      <label className="flex shrink-0 items-center gap-1.5 text-xs text-black/60">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => {
            const next = e.target.checked;
            setIsActive(next);
            startTransition(() => togglePixBlock(block.id, next));
          }}
        />
        ativo
      </label>
      <button
        onClick={() => {
          setRemoved(true);
          startTransition(() => deletePixBlock(block.id));
        }}
        className="shrink-0 text-sm text-red-500 hover:text-red-700"
      >
        excluir
      </button>
    </div>
  );
}
