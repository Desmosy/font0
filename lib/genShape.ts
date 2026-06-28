import type { Cmd } from "./glyphOutline";

export interface ShapeParams {
  slant: number;
  width: number;
  vstretch: number;
  distortion: number;
  seed: number;
}

export const IDENTITY_SHAPE: ShapeParams = {
  slant: 0,
  width: 1,
  vstretch: 1,
  distortion: 0,
  seed: 0,
};

export function isIdentityShape(s: ShapeParams | undefined | null): boolean {
  return (
    !s ||
    (s.slant === 0 && s.width === 1 && s.vstretch === 1 && s.distortion === 0)
  );
}

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function applyShaping(commands: Cmd[], upm: number, sp: ShapeParams, char: string): Cmd[] {
  const out = commands.map((c) => ({ ...c }));
  const tan = Math.tan((sp.slant * Math.PI) / 180);
  const mag = sp.distortion * upm * 0.06;

  if (mag > 0) {
    const rng = mulberry32((sp.seed ^ hashSeed(char) ^ 0x9e3779b9) >>> 0);
    for (let i = 0; i < out.length; i++) {
      const c = out[i];
      if (c.x === undefined) continue;
      const dx = (rng() * 2 - 1) * mag;
      const dy = (rng() * 2 - 1) * mag;
      c.x += dx;
      c.y = (c.y as number) + dy;
      if (c.type === "C") { c.x2 = (c.x2 as number) + dx; c.y2 = (c.y2 as number) + dy; }
      if (c.type === "Q") { c.x1 = (c.x1 as number) + dx; c.y1 = (c.y1 as number) + dy; }
      const nx = out[i + 1];
      if (nx && (nx.type === "C" || nx.type === "Q")) {
        nx.x1 = (nx.x1 as number) + dx;
        nx.y1 = (nx.y1 as number) + dy;
      }
    }
  }

  const tf = (x: number, y: number): [number, number] => {
    const ny = y * sp.vstretch;
    const nx = x * sp.width + ny * tan;
    return [nx, ny];
  };
  for (const c of out) {
    if (c.x !== undefined) [c.x, c.y] = tf(c.x, c.y as number);
    if (c.x1 !== undefined) [c.x1, c.y1] = tf(c.x1, c.y1 as number);
    if (c.x2 !== undefined) [c.x2, c.y2] = tf(c.x2, c.y2 as number);
  }
  return out;
}

export function shapedAdvance(advance: number, sp: ShapeParams): number {
  return advance * sp.width;
}
