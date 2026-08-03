"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { isValidUrl } from "@/lib/utils";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username, plan").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const theme = String(formData.get("theme") ?? "default");
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  const selected = THEMES.find((t) => t.id === theme);
  if (!selected || (selected.pro && profile.plan !== "pro")) {
    throw new Error("Tema disponível apenas no plano PRO.");
  }
  if (avatarUrl && !isValidUrl(avatarUrl)) {
    throw new Error("URL de avatar inválida.");
  }

  await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
      theme,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/design");
}
