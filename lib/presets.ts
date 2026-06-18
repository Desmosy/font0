import { sanitizeParams, type FontParams } from "./types";

export interface Preset {
  name: string;
  author: string;
  sample: string;
  params: FontParams;
}

export const PRESETS: Preset[] = [
  { name: "Atlas Grotesk", author: "humanist · pro", sample: "Aa Gg",
    params: sanitizeParams({ familyName: "Atlas Grotesk", base: "inter", axes: { wght: 460, opsz: 20 } }) },
  { name: "Orbit Geometric", author: "geometric", sample: "Oo Qq",
    params: sanitizeParams({ familyName: "Orbit Geometric", base: "spacegrotesk", axes: { wght: 500 } }) },
  { name: "Marshmallow", author: "rounded · soft", sample: "Bb Ss",
    params: sanitizeParams({ familyName: "Marshmallow", base: "nunito", axes: { wght: 620 } }) },
  { name: "Couture Didone", author: "high contrast", sample: "Ss Qq",
    params: sanitizeParams({ familyName: "Couture", base: "playfairdisplay", axes: { wght: 520 } }) },
  { name: "Editorial Warm", author: "characterful serif", sample: "Rr Ee",
    params: sanitizeParams({ familyName: "Editorial", base: "fraunces", axes: { wght: 480, opsz: 72, SOFT: 0, WONK: 0 } }) },
  { name: "Foundry Slab", author: "slab · sturdy", sample: "Mm Ww",
    params: sanitizeParams({ familyName: "Foundry Slab", base: "robotoslab", axes: { wght: 560 } }) },
  { name: "Console", author: "mono · code", sample: "Il 01",
    params: sanitizeParams({ familyName: "Console", base: "jetbrainsmono", axes: { wght: 460 } }) },
  { name: "Vogue Black", author: "didone · black", sample: "Vv Aa",
    params: sanitizeParams({ familyName: "Vogue Black", base: "playfairdisplay", axes: { wght: 820 } }) },
];
