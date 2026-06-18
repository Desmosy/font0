import { NextResponse } from "next/server";
import { sanitizeParams, type FontParams } from "@/lib/types";
import { FONTS, FONT_BY_ID, DEFAULT_FONT_ID } from "@/lib/fontCatalog";

export const runtime = "nodejs";

// Describe the bundled fonts + their real axis ranges so the model picks a base
// and dials axes that actually exist on that font.
const CATALOG = FONTS.map((f) => {
  const axes = f.axes
    .map((a) => `${a.tag} ${a.min}-${a.max} (${a.label.toLowerCase()})`)
    .join(", ");
  return `- "${f.id}" — ${f.category}: ${f.blurb} Axes: ${axes}.`;
}).join("\n");

const SYSTEM_PROMPT = `You are a type director. A user briefs a typeface; you choose the best matching base font from a fixed library of professional variable fonts and dial its variable axes to fit the brief. Output is rendered by instancing that real font, so every glyph is professional.

Available base fonts (id — personality — axes with valid ranges):
${CATALOG}

Respond with ONLY a JSON object (no prose, no markdown fences) of exactly this shape:
{
  "familyName": string,   // short original display name fitting the brief
  "base": string,         // one of the font ids above
  "axes": { ... },        // axis values, keys EXACTLY as listed for the chosen base; stay within each range
  "tracking": number,     // letter spacing in 1/1000 em, -40 tight .. 160 airy, 0 default
  "shape": {              // GENERATIVE geometry — reshapes the actual curve points
    "slant": number,      // shear degrees -20..20 (positive leans right; use for italic/dynamic/energetic)
    "width": number,      // horizontal scale 0.7 condensed .. 1.4 extended, 1 = normal
    "vstretch": number,   // vertical scale 0.82 short .. 1.18 tall, 1 = normal
    "distortion": number  // organic wobble 0 clean .. 1 wild (raise for funky/comic/stupid/grunge/hand-drawn/messy/weird)
  }
}

Guidance:
- Match personality first: professional/UI/Helvetica/Open Sans -> inter; geometric/futurist/startup -> spacegrotesk; rounded/friendly/playful/kids -> nunito; editorial/magazine/characterful serif -> fraunces; elegant/fashion/luxury/high-contrast -> playfairdisplay; slab/industrial/sturdy -> robotoslab; code/mono/technical/terminal -> jetbrainsmono; quirky/expressive/distinctive/casual/handwritten/"unique" -> recursive.
- IMPORTANT — make every brief feel distinct: use the FULL set of axes the base offers, not just weight. Two different briefs on the same base should land on visibly different axis values. Push axes toward the extremes the brief implies rather than safe middles.
- Weight: light ~330, regular ~430, medium ~540, semibold ~620, bold ~720, black ~860 (clamp to the base's wght range). Reflect intensity words (loud/strong/bold/heavy -> heavier; delicate/elegant/quiet -> lighter).
- recursive axes: MONO 0 sans..1 monospace (raise for techy/code/precise); CASL 0 linear..1 casual (raise for warm/friendly/handmade/playful); slnt 0..-15 (use -8..-12 for italic/dynamic/energetic); CRSV 0 or 1 (1 for script/cursive/handwritten).
- inter: higher opsz (24-32) for display/headline, lower (14-18) for body/UI.
- fraunces: higher opsz = more contrast (use 70-120 for high-contrast/elegant/display briefs), SOFT 0 sharp..60 soft, WONK 1 only for "quirky".
- Tracking: tight/compact -40..-12, airy/spacious/luxurious 40..130, otherwise 0.
- shape (use it! this is what makes each brief unique): clean/professional/corporate -> distortion 0, slant 0, width 1. funky/quirky/playful -> distortion 0.3-0.5, maybe width 1.1-1.25. comic/cartoon/childish -> distortion 0.25-0.4, vstretch 1.05-1.12, width 1.05-1.2. stupid/silly/goofy/messy/grunge/broken -> distortion 0.5-0.8. elegant/refined -> distortion 0, maybe slant 6-10. dynamic/energetic/sporty/italic -> slant 10-16. condensed/narrow -> width 0.78-0.9. extended/wide/bold-impact -> width 1.15-1.35. tall -> vstretch 1.1-1.16; squat -> vstretch 0.85-0.92.
Output JSON only. Pick deliberately; vary axes AND shape so two different briefs never look the same.`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json found");
  return JSON.parse(body.slice(start, end + 1));
}

