"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { FONTS } from "@/lib/fonts";
import { AVATAR_SHAPES } from "@/lib/avatar-shapes";
import { AVATAR_SIZES } from "@/lib/avatar-sizes";
import { BANNER_SIZES } from "@/lib/banner-sizes";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username, plan").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");
  const isPro = profile.plan === "pro";

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const theme = String(formData.get("theme") ?? "default");
  const font = String(formData.get("font") ?? "sans");
  const avatarShape = String(formData.get("avatar_shape") ?? "circle");
  const avatarSize = String(formData.get("avatar_size") ?? "medium");
  const bannerSize = String(formData.get("banner_size") ?? "medium");
  const bannerFade = formData.get("banner_fade") === "on";
  const customBg = String(formData.get("custom_bg_color") ?? "#ffffff");
  const customCard = String(formData.get("custom_card_color") ?? "#f5f5f5");
  const customText = String(formData.get("custom_text_color") ?? "#171717");

  const selectedTheme = THEMES.find((t) => t.id === theme);
  if (!selectedTheme || (selectedTheme.pro && !isPro)) {
    throw new Error("Tema disponível apenas no plano PRO.");
  }

  const selectedFont = FONTS.find((f) => f.id === font);
  if (!selectedFont || (selectedFont.pro && !isPro)) {
    throw new Error("Fonte disponível apenas no plano PRO.");
  }

  if (!AVATAR_SHAPES.some((s) => s.id === avatarShape)) {
    throw new Error("Formato de avatar inválido.");
  }

  if (!AVATAR_SIZES.some((s) => s.id === avatarSize)) {
    throw new Error("Tamanho de avatar inválido.");
  }
  if (avatarSize !== "medium" && !isPro) {
    throw new Error("Tamanho de foto de perfil personalizável apenas no plano PRO.");
  }

  if (!BANNER_SIZES.some((s) => s.id === bannerSize)) {
    throw new Error("Tamanho de banner inválido.");
  }

  if (theme === "custom") {
    if (!isPro) throw new Error("Cores personalizadas disponíveis apenas no plano PRO.");
    if (![customBg, customCard, customText].every((c) => HEX_COLOR.test(c))) {
      throw new Error("Cor inválida — use o seletor de cores.");
    }
  }

  await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
      theme,
      font,
      avatar_shape: avatarShape,
      avatar_size: avatarSize,
      banner_size: bannerSize,
      banner_fade: bannerFade,
      custom_bg_color: customBg,
      custom_card_color: customCard,
      custom_text_color: customText,
    })
    .eq("id", user.id);

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/design");
}
