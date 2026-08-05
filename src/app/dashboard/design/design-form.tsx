"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Theme } from "@/lib/themes";
import { getCustomThemeVars } from "@/lib/themes";
import type { FontOption } from "@/lib/fonts";
import type { AvatarShape } from "@/lib/avatar-shapes";
import type { AvatarSize } from "@/lib/avatar-sizes";
import type { BannerSize } from "@/lib/banner-sizes";
import { PhoneFrame } from "@/components/phone-frame";
import { updateProfile } from "./actions";
import { ImageUploadField } from "./image-upload-field";
import { removeAvatar, removeBanner, uploadAvatar, uploadBanner } from "./upload-actions";

type ProfileInput = {
  username: string;
  display_name: string | null;
  bio: string | null;
  theme: string;
  font: string;
  plan: string;
  avatar_url: string | null;
  avatar_shape: string;
  avatar_size: string;
  banner_url: string | null;
  banner_size: string;
  banner_fade: boolean;
  custom_bg_color: string;
  custom_card_color: string;
  custom_text_color: string;
};

export function DesignForm({
  profile,
  themes,
  fonts,
  avatarShapes,
  avatarSizes,
  bannerSizes,
}: {
  profile: ProfileInput;
  themes: Theme[];
  fonts: FontOption[];
  avatarShapes: AvatarShape[];
  avatarSizes: AvatarSize[];
  bannerSizes: BannerSize[];
}) {
  const [theme, setTheme] = useState(profile.theme);
  const [font, setFont] = useState(profile.font);
  const [avatarShape, setAvatarShape] = useState(profile.avatar_shape);
  const [avatarSize, setAvatarSize] = useState(profile.avatar_size);
  const [bannerSize, setBannerSize] = useState(profile.banner_size);
  const [bannerFade, setBannerFade] = useState(profile.banner_fade);
  const [customBg, setCustomBg] = useState(profile.custom_bg_color);
  const [customCard, setCustomCard] = useState(profile.custom_card_color);
  const [customText, setCustomText] = useState(profile.custom_text_color);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const isPro = profile.plan === "pro";
  const activeTheme = themes.find((t) => t.id === theme) ?? themes[0];
  const activeFont = fonts.find((f) => f.id === font) ?? fonts[0];
  const activeShape = avatarShapes.find((s) => s.id === avatarShape) ?? avatarShapes[0];
  const activeAvatarSize = avatarSizes.find((s) => s.id === avatarSize) ?? avatarSizes[0];
  const activeBannerSize = bannerSizes.find((s) => s.id === bannerSize) ?? bannerSizes[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <form
        action={(formData) => {
          setError(null);
          setSaved(false);
          startTransition(async () => {
            try {
              await updateProfile(formData);
              setSaved(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erro ao salvar.");
            }
          });
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Nome de exibição</label>
          <input
            name="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ImageUploadField
            label="Foto de perfil"
            shape="circle"
            previewClassName={activeShape.className}
            currentUrl={avatarUrl}
            onChange={setAvatarUrl}
            uploadAction={uploadAvatar}
            removeAction={removeAvatar}
          />
          <ImageUploadField
            label="Banner"
            shape="banner"
            currentUrl={bannerUrl}
            onChange={setBannerUrl}
            uploadAction={uploadBanner}
            removeAction={removeBanner}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Formato da foto de perfil</label>
          <input type="hidden" name="avatar_shape" value={avatarShape} />
          <div className="flex gap-2">
            {avatarShapes.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setAvatarShape(s.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 ${
                  avatarShape === s.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                }`}
              >
                <span className={`block h-8 w-8 bg-neutral-300 ${s.className}`} />
                <span className="text-[11px] text-black/70">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Tamanho da foto de perfil</label>
          <input type="hidden" name="avatar_size" value={avatarSize} />
          <div className="flex items-end gap-2">
            {avatarSizes.map((s) => {
              const locked = s.id !== "medium" && !isPro;
              const dim = s.id === "small" ? "h-6 w-6" : s.id === "large" ? "h-10 w-10" : "h-8 w-8";
              return (
                <button
                  type="button"
                  key={s.id}
                  disabled={locked}
                  onClick={() => setAvatarSize(s.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-2 ${
                    avatarSize === s.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                  } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span className={`block rounded-full bg-neutral-300 ${dim}`} />
                  <span className="text-[11px] text-black/70">{s.label}</span>
                </button>
              );
            })}
          </div>
          {!isPro && (
            <p className="text-xs text-black/50">
              Tamanhos Pequeno/Grande disponíveis no{" "}
              <Link href="/dashboard/billing" className="underline">
                plano pago
              </Link>
              .
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Tamanho do banner</label>
          <input type="hidden" name="banner_size" value={bannerSize} />
          <div className="flex gap-2">
            {bannerSizes.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setBannerSize(s.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 ${
                  bannerSize === s.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                }`}
              >
                <span
                  className={`block w-14 rounded-md bg-neutral-300 ${
                    s.id === "short" ? "h-4" : s.id === "tall" ? "h-8" : "h-6"
                  }`}
                />
                <span className="text-[11px] text-black/70">{s.label}</span>
              </button>
            ))}
          </div>
          <label className="mt-1 flex items-center gap-2 text-sm text-black/70">
            <input type="checkbox" name="banner_fade" defaultChecked={bannerFade} onChange={(e) => setBannerFade(e.target.checked)} />
            Esmaecer o banner até a cor do tema
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Tema</label>
          <input type="hidden" name="theme" value={theme} />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {themes.map((t) => {
              const locked = t.pro && !isPro;
              return (
                <button
                  type="button"
                  key={t.id}
                  disabled={locked}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-2 text-center text-[11px] ${
                    theme === t.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                  } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span className={`h-8 w-full rounded-md ${t.swatch}`} />
                  <span className="text-black/70">{t.label}</span>
                </button>
              );
            })}
          </div>
          {!isPro && (
            <p className="text-xs text-black/50">
              Temas PRO disponíveis no{" "}
              <Link href="/dashboard/billing" className="underline">
                plano pago
              </Link>
              .
            </p>
          )}
          {theme === "custom" && isPro && (
            <div className="mt-2 flex flex-wrap gap-4 rounded-lg border border-black/10 p-3">
              <label className="flex flex-col gap-1 text-xs text-black/60">
                Fundo
                <input
                  type="color"
                  name="custom_bg_color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-black/10"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-black/60">
                Cartões / banner
                <input
                  type="color"
                  name="custom_card_color"
                  value={customCard}
                  onChange={(e) => setCustomCard(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-black/10"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-black/60">
                Texto
                <input
                  type="color"
                  name="custom_text_color"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-black/10"
                />
              </label>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Fonte</label>
          <input type="hidden" name="font" value={font} />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {fonts.map((f) => {
              const locked = f.pro && !isPro;
              return (
                <button
                  type="button"
                  key={f.id}
                  disabled={locked}
                  onClick={() => setFont(f.id)}
                  className={`rounded-lg p-3 text-left ${
                    font === f.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                  } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span className={`block text-base ${f.className}`}>Aa</span>
                  <span className="text-[11px] text-black/60">{f.label}</span>
                </button>
              );
            })}
          </div>
          {!isPro && (
            <p className="text-xs text-black/50">
              Fontes PRO disponíveis no{" "}
              <Link href="/dashboard/billing" className="underline">
                plano pago
              </Link>
              .
            </p>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-emerald-600">Salvo!</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Salvando…" : "Salvar"}
        </button>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-medium text-black/50">Prévia</p>
        <PreviewCard
          theme={activeTheme}
          font={activeFont}
          avatarShape={activeShape}
          avatarSize={activeAvatarSize}
          bannerSize={activeBannerSize}
          bannerFade={bannerFade}
          customVars={getCustomThemeVars(theme, {
            custom_bg_color: customBg,
            custom_card_color: customCard,
            custom_text_color: customText,
          })}
          displayName={displayName}
          username={profile.username}
          bio={bio}
          avatarUrl={avatarUrl}
          bannerUrl={bannerUrl}
        />
      </div>
    </div>
  );
}

function PreviewCard({
  theme,
  font,
  avatarShape,
  avatarSize,
  bannerSize,
  bannerFade,
  customVars,
  displayName,
  username,
  bio,
  avatarUrl,
  bannerUrl,
}: {
  theme: Theme;
  font: FontOption;
  avatarShape: AvatarShape;
  avatarSize: AvatarSize;
  bannerSize: BannerSize;
  bannerFade: boolean;
  customVars: React.CSSProperties | undefined;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
}) {
  const initial = (displayName || username || "?").slice(0, 1).toUpperCase();

  return (
    <PhoneFrame
      bannerClassName={theme.bannerFallback}
      bannerHeightClass={bannerSize.previewClass}
      bannerFadeToClass={bannerFade ? theme.bannerFadeTo : undefined}
      bannerContent={
        bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : undefined
      }
    >
      <div
        style={customVars}
        className={`flex min-h-full flex-col items-center px-4 pb-8 ${theme.page} ${font.className}`}
      >
        <div
          className={`relative z-10 -mt-8 flex items-center justify-center border-4 shadow-lg ${theme.avatarBorder} ${avatarShape.className} ${avatarSize.previewClass}`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className={`h-full w-full object-cover ${avatarShape.className}`} />
          ) : (
            <div className={`flex h-full w-full items-center justify-center text-lg font-bold ${theme.card} ${avatarShape.className}`}>
              {initial}
            </div>
          )}
        </div>
        <p className={`mt-2 text-sm font-bold ${theme.text}`}>{displayName || `@${username}`}</p>
        {bio && <p className={`mt-1 text-center text-[11px] leading-snug ${theme.subtext}`}>{bio}</p>}
        <div className="mt-4 flex w-full flex-col gap-1.5">
          <div className={`flex h-9 w-full items-center justify-center rounded-lg text-[11px] font-medium ${theme.card} ${theme.link}`}>
            seu link aqui
          </div>
          <div className={`flex h-9 w-full items-center justify-center rounded-lg text-[11px] font-medium ${theme.card} ${theme.link}`}>
            outro link
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
