"use client";

import { LinkIcon } from "@/lib/link-icons";

export function TrackedLink({
  linkId,
  href,
  title,
  className,
}: {
  linkId: string;
  href: string;
  title: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        try {
          navigator.sendBeacon(
            "/api/track-click",
            new Blob([JSON.stringify({ linkId, referrer: document.referrer })], { type: "application/json" }),
          );
        } catch {
          // beacon failures should never block navigation
        }
      }}
      className={`group flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <LinkIcon url={href} className="h-5 w-5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
      <span className="flex-1 text-center">{title}</span>
      <span className="w-5 shrink-0" aria-hidden />
    </a>
  );
}
