import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { getAvatarShape } from "@/lib/avatar-shapes";
import { getBannerSize } from "@/lib/banner-sizes";
import { groupLinksByCategory } from "@/lib/link-groups";
import { TrackedLink } from "./tracked-link";
import { PixBlockCard } from "./pix-block-card";
import { YouTubeStatus } from "./youtube-status";

export const revalidate = 3600;

async function getProfileData(username: string) {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, avatar_url, avatar_shape, banner_url, banner_size, banner_fade, theme, font, plan, youtube_channel_id",
    )
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const [{ data: links }, { data: categories }, { data: pixBlocks }] = await Promise.all([
    supabase
      .from("links")
      .select("id, title, url, position, category_id")
      .eq("profile_id", profile.id)
      .eq("is_active", true)
      .order("position", { ascending: true }),
    supabase
      .from("link_categories")
      .select("*")
      .eq("profile_id", profile.id)
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

  return { profile, links: links ?? [], categories: categories ?? [], pixBlocks: pixBlocks ?? [] };
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
    title: `${title} — hyperlink`,
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

  const { profile, links, categories, pixBlocks } = data;
  const theme = getTheme(profile.theme);
  const font = getFont(profile.font);
  const avatarShape = getAvatarShape(profile.avatar_shape);
  const bannerSize = getBannerSize(profile.banner_size);
  const initial = (profile.display_name ?? profile.username).slice(0, 1).toUpperCase();
  const groups = groupLinksByCategory(links, categories);

  return (
    <main className={`min-h-screen ${theme.page} ${font.className}`}>
      {/* Banner */}
      <div className={`${bannerSize.publicClass} w-full ${theme.bannerFallback} relative overflow-hidden`}>
        {profile.banner_url && (
          <Image src={profile.banner_url} alt="" fill priority className="object-cover" sizes="100vw" />
        )}
        {profile.banner_fade && (
          <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent ${theme.bannerFadeTo}`} />
        )}
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 pb-16">
        {/* Avatar overlapping the banner */}
        <div className="relative z-10 -mt-12 sm:-mt-14">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              width={96}
              height={96}
              className={`h-24 w-24 border-4 object-cover shadow-lg ${theme.avatarBorder} ${avatarShape.className}`}
            />
          ) : (
            <div
              className={`flex h-24 w-24 items-center justify-center border-4 text-3xl font-bold shadow-lg ${theme.avatarBorder} ${theme.card} ${avatarShape.className}`}
            >
              {initial}
            </div>
          )}
        </div>

        <h1 className={`mt-4 text-lg font-bold ${theme.text}`}>
          {profile.display_name ?? `@${profile.username}`}
        </h1>
        {profile.display_name && <p className={`text-sm ${theme.subtext}`}>@{profile.username}</p>}
        {profile.bio && <p className={`mt-2 text-center text-sm leading-relaxed ${theme.subtext}`}>{profile.bio}</p>}

        {profile.plan === "pro" && profile.youtube_channel_id && (
          <div className="mt-6 w-full">
            <YouTubeStatus username={profile.username} theme={theme} />
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-5">
          {groups.map((group) => (
            <div key={group.key ?? "none"} className="flex w-full flex-col gap-3">
              {group.title && (
                <h2 className={`text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>{group.title}</h2>
              )}
              {group.links.map((link) => (
                <TrackedLink
                  key={link.id}
                  linkId={link.id}
                  href={link.url}
                  title={link.title}
                  className={`${theme.card} ${theme.link}`}
                />
              ))}
            </div>
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
          <Link href="/" className={`mt-10 text-xs font-medium ${theme.subtext} opacity-70 transition-opacity hover:opacity-100`}>
            feito com hyperlink
          </Link>
        )}
      </div>
    </main>
  );
}
