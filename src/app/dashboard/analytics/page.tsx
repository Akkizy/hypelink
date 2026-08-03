import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClicksChart } from "./clicks-chart";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const { data: links } = await supabase
    .from("links")
    .select("id, title, click_count")
    .eq("profile_id", user.id)
    .order("click_count", { ascending: false });

  const totalClicks = (links ?? []).reduce((sum, l) => sum + l.click_count, 0);
  const isPro = profile?.plan === "pro";

  let dailyClicks: { day: string; count: number }[] = [];
  let deviceBreakdown: { device: string; count: number }[] = [];
  let topReferrers: { referrer: string; count: number }[] = [];

  if (isPro) {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: clicks } = await supabase
      .from("link_clicks")
      .select("created_at, device_type, referrer")
      .eq("profile_id", user.id)
      .gte("created_at", since);

    const byDay = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    const byDevice = new Map<string, number>();
    const byReferrer = new Map<string, number>();

    for (const click of clicks ?? []) {
      const day = click.created_at.slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);

      const device = click.device_type ?? "unknown";
      byDevice.set(device, (byDevice.get(device) ?? 0) + 1);

      const referrer = click.referrer ? new URL(click.referrer).hostname : "direto";
      byReferrer.set(referrer, (byReferrer.get(referrer) ?? 0) + 1);
    }

    dailyClicks = Array.from(byDay.entries()).map(([day, count]) => ({ day, count }));
    deviceBreakdown = Array.from(byDevice.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);
    topReferrers = Array.from(byReferrer.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">Analytics</h1>

      <div className="rounded-xl border border-black/10 bg-white p-6">
        <p className="text-sm text-black/50">Total de cliques</p>
        <p className="text-3xl font-bold">{totalClicks}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {(links ?? []).map((link) => (
          <div key={link.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm">
            <span className="truncate">{link.title}</span>
            <span className="font-medium text-black/60">{link.click_count}</span>
          </div>
        ))}
      </div>

      {isPro ? (
        <div className="mt-8 flex flex-col gap-8">
          <ClicksChart data={dailyClicks} />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="mb-2 text-sm font-medium text-black/70">Dispositivo</h2>
              <div className="flex flex-col gap-1.5">
                {deviceBreakdown.length === 0 && <p className="text-sm text-black/40">Sem dados ainda.</p>}
                {deviceBreakdown.map((d) => (
                  <div key={d.device} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-black/70">{d.device}</span>
                    <span className="font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-medium text-black/70">Origem</h2>
              <div className="flex flex-col gap-1.5">
                {topReferrers.length === 0 && <p className="text-sm text-black/40">Sem dados ainda.</p>}
                {topReferrers.map((r) => (
                  <div key={r.referrer} className="flex items-center justify-between text-sm">
                    <span className="truncate text-black/70">{r.referrer}</span>
                    <span className="font-medium">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-black/15 p-6 text-center">
          <p className="text-sm text-black/60">
            Desbloqueie gráfico de cliques por dia, origem e dispositivo no{" "}
            <Link href="/dashboard/billing" className="font-medium underline">
              plano PRO
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
