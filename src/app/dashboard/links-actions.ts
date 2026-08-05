"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidUrl } from "@/lib/utils";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

function revalidatePublicPage(username: string) {
  revalidatePath(`/${username}`);
}

export async function createLink(formData: FormData) {
  const { supabase, user } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;

  if (!title || !isValidUrl(url)) {
    throw new Error("Título ou URL inválidos.");
  }

  const { data: existing } = await supabase
    .from("links")
    .select("position")
    .eq("profile_id", user.id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (existing?.position ?? -1) + 1;

  await supabase.from("links").insert({
    profile_id: user.id,
    title,
    url,
    category_id: categoryId,
    position: nextPosition,
  });

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (profile) revalidatePublicPage(profile.username);
  revalidatePath("/dashboard");
}

export async function updateLink(id: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;

  if (!title || !isValidUrl(url)) {
    throw new Error("Título ou URL inválidos.");
  }

  await supabase.from("links").update({ title, url, category_id: categoryId }).eq("id", id).eq("profile_id", user.id);

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (profile) revalidatePublicPage(profile.username);
  revalidatePath("/dashboard");
}

export async function toggleLink(id: string, isActive: boolean) {
  const { supabase, user } = await requireUser();
  await supabase.from("links").update({ is_active: isActive }).eq("id", id).eq("profile_id", user.id);

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (profile) revalidatePublicPage(profile.username);
  revalidatePath("/dashboard");
}

export async function deleteLink(id: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("links").delete().eq("id", id).eq("profile_id", user.id);

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (profile) revalidatePublicPage(profile.username);
  revalidatePath("/dashboard");
}

export async function reorderLinks(orderedIds: string[]) {
  const { supabase, user } = await requireUser();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("links").update({ position: index }).eq("id", id).eq("profile_id", user.id),
    ),
  );

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (profile) revalidatePublicPage(profile.username);
  revalidatePath("/dashboard");
}
