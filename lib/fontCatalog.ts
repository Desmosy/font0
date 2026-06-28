import type { CSSProperties } from "react";

export interface AxisDef {
  tag: string;
  label: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
  fmt?: (v: number) => string;
}

export interface FontDef {
  id: string;
  label: string;
  family: string;
  file: string;
  upm: number;
  category: string;
  blurb: string;
  axes: AxisDef[];
  defaults: Record<string, number>;
  keywords: string[];
}

const WGHT = (min: number, max: number): AxisDef => ({
  tag: "wght",
  label: "Weight",
  min,
  max,
  step: 1,
  hint: "stem thickness",
});

export const FONTS: FontDef[] = [
  {
    id: "inter",
    label: "Inter",
    family: "BS Inter",
    file: "/fonts/Inter.ttf",
    upm: 2048,
    category: "Humanist sans",
    blurb: "Neutral, professional UI sans — the Helvetica/Open Sans lane.",
    axes: [
      WGHT(100, 900),
      { tag: "opsz", label: "Optical size", min: 14, max: 32, step: 1, hint: "higher = more display detail" },
    ],
    defaults: { wght: 420, opsz: 18 },
    keywords: [
      "professional", "open sans", "helvetica", "humanist", "neutral", "clean",
      "ui", "corporate", "swiss", "sans", "modern sans", "system", "arial", "roboto",
    ],
  },
  {
    id: "spacegrotesk",
    label: "Space Grotesk",
    family: "BS SpaceGrotesk",
    file: "/fonts/SpaceGrotesk.ttf",
    upm: 1000,
    category: "Geometric sans",
    blurb: "Geometric, slightly technical grotesque — futurist/startup feel.",
    axes: [WGHT(300, 700)],
    defaults: { wght: 450 },
    keywords: [
      "geometric", "futura", "circular", "technical", "startup", "brutalist",
      "grotesk", "grotesque", "modern", "minimal", "engineered", "space",
    ],
  },
  {
    id: "recursive",
    label: "Recursive",
    family: "BS Recursive",
    file: "/fonts/Recursive.ttf",
    upm: 1000,
    category: "Expressive variable",
    blurb: "Hugely flexible: sans↔mono, linear↔casual, slant, cursive. Great for distinctive/quirky briefs.",
    axes: [
      WGHT(300, 1000),
      { tag: "MONO", label: "Mono", min: 0, max: 1, step: 0.01, hint: "sans → monospace", fmt: (v) => v.toFixed(2) },
      { tag: "CASL", label: "Casual", min: 0, max: 1, step: 0.01, hint: "linear → casual/warm", fmt: (v) => v.toFixed(2) },
      { tag: "slnt", label: "Slant", min: -15, max: 0, step: 1, hint: "upright → leaning" },
      { tag: "CRSV", label: "Cursive", min: 0, max: 1, step: 0.5, hint: "roman → cursive italic", fmt: (v) => v.toFixed(1) },
    ],
    defaults: { wght: 420, MONO: 0, CASL: 0, slnt: 0, CRSV: 0 },
    keywords: [
      "expressive", "versatile", "quirky", "distinctive", "casual", "characterful",
      "duo", "recursive", "personality", "handwritten", "informal", "creative",
    ],
  },
  {
    id: "nunito",
    label: "Nunito",
    family: "BS Nunito",
    file: "/fonts/Nunito.ttf",
    upm: 1000,
    category: "Rounded sans",
    blurb: "Soft rounded terminals — friendly, playful, approachable.",
    axes: [WGHT(200, 1000)],
    defaults: { wght: 520 },
    keywords: [
      "rounded", "round", "friendly", "soft", "playful", "bubbly", "kids",
      "cute", "warm", "approachable", "gentle", "kid", "fun",
    ],
  },
  {
    id: "fraunces",
    label: "Fraunces",
    family: "BS Fraunces",
    file: "/fonts/Fraunces.ttf",
    upm: 2000,
    category: "Editorial serif",
    blurb: "Old-style display serif with optical contrast — characterful editorial.",
    axes: [
      WGHT(100, 900),
      { tag: "opsz", label: "Optical size", min: 9, max: 144, step: 1, hint: "higher = more contrast/display" },
      { tag: "SOFT", label: "Softness", min: 0, max: 100, step: 1, hint: "rounds sharp corners" },
      { tag: "WONK", label: "Wonk", min: 0, max: 1, step: 1, hint: "quirky alternates on/off" },
    ],
    defaults: { wght: 500, opsz: 40, SOFT: 0, WONK: 0 },
    keywords: [
      "editorial", "magazine", "vintage", "characterful", "organic", "literary",
      "old style", "warm serif", "book", "quirky", "display serif",
    ],
  },
  {
    id: "playfairdisplay",
    label: "Playfair Display",
    family: "BS Playfair",
    file: "/fonts/PlayfairDisplay.ttf",
    upm: 1000,
    category: "Didone serif",
    blurb: "High-contrast didone — elegant, fashion, luxury headlines.",
    axes: [WGHT(400, 900)],
    defaults: { wght: 480 },
    keywords: [
      "elegant", "fashion", "luxury", "didone", "high contrast", "high-contrast",
      "classy", "glamour", "couture", "vogue", "editorial serif", "sophisticated",
    ],
  },
  {
    id: "robotoslab",
    label: "Roboto Slab",
    family: "BS RobotoSlab",
    file: "/fonts/RobotoSlab.ttf",
    upm: 2048,
    category: "Slab serif",
    blurb: "Sturdy slab serif — industrial, robust, dependable.",
    axes: [WGHT(100, 900)],
    defaults: { wght: 450 },
    keywords: [
      "slab", "sturdy", "industrial", "robust", "mechanical", "strong",
      "egyptian", "rugged", "solid", "workhorse",
    ],
  },
  {
    id: "jetbrainsmono",
    label: "JetBrains Mono",
    family: "BS JetBrainsMono",
    file: "/fonts/JetBrainsMono.ttf",
    upm: 1000,
    category: "Monospace",
    blurb: "Fixed-width monospace — code, terminals, technical UIs.",
    axes: [WGHT(100, 800)],
    defaults: { wght: 450 },
    keywords: [
      "mono", "monospace", "code", "terminal", "developer", "coding",
      "console", "typewriter", "fixed width", "programming",
    ],
  },
];

