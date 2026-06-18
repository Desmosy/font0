// Real-outline glyph extraction + edited-font assembly (client-side).
//
// Reading outlines from a harfbuzz-instanced font works perfectly with
// opentype.js. Re-serializing those fonts does NOT (their GSUB tables break
// opentype's writer), so to bake edits we assemble a FRESH font from the
// extracted outlines — valid, if without the base's kerning/features.

import opentype from "opentype.js";
import { instanceFont } from "./instanceFont";
import { UPPERCASE, LOWERCASE, DIGITS, SYMBOLS } from "./fontCatalog";
import { applyShaping, shapedAdvance, isIdentityShape, type ShapeParams } from "./genShape";
import type { FontParams } from "./types";

/** Loose, mutable path command (opentype's is a discriminated union). */
export interface Cmd {
  type: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface GlyphOutline {
  commands: Cmd[];
  advance: number;
  upm: number;
}

const CHARSET = [" ", ...UPPERCASE, ...LOWERCASE, ...DIGITS, ...SYMBOLS];

let cacheKey = "";
let cacheFont: opentype.Font | null = null;

function sig(p: FontParams): string {
  return `${p.base}:${JSON.stringify(p.axes)}`;
}

/** Instance the current params to a static font and parse it (cached). */
async function getInstance(params: FontParams): Promise<opentype.Font> {
  const k = sig(params);
  if (k === cacheKey && cacheFont) return cacheFont;
  const bytes = await instanceFont(params);
  const font = opentype.parse(bytes.buffer);
  cacheKey = k;
  cacheFont = font;
  return font;
}

/** Extract one glyph's editable outline at the current axes (optionally shaped). */
export async function getGlyphOutline(
  params: FontParams,
  char: string,
  shape?: ShapeParams,
): Promise<GlyphOutline> {
  const font = await getInstance(params);
  const g = font.charToGlyph(char);
  const upm = font.unitsPerEm;
  let commands = g.path.commands.map((c) => ({ ...c }) as Cmd);
  let advance = g.advanceWidth ?? Math.round(upm * 0.5);
  if (shape && !isIdentityShape(shape)) {
    commands = applyShaping(commands, upm, shape, char);
    advance = shapedAdvance(advance, shape);
  }
  return { commands, advance, upm };
}

function glyphName(ch: string): string {
  if (ch === " ") return "space";
  if (/[A-Za-z0-9]/.test(ch)) return ch;
  return "uni" + ch.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase();
}

export type GlyphEdits = Record<string, GlyphOutline>;

/** Assemble a fresh, downloadable font from the instance + shaping + glyph edits. */
export async function buildEditedFont(
  params: FontParams,
  edits: GlyphEdits,
  shape?: ShapeParams,
): Promise<Uint8Array<ArrayBuffer>> {
  const font = await getInstance(params);
  const upm = font.unitsPerEm;
  const shaping = shape && !isIdentityShape(shape) ? shape : null;
  const notdef = new opentype.Glyph({
    name: ".notdef",
    unicode: 0,
    advanceWidth: Math.round(upm * 0.5),
    path: new opentype.Path(),
  });

  const glyphs: opentype.Glyph[] = [notdef];
  for (const ch of CHARSET) {
    const src = font.charToGlyph(ch);
    const edit = edits[ch];
    const path = new opentype.Path();
    // Edited glyphs are stored already-shaped (frozen). Non-edited glyphs get
    // live shaping applied here so the whole face stays consistent.
    let cmds: Cmd[];
    let advance: number;
    if (edit) {
      cmds = edit.commands.map((c) => ({ ...c }));
      advance = edit.advance;
    } else {
      const baseCmds = (src.path.commands as Cmd[]).map((c) => ({ ...c }));
      const baseAdv = src.advanceWidth ?? upm * 0.5;
      cmds = shaping ? applyShaping(baseCmds, upm, shaping, ch) : baseCmds;
      advance = shaping ? shapedAdvance(baseAdv, shaping) : baseAdv;
    }
    path.commands = cmds as unknown as opentype.PathCommand[];
    glyphs.push(
      new opentype.Glyph({
        name: glyphName(ch),
        unicode: ch.charCodeAt(0),
        advanceWidth: Math.round(advance || upm * 0.5),
        path,
      }),
    );
  }

  const out = new opentype.Font({
    familyName: params.familyName || "Untitled",
    styleName: "Regular",
    unitsPerEm: upm,
    ascender: font.ascender,
    descender: font.descender,
    glyphs,
  });
  return new Uint8Array(out.toArrayBuffer());
}
