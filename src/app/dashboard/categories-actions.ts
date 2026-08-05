"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireProUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username, plan").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");
  if (profile.plan !== "pro") throw new Error("Categorias são um recurso exclusivo do plano PRO.");

  return { supabase, user, profile };
}

function revalidateAll(username: string) {
  revalidatePath(`/${username}`);
  revalidatePath("/dashboard");
}

export async function createCategory(formData: FormData) {
  const { supabase, user, profile } = await requireProUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Dê um nome pra categoria.");

  const { data: existing } = await supabase
    .from("link_categories")
    .select("position")
    .eq("profile_id", user.id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("link_categories").insert({
    profile_id: user.id,
    title,
    position: (existing?.position ?? -1) + 1,
  });

  revalidateAll(profile.username);
}

export async function renameCategory(id: string, title: string) {
  const { supabase, user, profile } = await requireProUser();
  const trimmed = title.trim();
  if (!trimmed) throw new Error("Nome não pode ficar vazio.");

  await supabase.from("link_categories").update({ title: trimmed }).eq("id", id).eq("profile_id", user.id);
  revalidateAll(profile.username);
}

export async function deleteCategory(id: string) {
  const { supabase, user, profile } = await requireProUser();
  await supabase.from("link_categories").delete().eq("id", id).eq("profile_id", user.id);
  revalidateAll(profile.username);
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase, user, profile } = await requireProUser();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("link_categories").update({ position: index }).eq("id", id).eq("profile_id", user.id),
    ),
  );

  revalidateAll(profile.username);
}
