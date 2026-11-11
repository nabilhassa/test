// MNH monogram geometry, traced from assets/brand/mnh-monogram.jpg (2048×2048 px).
// Shared by the header icon, favicon, intro animation, fallback and the 3D model.

export type Pt = [number, number];

const ORIGIN: Pt = [525, 345]; // top-left of the mark in the source image

const raw = {
  // Top "V"
  chevron: [[525, 345], [545, 345], [1030, 685], [1515, 345], [1535, 345], [1535, 445], [1030, 785], [525, 445]],
  // Outer left bar
  left: [[525, 575], [610, 575], [610, 1550], [525, 1550]],
  // Crossbar → long diagonal → right bar → short upper arm with slanted tip (one connected shape)
  wedge: [[1535, 572], [1535, 1550], [610, 988], [610, 882], [1450, 1440], [1450, 735], [1180, 930], [1085, 880]],
  // Inner bar (sits in front of the diagonal)
  inner: [[752, 722], [845, 722], [845, 1550], [752, 1550]],
} satisfies Record<string, Pt[]>;

const shift = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]]);

/** Pieces in drawing order (back to front), in a 1010 × 1205 box */
export const pieces = {
  chevron: shift(raw.chevron),
  left: shift(raw.left),
  wedge: shift(raw.wedge),
  inner: shift(raw.inner),
};
export const order = ['chevron', 'left', 'wedge', 'inner'] as const;

export const SIZE = { w: 1010, h: 1205 };

/** Ringed planet from assets/brand/mnh-monogram-planet.jpg, same coordinate box */
export const planet = {
  cx: 1081 - ORIGIN[0],
  cy: 968 - ORIGIN[1],
  r: 228,
  ring: { rx: 475, ry: 75, angle: -28 }, // ellipse, rotated (degrees, SVG y-down)
};

export const toPath = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
