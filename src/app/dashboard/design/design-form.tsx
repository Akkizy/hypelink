"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Theme } from "@/lib/themes";
import { updateProfile } from "./actions";

export function DesignForm({
  profile,
  themes,
}: {
  profile: { display_name: string | null; bio: string | null; theme: string; plan: string; avatar_url: string | null };
  themes: Theme[];
}) {
  const [theme, setTheme] = useState(profile.theme);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const isPro = profile.plan === "pro";

  return (
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
          defaultValue={profile.display_name ?? ""}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">URL da foto de perfil</label>
        <input
          name="avatar_url"
          type="url"
          placeholder="https://..."
          defaultValue={profile.avatar_url ?? ""}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          rows={3}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Tema</label>
        <input type="hidden" name="theme" value={theme} />
        <div className="grid grid-cols-3 gap-2">
          {themes.map((t) => {
            const locked = t.pro && !isPro;
            return (
              <button
                type="button"
                key={t.id}
                disabled={locked}
                onClick={() => setTheme(t.id)}
                className={`rounded-lg p-3 text-left text-xs ${t.page} ${
                  theme === t.id ? "ring-2 ring-black" : "ring-1 ring-black/10"
                } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <span className={t.text}>{t.label}</span>
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
  );
}
