import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { FONTS } from "@/lib/fonts";
import { AVATAR_SHAPES } from "@/lib/avatar-shapes";
import { AVATAR_SIZES } from "@/lib/avatar-sizes";
import { BANNER_SIZES } from "@/lib/banner-sizes";
import { LAYOUT_STYLES } from "@/lib/layout-styles";
import { DesignForm } from "./design-form";

export default async function DesignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "username, display_name, bio, theme, font, plan, avatar_url, avatar_shape, avatar_size, banner_url, banner_size, banner_fade, custom_bg_color, custom_card_color, custom_text_color, layout_style",
    )
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-xl font-bold">Design da sua página</h1>
      <DesignForm
        profile={profile}
        themes={THEMES}
        fonts={FONTS}
        avatarShapes={AVATAR_SHAPES}
        avatarSizes={AVATAR_SIZES}
        bannerSizes={BANNER_SIZES}
        layoutStyles={LAYOUT_STYLES}
      />
    </div>
  );
}
