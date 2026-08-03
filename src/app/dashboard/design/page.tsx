import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEMES } from "@/lib/themes";
import { DesignForm } from "./design-form";

export default async function DesignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, theme, plan, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold">Design da sua página</h1>
      <DesignForm profile={profile} themes={THEMES} />
    </div>
  );
}
