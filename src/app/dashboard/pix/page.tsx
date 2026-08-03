import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatePixBlockForm } from "./create-pix-block-form";
import { PixBlockRow } from "./pix-block-row";

export default async function PixDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();

  if (profile?.plan !== "pro") {
    return (
      <div className="max-w-xl rounded-xl border border-black/10 bg-white p-8 text-center">
        <h1 className="text-lg font-bold">Receba pagamentos via Pix na sua página</h1>
        <p className="mt-2 text-sm text-black/60">
          Esse é um recurso exclusivo do plano PRO: crie blocos de doação ou venda com QR code Pix gerado na hora,
          direto na sua página de bio.
        </p>
        <Link
          href="/dashboard/billing"
          className="mt-6 inline-block rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white"
        >
          Assinar PRO
        </Link>
      </div>
    );
  }

  const { data: blocks } = await supabase
    .from("pix_blocks")
    .select("*")
    .eq("profile_id", user.id)
    .order("position", { ascending: true });

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold">Blocos de pagamento Pix</h1>
      <CreatePixBlockForm />
      <div className="mt-6 flex flex-col gap-2">
        {(blocks ?? []).map((block) => (
          <PixBlockRow key={block.id} block={block} />
        ))}
        {(blocks ?? []).length === 0 && (
          <p className="text-sm text-black/50">Nenhum bloco de Pix criado ainda.</p>
        )}
      </div>
      <p className="mt-4 text-xs text-black/40">
        Deixe o campo valor em branco para permitir que o pagador escolha quanto pagar (ideal para doações).
      </p>
    </div>
  );
}
