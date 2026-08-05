"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

type Kind = "avatar" | "banner";

async function requireUserAndProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");

  return { supabase, user, profile };
}

function revalidateAll(username: string) {
  revalidatePath(`/${username}`);
  revalidatePath("/dashboard/design");
  revalidatePath("/dashboard");
}

async function uploadImage(file: File, kind: Kind): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato não suportado. Use PNG, JPG, WEBP ou GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Imagem muito grande (máx. 10MB).");
  }

  const { supabase, user, profile } = await requireUserAndProfile();

  const path = `${user.id}/${kind}-${Date.now()}.${EXT_BY_TYPE[file.type]}`;
  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw new Error("Falha ao enviar a imagem. Tente novamente.");

  const {
    data: { publicUrl },
  } = admin.storage.from("media").getPublicUrl(path);

  if (kind === "avatar") {
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
  } else {
    await supabase.from("profiles").update({ banner_url: publicUrl }).eq("id", user.id);
  }

  revalidateAll(profile.username);
  return publicUrl;
}

async function removeImage(kind: Kind) {
  const { supabase, user, profile } = await requireUserAndProfile();
  if (kind === "avatar") {
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
  } else {
    await supabase.from("profiles").update({ banner_url: null }).eq("id", user.id);
  }
  revalidateAll(profile.username);
}

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Selecione uma imagem.");
  return uploadImage(file, "avatar");
}

export async function uploadBanner(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Selecione uma imagem.");
  return uploadImage(file, "banner");
}

export async function removeAvatar() {
  return removeImage("avatar");
}

export async function removeBanner() {
  return removeImage("banner");
}
