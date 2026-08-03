"use client";

import { useState } from "react";

type Point = { day: string; count: number };

function formatDay(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function ClicksChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<Point | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-black/70">Cliques nos últimos 14 dias</h2>
        <button
          onClick={() => setShowTable((v) => !v)}
          className="text-xs text-black/40 underline hover:text-black/60"
        >
          {showTable ? "ver gráfico" : "ver como tabela"}
        </button>
      </div>

      {showTable ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black/50">
              <th className="py-1 font-normal">Dia</th>
              <th className="py-1 font-normal">Cliques</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.day} className="border-t border-black/5">
                <td className="py-1">{formatDay(d.day)}</td>
                <td className="py-1 font-medium">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative">
          <div className="flex h-32 items-end gap-[3px]">
            {data.map((d) => (
              <div
                key={d.day}
                className="group relative flex-1"
                onMouseEnter={() => setHover(d)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="w-full rounded-t bg-neutral-900 transition-opacity group-hover:opacity-70"
                  style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-black/40">
            <span>{formatDay(data[0]?.day ?? "")}</span>
            <span>{formatDay(data[data.length - 1]?.day ?? "")}</span>
          </div>
          {hover && (
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-sm">
              {formatDay(hover.day)} — {hover.count} clique{hover.count === 1 ? "" : "s"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
