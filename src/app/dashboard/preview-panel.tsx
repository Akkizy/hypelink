import Link from "next/link";
import { LinkIcon } from "@/lib/link-icons";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { getAvatarShape } from "@/lib/avatar-shapes";
import { getBannerSize } from "@/lib/banner-sizes";
import { groupLinksByCategory } from "@/lib/link-groups";
import { PhoneFrame } from "@/components/phone-frame";
import type { Link as LinkRow, LinkCategory, Profile } from "@/lib/supabase/types";

type PreviewProfile = Pick<
  Profile,
  | "username"
  | "display_name"
  | "bio"
  | "avatar_url"
  | "avatar_shape"
  | "banner_url"
  | "banner_size"
  | "banner_fade"
  | "theme"
  | "font"
>;

export function PreviewPanel({
  profile,
  links,
  categories,
}: {
  profile: PreviewProfile;
  links: LinkRow[];
  categories: LinkCategory[];
}) {
  const theme = getTheme(profile.theme);
  const font = getFont(profile.font);
  const avatarShape = getAvatarShape(profile.avatar_shape);
  const bannerSize = getBannerSize(profile.banner_size);
  const initial = (profile.display_name ?? profile.username).slice(0, 1).toUpperCase();
  const activeLinks = links.filter((l) => l.is_active);
  const groups = groupLinksByCategory(activeLinks, categories);

  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-black/50">Prévia — assim que a galera vê</p>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="text-xs font-medium text-black/60 underline hover:text-black"
        >
          abrir ↗
        </Link>
      </div>

      <PhoneFrame
        bannerClassName={theme.bannerFallback}
        bannerHeightClass={bannerSize.previewClass}
        bannerFadeToClass={profile.banner_fade ? theme.bannerFadeTo : undefined}
        bannerContent={
          profile.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.banner_url} alt="" className="h-full w-full object-cover" />
          ) : undefined
        }
      >
        <div className={`flex min-h-full flex-col items-center px-4 pb-8 ${theme.page} ${font.className}`}>
          <div
            className={`relative z-10 -mt-8 flex h-16 w-16 items-center justify-center border-4 shadow-lg ${theme.avatarBorder} ${avatarShape.className}`}
          >
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className={`h-full w-full object-cover ${avatarShape.className}`} />
            ) : (
              <div className={`flex h-full w-full items-center justify-center text-lg font-bold ${theme.card} ${avatarShape.className}`}>
                {initial}
              </div>
            )}
          </div>

          <p className={`mt-2 text-sm font-bold ${theme.text}`}>{profile.display_name || `@${profile.username}`}</p>
          {profile.bio && <p className={`mt-1 text-center text-[11px] leading-snug ${theme.subtext}`}>{profile.bio}</p>}

          <div className="mt-4 flex w-full flex-col gap-3">
            {activeLinks.length === 0 && (
              <p className={`py-4 text-center text-[11px] ${theme.subtext}`}>seus links aparecem aqui</p>
            )}
            {groups.map((group) => (
              <div key={group.key ?? "none"} className="flex w-full flex-col gap-1.5">
                {group.title && (
                  <h4 className={`text-[10px] font-semibold uppercase tracking-wide ${theme.subtext}`}>{group.title}</h4>
                )}
                {group.links.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[11px] font-medium ${theme.card} ${theme.link}`}
                    >
                      <LinkIcon url={link.url} className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="flex-1 truncate text-center">{link.title}</span>
                      <span className="w-3.5 shrink-0" aria-hidden />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <p className="mx-auto mt-3 max-w-[260px] text-xs text-black/40">
        Cada link ativo já está no ar e clicável em{" "}
        <span className="font-medium text-black/60">hyperlink.app/{profile.username}</span>.
      </p>
    </div>
  );
}
