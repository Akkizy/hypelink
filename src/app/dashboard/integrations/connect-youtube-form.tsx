"use client";

import { useState, useTransition } from "react";
import { connectYouTubeChannel, disconnectYouTubeChannel } from "./actions";

export function ConnectYouTubeForm({
  channelId,
  channelTitle,
}: {
  channelId: string | null;
  channelTitle: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (channelId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            ▶
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{channelTitle || "Canal conectado"}</p>
            <p className="truncate text-xs text-black/40">{channelId}</p>
          </div>
          <button
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await disconnectYouTubeChannel();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Erro ao desconectar.");
                }
              });
            }}
            className="shrink-0 text-sm text-red-500 hover:text-red-700"
          >
            desconectar
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-3 text-xs text-black/40">
          O status de &quot;ao vivo&quot; atualiza a cada poucos minutos (limite da API do YouTube), não é instantâneo
          à segunda.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await connectYouTubeChannel(formData);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Não foi possível conectar esse canal.");
          }
        });
      }}
      className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5"
    >
      <label className="text-sm font-medium">Canal do YouTube</label>
      <input
        name="channel"
        placeholder="@seucanal, ID do canal ou link do youtube.com"
        required
        className="rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black/30"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Conectando…" : "Conectar canal"}
      </button>
    </form>
  );
}
