import { Bebas_Neue, Geist, Playfair_Display, Poppins, Space_Mono } from "next/font/google";

const sans = Geist({ subsets: ["latin"], weight: ["400", "500", "700"] });
const rounded = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const serif = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const display = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

export type FontOption = {
  id: string;
  label: string;
  pro: boolean;
  className: string;
};

export const FONTS: FontOption[] = [
  { id: "sans", label: "Padrão", pro: false, className: sans.className },
  { id: "rounded", label: "Arredondada", pro: false, className: rounded.className },
  { id: "serif", label: "Elegante", pro: true, className: serif.className },
  { id: "mono", label: "Mono", pro: true, className: mono.className },
  { id: "display", label: "Impacto", pro: true, className: display.className },
];

export function getFont(id: string): FontOption {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}
