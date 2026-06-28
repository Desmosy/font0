# Architecture

Font Generator is a browser-first font design app built with Next.js. It turns a
plain English prompt into a usable typeface by combining model-assisted design
choices with real variable font technology.

## What The Project Does

The app lets a user:

1. Describe a typeface in natural language.
2. Generate a font direction from that prompt.
3. Adjust the selected base font and its variable axes.
4. Edit individual glyph outlines in the browser.
5. Export a downloadable `.ttf` or `.otf` file.

The core design choice is conservative: the project uses real bundled variable
fonts as source material instead of asking a model to invent every glyph. That
means exported fonts start from professional outlines and complete character
sets.

## High-Level Flow

```text
prompt
  -> /api/generate
  -> model-backed JSON or deterministic fallback
  -> FontParams
  -> live CSS preview
  -> HarfBuzz/opentype export
```

`FontParams` is the shared contract between the API route and the UI:

```ts
{
  familyName: string;
  base: string;
  axes: Record<string, number>;
  tracking: number;
  shape: ShapeParams;
}
```

The UI sanitizes generated parameters before rendering or exporting, so invalid
model output cannot select unknown fonts or out-of-range axis values.

## Runtime Architecture

### Prompt Generation

`app/api/generate/route.ts` receives a prompt and returns sanitized font
parameters. When `NVIDIA_API_KEY` is configured, the route calls an
OpenAI-compatible NVIDIA endpoint. When no valid key exists, it uses a
deterministic keyword fallback.

The fallback is intentional. It lets contributors develop, test, and review the
project without paid credentials.

The route also includes:

- prompt and body size limits
- basic in-memory rate limiting
- upstream timeout configuration
- safe provider fallback behavior
- server-only API key usage

### Font Catalog

`lib/fontCatalog.ts` is the source of truth for bundled fonts. Each font entry
defines:

- stable id
- display label
- CSS family
- served file path
- variable axis ranges
- default axis values
- keyword hints for fallback generation

The catalog powers the model prompt, fallback generation, UI controls, live
preview, and export code.

### Live Preview

Most previews render through normal CSS:

```text
@font-face + font-variation-settings + letter-spacing
```

This keeps the studio fast. Character maps, specimens, weight ladders, and the
hero preview all render the same selected base font and axis values.

### Shape And Glyph Editing

`lib/genShape.ts` applies prompt-seeded geometric changes to glyph outlines.
`components/GlyphEditor.tsx` lets users move glyph nodes directly.

When a user edits a glyph, that glyph is frozen as edited outline data. Unedited
glyphs can still receive the global shape transform during export.

### Export

There are two export paths:

- No glyph edits or shape changes: `lib/instanceFont.ts` uses HarfBuzz
  (`public/hb-subset.wasm`) to pin variable axes and export a static `.ttf`.
- Edited or shaped glyphs: `lib/glyphOutline.ts` rebuilds an `.otf` with the
  modified outlines baked in.

The `.ttf` path preserves more of the original font behavior. The edited `.otf`
path prioritizes baking user geometry into a valid font file.

## Directory Map

```text
app/
  api/generate/route.ts   server-side prompt generation route
  page.tsx                landing page
  studio/page.tsx         main editor workspace
  globals.css             application styles and bundled @font-face rules

components/
  DesignPanel.tsx         base font, axis, tracking, and shape controls
  DesignPrompt.tsx        prompt input inside the studio
  FontSpecimen.tsx        preview, type scale, body text, weights, metadata
  GlyphEditor.tsx         SVG node editor for one glyph
  GlyphInspector.tsx      character map and glyph edit panel

lib/
  fontCatalog.ts          bundled font metadata and CSS helpers
  genShape.ts             prompt-seeded outline shaping
  glyphOutline.ts         glyph extraction and edited font assembly
  instanceFont.ts         HarfBuzz-backed static font instancing
  presets.ts              preset examples
  specimenContent.ts      preview text data
  types.ts                shared generated font parameter contract

public/
  fonts/                  bundled variable fonts
  hb-subset.wasm          HarfBuzz subset WebAssembly module
```

## API Key Model

This is a bring-your-own-key project. The repository should never contain real
provider keys. `.env.example` contains placeholders and documented defaults only.

For public deployments, configure:

- provider-side spending limits
- hosting-platform secret storage
- platform-level rate limiting if available
- the route limits from `.env.example`

## Adding A Font

To add a bundled font:

1. Confirm the license allows redistribution and derivative exports.
2. Add the font file to `public/fonts`.
3. Add an `@font-face` rule in `app/globals.css`.
4. Add the font metadata and real variable axis ranges in `lib/fontCatalog.ts`.
5. Update `THIRD_PARTY_NOTICES.md`.
6. Run `npm run check`.

Use the font's actual `fvar` axis ranges. Incorrect ranges can break preview or
export behavior.

## Current Limitations

- The built-in rate limiter is in-memory. It is useful for local and simple
  deployments, but not enough for multi-region or high-traffic production.
- Edited `.otf` exports rebuild the font from outlines and may not preserve all
  original kerning, substitutions, or advanced OpenType features.
- The model route chooses parameters; it does not create a fully original font
  family from scratch.
