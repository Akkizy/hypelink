"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resolveYouTubeChannel } from "@/lib/youtube";

async function requireProUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username, plan").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");
  if (profile.plan !== "pro") throw new Error("Recurso exclusivo do plano PRO.");

  return { supabase, user, profile };
}

export async function connectYouTubeChannel(formData: FormData) {
  const { supabase, user, profile } = await requireProUser();
  const input = String(formData.get("channel") ?? "").trim();
  if (!input) throw new Error("Informe o link, @usuário ou ID do canal.");

  const channel = await resolveYouTubeChannel(input);

  await supabase
    .from("profiles")
    .update({ youtube_channel_id: channel.channelId, youtube_channel_title: channel.title })
    .eq("id", user.id);

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/integrations");
}

export async function disconnectYouTubeChannel() {
  const { supabase, user, profile } = await requireProUser();

  await supabase
    .from("profiles")
    .update({ youtube_channel_id: null, youtube_channel_title: null })
    .eq("id", user.id);

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/integrations");
}
