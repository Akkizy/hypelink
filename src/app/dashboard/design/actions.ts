"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { FONTS } from "@/lib/fonts";
import { AVATAR_SHAPES } from "@/lib/avatar-shapes";

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
  const font = String(formData.get("font") ?? "sans");
  const avatarShape = String(formData.get("avatar_shape") ?? "circle");

  const selectedTheme = THEMES.find((t) => t.id === theme);
  if (!selectedTheme || (selectedTheme.pro && profile.plan !== "pro")) {
    throw new Error("Tema disponível apenas no plano PRO.");
  }

  const selectedFont = FONTS.find((f) => f.id === font);
  if (!selectedFont || (selectedFont.pro && profile.plan !== "pro")) {
    throw new Error("Fonte disponível apenas no plano PRO.");
  }

  if (!AVATAR_SHAPES.some((s) => s.id === avatarShape)) {
    throw new Error("Formato de avatar inválido.");
  }

  await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
      theme,
      font,
      avatar_shape: avatarShape,
    })
    .eq("id", user.id);

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/design");
}
