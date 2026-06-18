// Shared font-parameter contract between the AI route and the UI.
//
// A generated font = a bundled variable base typeface (`base`) instanced at a
// set of variable-axis values (`axes`) plus letter tracking. Real, professional
// outlines come from the base font; the AI only chooses base + axes + tracking.

import { DEFAULT_FONT_ID, FONT_BY_ID } from "./fontCatalog";
import { IDENTITY_SHAPE, type ShapeParams } from "./genShape";

export interface FontParams {
  /** Display name the user gives the typeface (cosmetic). */
  familyName: string;
  /** Which bundled base font to instance (a FontDef id). */
  base: string;
  /** Variable-axis values, e.g. { wght: 540, opsz: 18 }. */
  axes: Record<string, number>;
  /** Letter tracking in 1/1000 em (letter-spacing). */
  tracking: number;
  /** Generative geometry transforms (the AI redraws the curves). */
  shape: ShapeParams;
}

export const DEFAULT_PARAMS: FontParams = {
  familyName: "Untitled",
  base: DEFAULT_FONT_ID,
  axes: { ...FONT_BY_ID[DEFAULT_FONT_ID].defaults },
  tracking: 0,
  shape: { ...IDENTITY_SHAPE },
};

const N = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
};

/** Coerce arbitrary (AI) input into a safe, in-range FontParams. */
export function sanitizeParams(input: Partial<FontParams> | null | undefined): FontParams {
  const p = input ?? {};

  const base =
    typeof p.base === "string" && FONT_BY_ID[p.base] ? p.base : DEFAULT_FONT_ID;
  const def = FONT_BY_ID[base];

  // Start from the font's sensible defaults, then apply any in-range overrides.
  const axes: Record<string, number> = { ...def.defaults };
  const incoming = p.axes && typeof p.axes === "object" ? (p.axes as Record<string, unknown>) : {};
  for (const axis of def.axes) {
    const raw = incoming[axis.tag];
    const n = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(n)) axes[axis.tag] = Math.min(axis.max, Math.max(axis.min, n));
  }

  const s = (p.shape ?? {}) as Partial<ShapeParams>;
  const shape: ShapeParams = {
    slant: N(s.slant, -20, 20, 0),
    width: N(s.width, 0.7, 1.4, 1),
    vstretch: N(s.vstretch, 0.82, 1.18, 1),
    distortion: N(s.distortion, 0, 1, 0),
    seed: Number.isFinite(s.seed) ? (s.seed as number) >>> 0 : 0,
  };

  return {
    familyName:
      typeof p.familyName === "string" && p.familyName.trim()
        ? p.familyName.trim().slice(0, 48)
        : DEFAULT_PARAMS.familyName,
    base,
    axes,
    tracking: N(p.tracking, -40, 160, 0),
    shape,
  };
}
