import Link from "next/link";
import { LinkIcon } from "@/lib/link-icons";
import { getTheme, getCustomThemeVars } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { getAvatarShape } from "@/lib/avatar-shapes";
import { getAvatarSize } from "@/lib/avatar-sizes";
import { getBannerSize } from "@/lib/banner-sizes";
import { getLayoutStyle } from "@/lib/layout-styles";
import { groupLinksByCategory, type LinkGroup } from "@/lib/link-groups";
import { PhoneFrame } from "@/components/phone-frame";
import type { Link as LinkRow, LinkCategory, Profile } from "@/lib/supabase/types";

type PreviewProfile = Pick<
  Profile,
  | "username"
  | "display_name"
  | "bio"
  | "avatar_url"
  | "avatar_shape"
  | "avatar_size"
  | "banner_url"
  | "banner_size"
  | "banner_fade"
  | "theme"
  | "font"
  | "custom_bg_color"
  | "custom_card_color"
  | "custom_text_color"
  | "layout_style"
  | "plan"
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
  const avatarSize = getAvatarSize(profile.avatar_size);
  const bannerSize = getBannerSize(profile.banner_size);
  const layoutStyle = getLayoutStyle(profile.layout_style);
  const customVars = getCustomThemeVars(profile.theme, profile);
  const initial = (profile.display_name ?? profile.username).slice(0, 1).toUpperCase();
  const activeLinks = links.filter((l) => l.is_active);
  const groups = groupLinksByCategory(activeLinks, categories);
  const isPoster = layoutStyle.id === "poster" && profile.plan === "pro";

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

      {isPoster ? (
        <PhoneFrame bannerClassName="bg-neutral-950" bannerHeightClass="h-0">
          <div className={`relative flex min-h-full flex-col items-center bg-neutral-950 px-4 pb-8 pt-4 ${font.className}`}>
            {profile.avatar_url && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar_url} alt="" className="h-full w-full scale-125 object-cover opacity-60 blur-2xl" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <div style={customVars} className={`relative w-full overflow-hidden rounded-2xl shadow-xl ${theme.page}`}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-3xl font-bold text-white">
                    {initial}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-3 px-3">
                  <p className="text-sm font-extrabold text-white drop-shadow-md">
                    {profile.display_name || `@${profile.username}`}
                  </p>
                </div>
              </div>
              <div className="p-3">
                {profile.bio && <p className={`text-center text-[11px] leading-snug ${theme.subtext}`}>{profile.bio}</p>}
                <div className="mt-3 flex w-full flex-col gap-3">
                  <LinkGroups groups={groups} cardClassName={`${theme.card} ${theme.link}`} subtextClassName={theme.subtext} />
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      ) : (
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
          <div style={customVars} className={`flex min-h-full flex-col items-center px-4 pb-8 ${theme.page} ${font.className}`}>
            <div
              className={`relative z-10 -mt-8 flex items-center justify-center border-4 shadow-lg ${theme.avatarBorder} ${avatarShape.className} ${avatarSize.previewClass}`}
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
              <LinkGroups groups={groups} cardClassName={`${theme.card} ${theme.link}`} subtextClassName={theme.subtext} />
            </div>
          </div>
        </PhoneFrame>
      )}

      <p className="mx-auto mt-3 max-w-[260px] text-xs text-black/40">
        Cada link ativo já está no ar e clicável em{" "}
        <span className="font-medium text-black/60">hyperlink.app/{profile.username}</span>.
      </p>
    </div>
  );
}

function LinkGroups({
  groups,
  cardClassName,
  subtextClassName,
}: {
  groups: LinkGroup<LinkRow>[];
  cardClassName: string;
  subtextClassName: string;
}) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.key ?? "none"} className="flex w-full flex-col gap-1.5">
          {group.title && (
            <h4 className={`text-[10px] font-semibold uppercase tracking-wide ${subtextClassName}`}>{group.title}</h4>
          )}
          {group.links.map((link) => (
            <div
              key={link.id}
              className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[11px] font-medium ${cardClassName}`}
            >
              <LinkIcon url={link.url} className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="flex-1 truncate text-center">{link.title}</span>
              <span className="w-3.5 shrink-0" aria-hidden />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
