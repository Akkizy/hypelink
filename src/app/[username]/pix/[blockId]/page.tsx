import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { formatBRL } from "@/lib/utils";
import { PixCheckout } from "./checkout";

export const revalidate = 60;

export default async function PixCheckoutPage({
  params,
}: {
  params: Promise<{ username: string; blockId: string }>;
}) {
  const { blockId } = await params;
  const supabase = createPublicClient();

  const { data: block } = await supabase
    .from("pix_blocks")
    .select("id, title, description, amount, type, is_active, profile_id")
    .eq("id", blockId)
    .maybeSingle();

  if (!block || !block.is_active) notFound();

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", block.profile_id).maybeSingle();
  if (profile?.plan !== "pro") notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-black/10 p-6">
        <span className="text-xs font-medium text-black/50">
          {block.type === "donation" ? "Doação via Pix" : "Compra via Pix"}
        </span>
        <h1 className="mt-1 text-lg font-bold">{block.title}</h1>
        {block.description && <p className="mt-1 text-sm text-black/60">{block.description}</p>}
        {block.amount && <p className="mt-2 text-2xl font-bold">{formatBRL(block.amount)}</p>}

        <PixCheckout blockId={block.id} fixedAmount={block.amount} />
      </div>
    </main>
  );
}
