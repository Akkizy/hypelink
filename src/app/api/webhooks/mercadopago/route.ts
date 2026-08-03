import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentClient, getPreApprovalClient } from "@/lib/mercadopago";

async function handlePreApproval(id: string) {
  const supabase = createAdminClient();
  const preApproval = await getPreApprovalClient().get({ id });

  const profileId = preApproval.external_reference;
  if (!profileId) return;

  const status = preApproval.status === "authorized" ? "authorized" : preApproval.status === "cancelled" ? "cancelled" : "pending";

  await supabase
    .from("subscriptions")
    .update({
      status,
      mp_subscription_id: preApproval.id,
      current_period_end:
        status === "authorized"
          ? new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    })
    .eq("profile_id", profileId);

  await supabase
    .from("profiles")
    .update({ plan: status === "authorized" ? "pro" : "free" })
    .eq("id", profileId);
}

async function handlePayment(id: string) {
  const supabase = createAdminClient();
  const payment = await getPaymentClient().get({ id });

  const pixBlockId = payment.external_reference;
  if (!pixBlockId) return;

  const { data: block } = await supabase.from("pix_blocks").select("id, profile_id").eq("id", pixBlockId).maybeSingle();
  if (!block) return;

  const status =
    payment.status === "approved" ? "approved" : payment.status === "rejected" ? "rejected" : payment.status === "cancelled" ? "cancelled" : "pending";

  await supabase.from("pix_transactions").upsert(
    {
      pix_block_id: block.id,
      profile_id: block.profile_id,
      mp_payment_id: String(payment.id),
      status,
      amount: payment.transaction_amount ?? 0,
      payer_name: payment.payer?.first_name ?? null,
      payer_email: payment.payer?.email ?? null,
    },
    { onConflict: "mp_payment_id" },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const type = request.nextUrl.searchParams.get("type") ?? body?.type;
  const dataId = request.nextUrl.searchParams.get("data.id") ?? body?.data?.id;

  if (!type || !dataId) {
    return NextResponse.json({ ok: true });
  }

  try {
    if (type === "preapproval") {
      await handlePreApproval(String(dataId));
    } else if (type === "payment") {
      await handlePayment(String(dataId));
    }
  } catch (error) {
    console.error("mercadopago webhook error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
