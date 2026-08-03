"use client";

import { useState, useTransition } from "react";
import { startProCheckout } from "./actions";

export function UpgradeButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-4">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await startProCheckout();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erro ao iniciar checkout.");
            }
          });
        }}
        disabled={pending}
        className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Redirecionando…" : "Assinar PRO com Mercado Pago"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
