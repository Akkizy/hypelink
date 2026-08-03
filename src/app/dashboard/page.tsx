import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LinkList } from "./link-list";
import { CreateLinkForm } from "./create-link-form";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user.id)
    .order("position", { ascending: true });

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold">Seus links</h1>
      <CreateLinkForm />
      <div className="mt-6">
        <LinkList links={links ?? []} />
      </div>
    </div>
  );
}
