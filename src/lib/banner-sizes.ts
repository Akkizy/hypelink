export type BannerSize = {
  id: string;
  label: string;
  publicClass: string;
  previewClass: string;
};

export const BANNER_SIZES: BannerSize[] = [
  { id: "short", label: "Curto", publicClass: "h-28 sm:h-36", previewClass: "h-16" },
  { id: "medium", label: "Médio", publicClass: "h-40 sm:h-56", previewClass: "h-28" },
  { id: "tall", label: "Alto", publicClass: "h-56 sm:h-72", previewClass: "h-40" },
];

export function getBannerSize(id: string): BannerSize {
  return BANNER_SIZES.find((s) => s.id === id) ?? BANNER_SIZES[1];
}
