import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, plan")
    .eq("id", user.id)
    .single();

  const navItems = [
    { href: "/dashboard", label: "Links" },
    { href: "/dashboard/design", label: "Design" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/pix", label: "Pix" },
    { href: "/dashboard/billing", label: "Assinatura" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3">
        <Link href="/" className="font-bold">
          linka
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {profile && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-black/60 hover:text-black"
            >
              linka.app/{profile.username} ↗
            </a>
          )}
          {profile?.plan === "pro" ? (
            <span className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">PRO</span>
          ) : (
            <Link href="/dashboard/billing" className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              Virar PRO
            </Link>
          )}
          <form action={logout}>
            <button type="submit" className="text-black/60 hover:text-black">
              Sair
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
        <nav className="flex w-40 shrink-0 flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-black/70 hover:bg-black/5 hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
