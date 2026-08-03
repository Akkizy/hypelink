"use client";

import { useEffect, useState, useTransition } from "react";
import { createPixPayment, type CreatePixPaymentResult } from "./actions";

export function PixCheckout({ blockId, fixedAmount }: { blockId: string; fixedAmount: number | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(fixedAmount ? String(fixedAmount) : "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<CreatePixPaymentResult | null>(null);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "cancelled">("pending");

  useEffect(() => {
    if (!result || status !== "pending") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/pix-status/${result.paymentId}`);
      const data = await res.json();
      if (data.status && data.status !== "pending") setStatus(data.status);
    }, 3000);
    return () => clearInterval(interval);
  }, [result, status]);

  if (status === "approved") {
    return <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">Pagamento confirmado. Obrigado! 🎉</p>;
  }

  if (result) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${result.qrCodeBase64}`}
          alt="QR Code Pix"
          className="h-48 w-48 rounded-lg border border-black/10"
        />
        <button
          onClick={() => navigator.clipboard.writeText(result.qrCode)}
          className="w-full rounded-lg border border-black/15 py-2 text-sm font-medium hover:bg-black/5"
        >
          Copiar código Pix
        </button>
        <p className="text-xs text-black/50">Aguardando confirmação do pagamento…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            const res = await createPixPayment(blockId, { name, email, amount: Number(amount) });
            setResult(res);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao gerar Pix.");
          }
        });
      }}
      className="mt-6 flex flex-col gap-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        required
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Seu e-mail"
        required
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
      />
      {!fixedAmount && (
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          step="0.01"
          min="1"
          placeholder="Quanto você quer pagar (R$)"
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Gerando Pix…" : "Gerar QR Code Pix"}
      </button>
    </form>
  );
}
