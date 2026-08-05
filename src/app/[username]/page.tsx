import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getTheme, getCustomThemeVars, type Theme } from "@/lib/themes";
import { getFont, type FontOption } from "@/lib/fonts";
import { getAvatarShape } from "@/lib/avatar-shapes";
import { getAvatarSize } from "@/lib/avatar-sizes";
import { getBannerSize } from "@/lib/banner-sizes";
import { getLayoutStyle } from "@/lib/layout-styles";
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
      "id, username, display_name, bio, avatar_url, avatar_shape, avatar_size, banner_url, banner_size, banner_fade, theme, font, layout_style, plan, youtube_channel_id, custom_bg_color, custom_card_color, custom_text_color",
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
  const layoutStyle = getLayoutStyle(profile.layout_style);
  const customVars = getCustomThemeVars(profile.theme, profile);
  const groups = groupLinksByCategory(links, categories);
  const isPoster = layoutStyle.id === "poster" && profile.plan === "pro";

  const body = (
    <>
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

      {(profile.plan !== "pro" || isPoster) && (
        <Link
          href="/"
          className="mt-12 flex flex-col items-center gap-0.5 text-center opacity-70 transition-opacity hover:opacity-100"
        >
          <span className={`text-[10px] font-medium ${theme.subtext}`}>feito com</span>
          <span className={`text-lg font-extrabold ${theme.text}`}>hyperlink</span>
        </Link>
      )}
    </>
  );

  if (isPoster) {
    return (
      <PosterHeader profile={profile} theme={theme} font={font} customVars={customVars}>
        {body}
      </PosterHeader>
    );
  }

  return (
    <ClassicHeader profile={profile} theme={theme} font={font} customVars={customVars}>
      {body}
    </ClassicHeader>
  );
}

type HeaderProfile = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_shape: string;
  avatar_size: string;
  banner_url: string | null;
  banner_size: string;
  banner_fade: boolean;
};

function ClassicHeader({
  profile,
  theme,
  font,
  customVars,
  children,
}: {
  profile: HeaderProfile;
  theme: Theme;
  font: FontOption;
  customVars: React.CSSProperties | undefined;
  children: React.ReactNode;
}) {
  const avatarShape = getAvatarShape(profile.avatar_shape);
  const avatarSize = getAvatarSize(profile.avatar_size);
  const bannerSize = getBannerSize(profile.banner_size);
  const initial = (profile.display_name ?? profile.username).slice(0, 1).toUpperCase();

  return (
    <main style={customVars} className={`min-h-screen ${theme.page} ${font.className}`}>
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
        <div
          className={`relative z-10 -mt-12 border-4 shadow-lg sm:-mt-14 ${theme.avatarBorder} ${avatarShape.className} ${avatarSize.publicClass}`}
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              fill
              sizes="128px"
              className={`object-cover ${avatarShape.className}`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-3xl font-bold ${theme.card} ${avatarShape.className}`}
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

        {children}
      </div>
    </main>
  );
}

function PosterHeader({
  profile,
  theme,
  font,
  customVars,
  children,
}: {
  profile: HeaderProfile;
  theme: Theme;
  font: FontOption;
  customVars: React.CSSProperties | undefined;
  children: React.ReactNode;
}) {
  const initial = (profile.display_name ?? profile.username).slice(0, 1).toUpperCase();

  return (
    <main className={`relative min-h-screen overflow-hidden bg-neutral-950 ${font.className}`}>
      {/* ambient blurred background */}
      {profile.avatar_url && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image src={profile.avatar_url} alt="" fill className="scale-125 object-cover opacity-60 blur-3xl" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-6 py-12 pb-16 sm:max-w-lg">
        {/* one unified card: photo on top, everything else flows below inside the same rounded shell */}
        <div style={customVars} className={`w-full overflow-hidden rounded-3xl shadow-2xl ${theme.page}`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name ?? profile.username}
                fill
                sizes="(min-width: 640px) 512px, 448px"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-7xl font-bold text-white">
                {initial}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-6 px-6 text-center">
              <p className="text-3xl font-extrabold text-white drop-shadow-md">
                {profile.display_name ?? profile.username}
              </p>
              {profile.display_name && <p className="mt-0.5 text-sm text-white/80">@{profile.username}</p>}
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {profile.bio && (
              <p className={`text-center text-sm leading-relaxed ${theme.subtext}`}>{profile.bio}</p>
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
