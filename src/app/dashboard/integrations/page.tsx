import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConnectYouTubeForm } from "./connect-youtube-form";

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, youtube_channel_id, youtube_channel_title")
    .eq("id", user.id)
    .single();

  if (profile?.plan !== "pro") {
    return (
      <div className="max-w-xl rounded-xl border border-black/10 bg-white p-8 text-center">
        <h1 className="text-lg font-bold">Mostre quando você está ao vivo, automaticamente</h1>
        <p className="mt-2 text-sm text-black/60">
          Recurso exclusivo do plano PRO: conecte seu canal do YouTube e sua página de bio mostra sozinha um aviso
          de &quot;AO VIVO&quot; quando você estiver transmitindo, e o vídeo mais recente sempre que postar um novo — sem
          precisar editar nada manualmente.
        </p>
        <Link href="/dashboard/billing" className="mt-6 inline-block rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white">
          Assinar PRO
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-xl font-bold">Integrações</h1>
      <p className="mb-6 text-sm text-black/60">
        Conecte seu canal do YouTube. Sua página passa a mostrar automaticamente um selo de &quot;AO VIVO&quot; quando você
        estiver transmitindo e o seu vídeo mais recente sempre que você postar um novo.
      </p>
      <ConnectYouTubeForm
        channelId={profile.youtube_channel_id}
        channelTitle={profile.youtube_channel_title}
      />
    </div>
  );
}
