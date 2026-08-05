export type AvatarSize = {
  id: string;
  label: string;
  publicClass: string;
  previewClass: string;
};

export const AVATAR_SIZES: AvatarSize[] = [
  { id: "small", label: "Pequeno", publicClass: "h-16 w-16", previewClass: "h-11 w-11" },
  { id: "medium", label: "Médio", publicClass: "h-24 w-24", previewClass: "h-16 w-16" },
  { id: "large", label: "Grande", publicClass: "h-32 w-32", previewClass: "h-20 w-20" },
];

export function getAvatarSize(id: string): AvatarSize {
  return AVATAR_SIZES.find((s) => s.id === id) ?? AVATAR_SIZES[1];
}
