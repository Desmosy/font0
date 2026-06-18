# Glyph Atelier — generate a professional font from a prompt

Describe a typeface in plain English and get a real, downloadable **TrueType
font**. Instead of drawing letterforms from scratch, the AI picks the best
matching **open-licensed variable font** from a curated library and dials its
variable axes to fit your brief — so every glyph (lowercase, numerals, `&@#%`)
is professionally drawn. Export instances a static `.ttf` at your chosen design.

## Pages

- **`/` — landing.** Prompt entry over the atelier mockup. Submitting opens the
  studio.
- **`/studio` — workspace.** A character map, base-font picker, live variable
  axis + tracking controls, type-scale / body / weight specimens, and download.
  Reads `?prompt=` / `?preset=` from the landing.

## How it works

```
prompt ──▶ /api/generate ──▶ NVIDIA Nemotron ──▶ { base, axes, tracking }
                                  │ (keyword fallback if no key)
                                  ▼
{ base, axes } ──▶ @font-face + font-variation-settings ──▶ live preview
               └─▶ harfbuzz (hb-subset.wasm) instancing ──▶ static .ttf download
```

- **`lib/fontCatalog.ts`** — the curated library of bundled variable fonts
  (Inter, Space Grotesk, Recursive, Nunito, Fraunces, Playfair Display, Roboto
  Slab, JetBrains Mono), each with its real `fvar` axis ranges, personality, and
  keywords. The single source of truth for the AI, the UI, and export. Recursive
  in particular (sans↔mono, linear↔casual, slant, cursive) gives the AI a wide
  expressive range so different briefs land on visibly different letterforms.
- **`app/api/generate/route.ts`** — turns a prompt into `{ base, axes, tracking }`
  via Nemotron (OpenAI-compatible endpoint). Deterministic keyword fallback
  scores the catalog when no key is set, so the app always works.
- **Live rendering** — every surface (character map, preview, type scale, body)
  renders the same real font via `@font-face` + `font-variation-settings`, so
  what you see is exactly what you download.
- **`lib/instanceFont.ts`** — on download, [harfbuzz](https://harfbuzz.github.io/)
  (`hb-subset.wasm`) pins the chosen axes and emits a static `.ttf`, entirely in
  the browser (no server, so it works on serverless hosting).

## Editing model

Two layers, both exportable:

1. **Variable-axis design** — pick a base, then drag **Weight**, **Optical size**,
   font-specific axes (Fraunces **Softness/Wonk**, Recursive **Mono/Casual/Slant/
   Cursive**), and **Tracking**.
2. **Per-glyph node editing** — select any glyph to open its real outline in the
   canvas and **drag the nodes** to reshape it (`components/GlyphEditor.tsx`).
   Edited glyphs are flagged and freeze at edit time; every surface updates live.

With no edits, export instances a TrueType (`.ttf`) via harfbuzz (keeps
kerning/features). With edits, export assembles a fresh OpenType (`.otf`) from the
extracted outlines with your node edits baked in (`lib/glyphOutline.ts`).

## Bundled fonts & licensing

Fonts live in `public/fonts` and are all open-licensed (OFL / Apache 2.0) from
[Google Fonts](https://github.com/google/fonts). Exported instances inherit the
base font's license — keep the license notice when redistributing.

## Run

```bash
npm install
cp .env.example .env.local   # add your NVIDIA key (or leave the placeholder)
npm run dev                  # http://localhost:3939
```

Without a key the app runs on the keyword fallback. With a key, set:

```
NVIDIA_API_KEY=nvapi-...
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

> ⚠️ Keep the key server-side only. If a key was ever shared in plaintext,
> rotate it at https://build.nvidia.com.

## Adding a font

Drop a variable `.ttf` in `public/fonts`, add a matching `@font-face` in
`app/globals.css`, and append a `FontDef` (with its real `fvar` axis ranges) to
`lib/fontCatalog.ts`. It immediately becomes selectable by the AI and the UI.
# font0