/** Deterministic keyword fallback when the model is unavailable. */
function heuristicParams(prompt: string): FontParams {
  const p = prompt.toLowerCase();
  const has = (...w: string[]) => w.some((x) => p.includes(x));

  // Score each font by keyword hits; pick the best, else default.
  let bestId = DEFAULT_FONT_ID;
  let bestScore = 0;
  for (const f of FONTS) {
    const score = f.keywords.reduce((n, k) => (p.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      bestId = f.id;
    }
  }
  const def = FONT_BY_ID[bestId];
  const axes: Record<string, number> = { ...def.defaults };

  // Weight
  const wghtAxis = def.axes.find((a) => a.tag === "wght");
  if (wghtAxis) {
    let w = axes.wght ?? 430;
    if (has("thin", "hairline")) w = 220;
    else if (has("light", "delicate")) w = 320;
    else if (has("bold", "strong", "heavy", "black", "impact")) w = 760;
    else if (has("medium", "semibold")) w = 560;
    axes.wght = Math.min(wghtAxis.max, Math.max(wghtAxis.min, w));
  }
  // Contrast / display via optical size where available
  const opszAxis = def.axes.find((a) => a.tag === "opsz");
  if (opszAxis) {
    if (has("elegant", "high contrast", "high-contrast", "fashion", "luxury", "display", "didone", "headline")) {
      axes.opsz = Math.round(opszAxis.max * 0.7);
    } else if (has("body", "ui", "text", "paragraph", "small")) {
      axes.opsz = opszAxis.min;
    }
  }
  // Softness for fraunces
  if (def.axes.some((a) => a.tag === "SOFT") && has("soft", "round", "warm", "friendly")) axes.SOFT = 60;
  // Recursive expressive axes
  if (def.axes.some((a) => a.tag === "MONO") && has("mono", "code", "techy", "technical", "precise")) axes.MONO = 1;
  if (def.axes.some((a) => a.tag === "CASL") && has("casual", "warm", "friendly", "handmade", "playful", "fun")) axes.CASL = 1;
  // Slant / italic (recursive has a real slnt axis)
  if (def.axes.some((a) => a.tag === "slnt") && has("italic", "slanted", "oblique", "dynamic", "energetic")) axes.slnt = -10;
  if (def.axes.some((a) => a.tag === "CRSV") && has("script", "cursive", "handwritten", "signature")) axes.CRSV = 1;

  // Generative shaping — the per-prompt geometry change.
  const shape = { slant: 0, width: 1, vstretch: 1, distortion: 0, seed: 0 };
  if (has("funky", "quirky", "playful", "weird", "wonky")) shape.distortion = 0.42;
  if (has("comic", "cartoon", "childish", "kids", "fun")) { shape.distortion = Math.max(shape.distortion, 0.3); shape.vstretch = 1.08; shape.width = 1.1; }
  if (has("stupid", "silly", "goofy", "messy", "grunge", "broken", "ugly", "chaotic")) shape.distortion = 0.65;
  if (has("hand", "handdrawn", "hand-drawn", "sketch", "marker", "doodle")) shape.distortion = Math.max(shape.distortion, 0.35);
  if (has("dynamic", "energetic", "sporty", "italic", "fast", "slanted")) shape.slant = 13;
  else if (has("elegant", "refined", "sophisticated")) shape.slant = 8;
  if (has("condensed", "narrow", "tall")) shape.width = 0.84;
  else if (has("extended", "wide", "expanded", "impact")) shape.width = 1.22;
  if (has("tall")) shape.vstretch = 1.12;
  else if (has("squat", "short", "stubby")) shape.vstretch = 0.88;

  let tracking = 0;
  if (has("tight", "compact", "condensed")) tracking = -25;
  else if (has("airy", "spacious", "open", "wide", "luxurious")) tracking = 90;

  // Family name
  let familyName = "";
  const m = prompt.match(/(?:called|named|name[:d]?)\s+["']?([A-Za-z][\w -]{1,28})/i);
  if (m) familyName = m[1].trim();
  else familyName = prompt.trim().split(/\s+/).slice(0, 2).join(" ").replace(/[^\w -]/g, "");
  familyName = (familyName || "Untitled").replace(/\b\w/g, (c) => c.toUpperCase());

  return sanitizeParams({ familyName, base: bestId, axes, tracking, shape });
}

export async function POST(req: Request) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = typeof body?.prompt === "string" ? body.prompt.slice(0, 600) : "";
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!prompt.trim()) return NextResponse.json({ error: "empty prompt" }, { status: 400 });

  const key = process.env.NVIDIA_API_KEY;
  const baseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";

  if (!key || key.includes("xxxx")) {
    return NextResponse.json({ params: heuristicParams(prompt), source: "heuristic" });
  }

  const requestBody = JSON.stringify({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    // Precise brief->font mapping, not a creative task — keep it stable.
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 800,
    chat_template_kwargs: { enable_thinking: false },
  });

  try {
    // NVIDIA's NIM endpoint occasionally returns transient 5xx under load.
    // Retry with backoff so a blip doesn't silently drop us to the heuristic.
    let resp: Response | null = null;
    let lastStatus = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      resp = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: requestBody,
        signal: AbortSignal.timeout(60000),
      });
      if (resp.ok) break;
      lastStatus = resp.status;
      if (resp.status < 500 && resp.status !== 429) break;
      const detail = await resp.text().catch(() => "");
      console.error(`NVIDIA error (attempt ${attempt + 1})`, resp.status, detail.slice(0, 200));
      if (attempt < 2) await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }

    if (!resp || !resp.ok) {
      return NextResponse.json(
        { params: heuristicParams(prompt), source: "heuristic-fallback", error: `NVIDIA ${lastStatus}` },
        { status: 200 },
      );
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content);
    const params = sanitizeParams(parsed as Partial<FontParams>);
    return NextResponse.json({ params, source: "nemotron" });
  } catch (err) {
    console.error("generate failed", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { params: heuristicParams(prompt), source: "heuristic-fallback", error: msg },
      { status: 200 },
    );
  }
}
