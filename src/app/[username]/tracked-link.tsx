"use client";

export function TrackedLink({
  linkId,
  href,
  className,
  children,
}: {
  linkId: string;
  href: string;
  className: string;
  children: React.ReactNode;
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
            new Blob([JSON.stringify({ linkId })], { type: "application/json" }),
          );
        } catch {
          // beacon failures should never block navigation
        }
      }}
      className={`w-full rounded-xl px-5 py-3.5 text-center text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
