import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { FONTS } from "@/lib/fonts";
import { AVATAR_SHAPES } from "@/lib/avatar-shapes";
import { DesignForm } from "./design-form";

export default async function DesignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, theme, font, plan, avatar_url, avatar_shape, banner_url")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-xl font-bold">Design da sua página</h1>
      <DesignForm profile={profile} themes={THEMES} fonts={FONTS} avatarShapes={AVATAR_SHAPES} />
    </div>
  );
}
