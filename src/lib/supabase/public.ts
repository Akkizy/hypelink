import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente somente leitura, sem acesso a cookies — não força renderização
 * dinâmica, permitindo que páginas públicas (ex: /[username]) sejam
 * geradas estaticamente e cacheadas via ISR (`export const revalidate`).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