export const FONT_BY_ID: Record<string, FontDef> = Object.fromEntries(
  FONTS.map((f) => [f.id, f]),
);

export const DEFAULT_FONT_ID = "inter";

export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
export const DIGITS = "0123456789".split("");
export const SYMBOLS = "&@#%$.,:;!?‘’“”()[]{}/-–—*+=".split("");

export function clampAxis(def: FontDef, tag: string, value: number): number {
  const axis = def.axes.find((a) => a.tag === tag);
  if (!axis) return value;
  return Math.min(axis.max, Math.max(axis.min, value));
}

export function weightName(wght: number): string {
  if (wght < 250) return "Thin";
  if (wght < 350) return "Light";
  if (wght < 450) return "Regular";
  if (wght < 550) return "Medium";
  if (wght < 650) return "SemiBold";
  if (wght < 775) return "Bold";
  if (wght < 875) return "Heavy";
  return "Black";
}

export function fontFaceStyle(
  fontId: string,
  axes: Record<string, number>,
  tracking: number,
): CSSProperties {
  const def = FONT_BY_ID[fontId] ?? FONT_BY_ID[DEFAULT_FONT_ID];
  const settings = def.axes
    .map((a) => `"${a.tag}" ${Math.round((axes[a.tag] ?? def.defaults[a.tag]) * 100) / 100}`)
    .join(", ");
  const fallback = def.category === "Monospace" ? "monospace" : def.category.includes("serif") ? "serif" : "sans-serif";
  return {
    fontFamily: `"${def.family}", ${fallback}`,
    fontVariationSettings: settings,
    fontWeight: axes.wght ? Math.round(axes.wght) : undefined,
    letterSpacing: `${(tracking || 0) / 1000}em`,
  };
}
