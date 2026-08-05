import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LinkList } from "./link-list";
import { CreateLinkForm } from "./create-link-form";
import { PreviewPanel } from "./preview-panel";
import { CategoryManager } from "./category-manager";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: links }, { data: categories }, { data: profile }] = await Promise.all([
    supabase.from("links").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
    supabase.from("link_categories").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
    supabase
      .from("profiles")
      .select("username, display_name, bio, avatar_url, avatar_shape, banner_url, theme, font, plan")
      .eq("id", user.id)
      .single(),
  ]);

  if (!profile) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-bold">Seus links</h1>
        <div className="mb-6">
          <CategoryManager categories={categories ?? []} isPro={profile.plan === "pro"} />
        </div>
        <CreateLinkForm categories={categories ?? []} />
        <div className="mt-6">
          <LinkList links={links ?? []} categories={categories ?? []} />
        </div>
      </div>
      <PreviewPanel profile={profile} links={links ?? []} categories={categories ?? []} />
    </div>
  );
}
