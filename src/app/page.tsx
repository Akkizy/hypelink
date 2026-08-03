import Link from "next/link";

const freeFeatures = [
  "Links ilimitados",
  "4 temas prontos",
  "Contador de cliques",
  "Página com carregamento instantâneo",
];

const proFeatures = [
  "Tudo do plano grátis",
  "Cobranças via Pix direto na sua página (doações e vendas)",
  "Analytics avançado: cliques ao longo do tempo, origem e dispositivo",
  "Temas exclusivos e sem marca \"feito com linka\"",
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-xl font-bold">linka</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-black/60 hover:text-black">
            Entrar
          </Link>
          <Link href="/signup" className="rounded-full bg-black px-4 py-2 font-medium text-white">
            Criar conta grátis
          </Link>
        </nav>
      </header>

      <section className="flex flex-col items-center py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Todos os seus links, numa página que carrega na hora.
        </h1>
        <p className="mt-4 max-w-xl text-black/60">
          Como o Linktree, só que mais rápido — e com um jeito de receber pagamentos via Pix direto na sua página de bio.
        </p>
        <Link
          href="/signup"
          className="mt-8 rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-black/85"
        >
          Criar minha página grátis
        </Link>
      </section>

      <section id="planos" className="grid gap-6 pb-24 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-8">
          <h2 className="text-lg font-bold">Grátis</h2>
          <p className="mt-1 text-3xl font-bold">
            R$ 0<span className="text-base font-normal text-black/50">/mês</span>
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-emerald-600">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 block rounded-lg border border-black/15 py-2.5 text-center text-sm font-medium hover:bg-black/5"
          >
            Começar grátis
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-black bg-neutral-950 p-8 text-white">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">Diferencial</span>
          <h2 className="mt-3 text-lg font-bold">PRO</h2>
          <p className="mt-1 text-3xl font-bold">
            R$ 19,90<span className="text-base font-normal text-white/50">/mês</span>
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-emerald-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 block rounded-lg bg-white py-2.5 text-center text-sm font-medium text-black hover:bg-white/90"
          >
            Assinar PRO
          </Link>
        </div>
      </section>
    </main>
  );
}
