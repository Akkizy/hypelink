"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentClient } from "@/lib/mercadopago";

export type CreatePixPaymentResult = {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
};

export async function createPixPayment(
  blockId: string,
  input: { name: string; email: string; amount: number },
): Promise<CreatePixPaymentResult> {
  if (!input.name.trim() || !input.email.trim()) {
    throw new Error("Preencha nome e e-mail.");
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Valor inválido.");
  }

  const supabase = createAdminClient();
  const { data: block } = await supabase
    .from("pix_blocks")
    .select("id, title, is_active, profile_id, amount")
    .eq("id", blockId)
    .maybeSingle();

  if (!block || !block.is_active) throw new Error("Este bloco de pagamento não está mais disponível.");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", block.profile_id).maybeSingle();
  if (profile?.plan !== "pro") throw new Error("Este bloco de pagamento não está mais disponível.");

  const amount = block.amount ?? input.amount;
  const [firstName, ...rest] = input.name.trim().split(" ");

  const payment = await getPaymentClient().create({
    body: {
      transaction_amount: amount,
      description: block.title,
      payment_method_id: "pix",
      external_reference: block.id,
      payer: {
        email: input.email.trim(),
        first_name: firstName,
        last_name: rest.join(" ") || undefined,
      },
    },
  });

  const transactionData = payment.point_of_interaction?.transaction_data;
  if (!transactionData?.qr_code || !transactionData?.qr_code_base64) {
    throw new Error("Não foi possível gerar o Pix. Tente novamente.");
  }

  await supabase.from("pix_transactions").insert({
    pix_block_id: block.id,
    profile_id: block.profile_id,
    mp_payment_id: String(payment.id),
    status: "pending",
    amount,
    payer_name: input.name.trim(),
    payer_email: input.email.trim(),
  });

  return {
    paymentId: String(payment.id),
    qrCode: transactionData.qr_code,
    qrCodeBase64: transactionData.qr_code_base64,
  };
}
