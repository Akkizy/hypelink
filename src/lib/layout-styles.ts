export type LayoutStyle = {
  id: string;
  label: string;
  pro: boolean;
};

export const LAYOUT_STYLES: LayoutStyle[] = [
  { id: "classic", label: "Clássico", pro: false },
  { id: "poster", label: "Pôster (PRO)", pro: true },
];

export function getLayoutStyle(id: string): LayoutStyle {
  return LAYOUT_STYLES.find((l) => l.id === id) ?? LAYOUT_STYLES[0];
}
