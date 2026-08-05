"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPreApprovalClient, PRO_PLAN_PRICE_BRL } from "@/lib/mercadopago";

export async function startProCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username, plan").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");
  if (profile.plan === "pro") redirect("/dashboard/billing");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const preApproval = await getPreApprovalClient().create({
    body: {
      reason: "hyperlink PRO — assinatura mensal",
      external_reference: user.id,
      payer_email: user.email,
      back_url: `${siteUrl}/dashboard/billing`,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: PRO_PLAN_PRICE_BRL,
        currency_id: "BRL",
      },
      status: "pending",
    },
  });

  await supabase.from("subscriptions").upsert(
    {
      profile_id: user.id,
      mp_subscription_id: preApproval.id,
      status: "pending",
    },
    { onConflict: "profile_id" },
  );

  if (!preApproval.init_point) throw new Error("Falha ao iniciar checkout.");
  redirect(preApproval.init_point);
}
