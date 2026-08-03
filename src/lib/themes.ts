export type Theme = {
  id: string;
  label: string;
  pro: boolean;
  page: string;
  card: string;
  text: string;
  subtext: string;
  link: string;
};

export const THEMES: Theme[] = [
  {
    id: "default",
    label: "Padrão",
    pro: false,
    page: "bg-white",
    card: "bg-neutral-100 hover:bg-neutral-200 text-neutral-900",
    text: "text-neutral-900",
    subtext: "text-neutral-500",
    link: "border border-neutral-200",
  },
  {
    id: "sunset",
    label: "Sunset",
    pro: false,
    page: "bg-gradient-to-b from-orange-100 to-pink-100",
    card: "bg-white/80 hover:bg-white text-neutral-900",
    text: "text-neutral-900",
    subtext: "text-neutral-600",
    link: "shadow-sm",
  },
  {
    id: "forest",
    label: "Forest",
    pro: false,
    page: "bg-emerald-50",
    card: "bg-white hover:bg-emerald-100 text-emerald-950",
    text: "text-emerald-950",
    subtext: "text-emerald-700",
    link: "border border-emerald-200",
  },
  {
    id: "ocean",
    label: "Ocean",
    pro: false,
    page: "bg-sky-50",
    card: "bg-white hover:bg-sky-100 text-sky-950",
    text: "text-sky-950",
    subtext: "text-sky-700",
    link: "border border-sky-200",
  },
  {
    id: "midnight",
    label: "Midnight (PRO)",
    pro: true,
    page: "bg-neutral-950",
    card: "bg-white/10 hover:bg-white/20 text-white backdrop-blur",
    text: "text-white",
    subtext: "text-white/60",
    link: "border border-white/10",
  },
  {
    id: "gold",
    label: "Gold (PRO)",
    pro: true,
    page: "bg-gradient-to-b from-amber-950 via-neutral-950 to-neutral-950",
    card: "bg-amber-400/10 hover:bg-amber-400/20 text-amber-50 backdrop-blur",
    text: "text-amber-50",
    subtext: "text-amber-200/70",
    link: "border border-amber-400/30",
  },
  {
    id: "gradient-pro",
    label: "Gradiente (PRO)",
    pro: true,
    page: "bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600",
    card: "bg-white/15 hover:bg-white/25 text-white backdrop-blur",
    text: "text-white",
    subtext: "text-white/70",
    link: "border border-white/20",
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
