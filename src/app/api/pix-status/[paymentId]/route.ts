import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("pix_transactions")
    .select("status")
    .eq("mp_payment_id", paymentId)
    .maybeSingle();

  return NextResponse.json({ status: data?.status ?? "pending" });
}
