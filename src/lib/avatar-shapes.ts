export type AvatarShape = {
  id: string;
  label: string;
  className: string;
};

export const AVATAR_SHAPES: AvatarShape[] = [
  { id: "circle", label: "Círculo", className: "rounded-full" },
  { id: "rounded", label: "Arredondado", className: "rounded-2xl" },
  { id: "square", label: "Quadrado", className: "rounded-none" },
];

export function getAvatarShape(id: string): AvatarShape {
  return AVATAR_SHAPES.find((s) => s.id === id) ?? AVATAR_SHAPES[0];
}
