"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentClient } from "@/lib/mercadopago";

export type BrickFormData = {
  transaction_amount: number;
  payment_method_id: string;
  token?: string;
  issuer_id?: string;
  installments?: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: { type: string; number: string };
  };
};

export type CreateBrickPaymentResult = {
  paymentId: string;
};

export async function createBrickPayment(blockId: string, formData: BrickFormData): Promise<CreateBrickPaymentResult> {
  const supabase = createAdminClient();
  const { data: block } = await supabase
    .from("pix_blocks")
    .select("id, title, is_active, profile_id, amount")
    .eq("id", blockId)
    .maybeSingle();

  if (!block || !block.is_active) throw new Error("Este bloco de pagamento não está mais disponível.");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", block.profile_id).maybeSingle();
  if (profile?.plan !== "pro") throw new Error("Este bloco de pagamento não está mais disponível.");

  const amount = block.amount ?? formData.transaction_amount;
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Valor inválido.");

  const payment = await getPaymentClient().create({
    body: {
      transaction_amount: amount,
      payment_method_id: formData.payment_method_id,
      token: formData.token,
      issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
      installments: formData.installments,
      payer: formData.payer,
      description: block.title,
      external_reference: block.id,
    },
  });

  if (!payment.id) throw new Error("Não foi possível processar o pagamento. Tente novamente.");

  await supabase.from("pix_transactions").insert({
    pix_block_id: block.id,
    profile_id: block.profile_id,
    mp_payment_id: String(payment.id),
    status: payment.status === "approved" ? "approved" : payment.status === "rejected" ? "rejected" : "pending",
    amount,
    payer_name: formData.payer.first_name ?? null,
    payer_email: formData.payer.email ?? null,
  });

  return { paymentId: String(payment.id) };
}
