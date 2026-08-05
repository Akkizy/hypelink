"use client";

import { useState } from "react";
import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";
import { createBrickPayment, type BrickFormData } from "./actions";

let initialized = false;
function ensureInitialized() {
  if (initialized) return;
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, { locale: "pt-BR" });
  initialized = true;
}

export function PixCheckout({ blockId, fixedAmount }: { blockId: string; fixedAmount: number | null }) {
  ensureInitialized();

  const [amountInput, setAmountInput] = useState("");
  const [amountConfirmed, setAmountConfirmed] = useState(fixedAmount != null);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const amount = fixedAmount ?? Number(amountInput);

  if (paymentId) {
    return (
      <div className="mt-6">
        <StatusScreen
          initialization={{ paymentId }}
          onError={(err) => console.error("status screen error", err)}
        />
      </div>
    );
  }

  if (!amountConfirmed) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = Number(amountInput);
          if (!Number.isFinite(value) || value <= 0) {
            setError("Informe um valor válido.");
            return;
          }
          setError(null);
          setAmountConfirmed(true);
        }}
        className="mt-6 flex flex-col gap-2"
      >
        <input
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          type="number"
          step="0.01"
          min="1"
          placeholder="Quanto você quer pagar (R$)"
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white"
        >
          Continuar
        </button>
      </form>
    );
  }

  return (
    <div className="mt-6">
      <Payment
        initialization={{ amount }}
        customization={{
          paymentMethods: { creditCard: "all", debitCard: "all", bankTransfer: "all" },
        }}
        onSubmit={async ({ formData }) => {
          setError(null);
          try {
            const res = await createBrickPayment(blockId, formData as unknown as BrickFormData);
            setPaymentId(res.paymentId);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao processar pagamento.");
            throw err;
          }
        }}
        onError={(err) => console.error("payment brick error", err)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
