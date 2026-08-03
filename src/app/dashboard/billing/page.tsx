import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PRO_PLAN_PRICE_BRL } from "@/lib/mercadopago";
import { formatBRL } from "@/lib/utils";
import { UpgradeButton } from "./upgrade-button";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("profile_id", user.id)
    .maybeSingle();

  const isPro = profile?.plan === "pro";

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold">Assinatura</h1>

      <div className="rounded-xl border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Plano atual</p>
            <p className="text-2xl font-bold">{isPro ? "PRO" : "Grátis"}</p>
          </div>
          {isPro && subscription?.status && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {subscription.status}
            </span>
          )}
        </div>

        {!isPro && (
          <div className="mt-6">
            <p className="text-sm text-black/60">
              Assine o PRO por {formatBRL(PRO_PLAN_PRICE_BRL)}/mês e desbloqueie cobranças via Pix na sua página,
              analytics avançado e temas exclusivos.
            </p>
            <UpgradeButton />
          </div>
        )}

        {isPro && (
          <p className="mt-4 text-sm text-black/60">
            Sua assinatura é gerenciada pelo Mercado Pago. Para cancelar, acesse sua conta Mercado Pago em
            Assinaturas.
          </p>
        )}
      </div>
    </div>
  );
}
