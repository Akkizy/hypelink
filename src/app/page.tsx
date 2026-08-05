import Link from "next/link";
import { LinkIcon } from "@/lib/link-icons";
import { PhoneFrame } from "@/components/phone-frame";

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
  "Temas exclusivos e sem marca \"feito com hyperlink\"",
];

const mockLinks = [
  { title: "Meu Instagram", url: "https://instagram.com" },
  { title: "Assista no YouTube", url: "https://youtube.com" },
  { title: "Fala comigo no WhatsApp", url: "https://wa.me" },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-fuchsia-200 via-purple-200 to-indigo-200 opacity-60 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <span className="text-xl font-bold">hyperlink</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-black/60 hover:text-black">
              Entrar
            </Link>
            <Link href="/signup" className="rounded-full bg-black px-4 py-2 font-medium text-white">
              Criar conta grátis
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60">
              ⚡ Carrega quase instantâneo
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Todos os seus links, numa página que carrega na hora.
            </h1>
            <p className="mt-4 max-w-lg text-black/60">
              Como o Linktree, só que mais rápido — com banner, foto de perfil, ícones automáticos nos seus links e
              um jeito de receber pagamentos via Pix direto na sua página de bio.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-black/85"
              >
                Criar minha página grátis
              </Link>
              <Link href="#planos" className="text-sm font-medium text-black/60 hover:text-black">
                Ver planos ↓
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <PhoneMockup />
          </div>
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

          <div className="relative rounded-2xl border-2 border-black bg-neutral-950 p-8 text-white">
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
      </div>
    </main>
  );
}

function PhoneMockup() {
  return (
    <PhoneFrame bannerClassName="bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-500">
      <div className="flex min-h-full flex-col items-center bg-white px-5 pb-8">
        <div className="relative z-10 -mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white text-xl font-bold text-neutral-900 shadow-lg">
          A
        </div>
        <p className="mt-2 text-sm font-bold text-neutral-900">Ana Criadora</p>
        <p className="text-xs text-neutral-500">@anacriadora</p>
        <div className="mt-4 flex w-full flex-col gap-2">
          {mockLinks.map((link) => {
            return (
              <div
                key={link.title}
                className="flex w-full items-center gap-2.5 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-medium text-neutral-800 shadow-sm"
              >
                <LinkIcon url={link.url} className="h-4 w-4 shrink-0 opacity-70" />
                <span className="flex-1 text-center">{link.title}</span>
                <span className="w-4 shrink-0" aria-hidden />
              </div>
            );
          })}
          <div className="flex w-full items-center gap-2.5 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">💸</span>
            <span className="flex-1 text-center">Pix da gorjeta</span>
            <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px]">Pix livre</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
