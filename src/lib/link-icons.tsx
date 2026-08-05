type IconProps = { className?: string };

function Instagram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 3v10.2a3.3 3.3 0 1 1-2.6-3.23"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 3c.4 2.2 2 3.8 4.2 4.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function YouTube({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5 15 12l-4.5 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}

function XTwitter({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Facebook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 21v-6.5h2l.4-2.6h-2.4V10.2c0-.75.2-1.3 1.3-1.3h1.3V6.6c-.23-.03-1-.1-1.9-.1-1.9 0-3.2 1.15-3.2 3.28v1.9H8.7v2.6h2.3V21"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedIn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <path d="M8 11.5v5.5M12 17v-3.5c0-1.5 3-1.7 3 0V17M12 13.2v3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GitHub({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.2-3.03-1.2-.4-1.05-1-1.32-1-1.32-.83-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.82 1.4 2.15 1 2.67.76.08-.6.32-1 .58-1.23-2-.23-4.1-1-4.1-4.4 0-.97.35-1.77.92-2.4-.1-.23-.4-1.14.1-2.37 0 0 .74-.24 2.44.9a8.4 8.4 0 0 1 4.44 0c1.7-1.15 2.44-.9 2.44-.9.5 1.23.2 2.14.1 2.37.57.63.92 1.43.92 2.4 0 3.4-2.1 4.16-4.1 4.38.33.29.62.85.62 1.72v2.55c0 .24.15.51.6.43A9 9 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 19l1.1-3.2A7.5 7.5 0 1 1 10 18.7L6 19Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 9.6c.2-.5.4-.5.6-.5h.4c.15 0 .35 0 .5.4.2.5.6 1.5.65 1.6.05.15.08.3 0 .5-.1.2-.15.3-.3.45-.15.15-.3.35-.45.45-.15.15-.3.3-.13.6.18.3.8 1.3 1.7 2.1 1.2 1 2.2 1.35 2.5 1.5.3.15.5.13.68-.08.2-.2.75-.85.95-1.15.2-.3.4-.25.65-.15.28.1 1.75.8 2.05.95.3.15.5.22.55.35.06.13.06.75-.2 1.45-.25.7-1.5 1.35-2.05 1.4-.55.05-1 .25-3.3-.7-2.8-1.15-4.55-4-4.7-4.2-.13-.2-1.1-1.45-1.1-2.75 0-1.3.7-1.95.95-2.2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spotify({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10c3.2-1 6.8-.7 9.6.9M7.6 13.2c2.6-.75 5.4-.5 7.6.75M8.3 16.1c2-.55 4.1-.35 5.7.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Telegram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="m7 12.3 9-3.8-3 8.8-2-3.1-3.2-1.1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="m10 13.8-.2 2.8 1.6-2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function Mail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Globe({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const MATCHERS: Array<{ test: RegExp; id: string }> = [
  { test: /instagram\.com$/, id: "instagram" },
  { test: /tiktok\.com$/, id: "tiktok" },
  { test: /(youtube\.com|youtu\.be)$/, id: "youtube" },
  { test: /(twitter\.com|x\.com)$/, id: "x" },
  { test: /facebook\.com$/, id: "facebook" },
  { test: /linkedin\.com$/, id: "linkedin" },
  { test: /github\.com$/, id: "github" },
  { test: /(wa\.me|whatsapp\.com)$/, id: "whatsapp" },
  { test: /open\.spotify\.com$/, id: "spotify" },
  { test: /t\.me$/, id: "telegram" },
];

function resolveIconId(url: string): string {
  if (url.startsWith("mailto:")) return "mail";
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return MATCHERS.find((m) => m.test.test(hostname))?.id ?? "globe";
  } catch {
    return "globe";
  }
}

export function LinkIcon({ url, className }: { url: string } & IconProps) {
  switch (resolveIconId(url)) {
    case "instagram":
      return <Instagram className={className} />;
    case "tiktok":
      return <TikTok className={className} />;
    case "youtube":
      return <YouTube className={className} />;
    case "x":
      return <XTwitter className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "linkedin":
      return <LinkedIn className={className} />;
    case "github":
      return <GitHub className={className} />;
    case "whatsapp":
      return <WhatsApp className={className} />;
    case "spotify":
      return <Spotify className={className} />;
    case "telegram":
      return <Telegram className={className} />;
    case "mail":
      return <Mail className={className} />;
    default:
      return <Globe className={className} />;
  }
}
