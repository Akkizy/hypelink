"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";

type Status = {
  enabled: boolean;
  isLive?: boolean;
  liveVideoId?: string;
  liveTitle?: string;
  latestVideo?: { id: string; title: string; thumbnail: string; publishedAt: string };
};

const POLL_MS = 60_000;

export function YouTubeStatus({ username, theme }: { username: string; theme: Theme }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/youtube-status/${username}`);
        const data = await res.json();
        if (!cancelled) setStatus(data);
      } catch {
        // silently ignore — widget just doesn't render
      }
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [username]);

  if (!status?.enabled) return null;

  if (status.isLive && status.liveVideoId) {
    return (
      <a
        href={`https://www.youtube.com/watch?v=${status.liveVideoId}`}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center gap-3 rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <span className="flex-1 truncate">{status.liveTitle || "Ao vivo agora no YouTube"}</span>
        <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          Ao vivo
        </span>
      </a>
    );
  }

  if (status.latestVideo) {
    const video = status.latestVideo;
    return (
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noreferrer"
        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-transform hover:-translate-y-0.5 ${theme.card} ${theme.link}`}
      >
        {video.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnail} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
        )}
        <span className="min-w-0 flex-1">
          <span className={`block text-[10px] font-semibold uppercase tracking-wide ${theme.subtext}`}>
            Novo no YouTube
          </span>
          <span className="block truncate text-sm font-medium">{video.title}</span>
        </span>
      </a>
    );
  }

  return null;
}
