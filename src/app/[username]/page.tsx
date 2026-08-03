import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getTheme } from "@/lib/themes";
import { TrackedLink } from "./tracked-link";
import { PixBlockCard } from "./pix-block-card";

export const revalidate = 3600;

async function getProfileData(username: string) {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme, plan")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const [{ data: links }, { data: pixBlocks }] = await Promise.all([
    supabase
      .from("links")
      .select("id, title, url, position")
      .eq("profile_id", profile.id)
      .eq("is_active", true)
      .order("position", { ascending: true }),
    profile.plan === "pro"
      ? supabase
          .from("pix_blocks")
          .select("id, type, title, description, amount, position")
          .eq("profile_id", profile.id)
          .eq("is_active", true)
          .order("position", { ascending: true })
      : Promise.resolve({ data: [] as never[] }),
  ]);

  return { profile, links: links ?? [], pixBlocks: pixBlocks ?? [] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) return {};

  const title = data.profile.display_name ?? `@${data.profile.username}`;
  return {
    title: `${title} — linka`,
    description: data.profile.bio ?? undefined,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) notFound();

  const { profile, links, pixBlocks } = data;
  const theme = getTheme(profile.theme);

  return (
    <main className={`flex min-h-screen flex-col items-center px-6 py-16 ${theme.page}`}>
      <div className="flex w-full max-w-md flex-col items-center">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.display_name ?? profile.username}
            width={88}
            height={88}
            className="rounded-full object-cover"
          />
        ) : (
          <div className={`flex h-[88px] w-[88px] items-center justify-center rounded-full text-2xl font-bold ${theme.card}`}>
            {(profile.display_name ?? profile.username).slice(0, 1).toUpperCase()}
          </div>
        )}
        <h1 className={`mt-4 text-lg font-bold ${theme.text}`}>
          {profile.display_name ?? `@${profile.username}`}
        </h1>
        {profile.bio && <p className={`mt-1 text-center text-sm ${theme.subtext}`}>{profile.bio}</p>}

        <div className="mt-8 flex w-full flex-col gap-3">
          {links.map((link) => (
            <TrackedLink key={link.id} linkId={link.id} href={link.url} className={`${theme.card} ${theme.link}`}>
              {link.title}
            </TrackedLink>
          ))}
        </div>

        {pixBlocks.length > 0 && (
          <div className="mt-6 flex w-full flex-col gap-3">
            {pixBlocks.map((block) => (
              <PixBlockCard key={block.id} block={block} theme={theme} />
            ))}
          </div>
        )}

        {profile.plan !== "pro" && (
          <a
            href="/"
            className={`mt-10 text-xs ${theme.subtext} opacity-70 hover:opacity-100`}
          >
            feito com linka
          </a>
        )}
      </div>
    </main>
  );
}
