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
  if (profile.plan !== "pro") throw new Error("Recurso exclusivo do plano PRO.");

  return { supabase, user, profile };
}

function revalidatePublicPage(username: string) {
  revalidatePath(`/${username}`);
}

export async function createPixBlock(formData: FormData) {
  const { supabase, user, profile } = await requireProUser();

  const type = String(formData.get("type") ?? "donation") as "donation" | "product";
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const amount = amountRaw ? Number(amountRaw) : null;

  if (!title) throw new Error("Título obrigatório.");
  if (amount !== null && (!Number.isFinite(amount) || amount <= 0)) {
    throw new Error("Valor inválido.");
  }

  const { data: existing } = await supabase
    .from("pix_blocks")
    .select("position")
    .eq("profile_id", user.id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("pix_blocks").insert({
    profile_id: user.id,
    type,
    title,
    description: description || null,
    amount,
    position: (existing?.position ?? -1) + 1,
  });

  revalidatePublicPage(profile.username);
  revalidatePath("/dashboard/pix");
}

export async function togglePixBlock(id: string, isActive: boolean) {
  const { supabase, user, profile } = await requireProUser();
  await supabase.from("pix_blocks").update({ is_active: isActive }).eq("id", id).eq("profile_id", user.id);
  revalidatePublicPage(profile.username);
  revalidatePath("/dashboard/pix");
}

export async function deletePixBlock(id: string) {
  const { supabase, user, profile } = await requireProUser();
  await supabase.from("pix_blocks").delete().eq("id", id).eq("profile_id", user.id);
  revalidatePublicPage(profile.username);
  revalidatePath("/dashboard/pix");
}
