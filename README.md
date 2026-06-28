# Font Generator

Font Generator is a prompt-driven type design studio. Describe the feeling of a
typeface, edit the result in the browser, and export a real font file.

The app does not generate raw glyphs from scratch. It starts from bundled
open-licensed variable fonts, chooses a matching base, adjusts real OpenType
axes, and optionally applies editable geometric shaping. This keeps exported
fonts usable while still making each prompt feel distinct.

## Features

- Prompt-to-font parameter generation through a server-side model route
- No-key local fallback, so contributors can run the project immediately
- Bundled open-licensed variable font catalog
- Live axis controls for weight, optical size, width, slant, and font-specific axes
- Character map and per-glyph node editing
- Browser-side `.ttf` export with HarfBuzz instancing
- `.otf` export when glyph geometry has been edited or shaped

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3939.

You do not need an API key for local development. With the placeholder key in
`.env.example`, `/api/generate` uses the deterministic fallback.

## Optional API Key

Add a key only if you want to test model-backed generation:

```env
NVIDIA_API_KEY=nvapi-...
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

Provider keys must stay server-side. Do not expose them through `NEXT_PUBLIC_*`,
client components, screenshots, issues, or commits.

Optional route limits:

```env
GENERATE_RATE_LIMIT=30
GENERATE_RATE_WINDOW_MS=60000
NVIDIA_TIMEOUT_MS=60000
```

## Project Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) - what the project does, how it works, and how the code is organized
- [CONTRIBUTING.md](./CONTRIBUTING.md) - local setup, pull request expectations, and font contribution rules
- [SECURITY.md](./SECURITY.md) - API key handling and vulnerability reporting
- [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) - bundled font and WebAssembly notices

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run check
```

`npm run check` is the command CI runs.

## License

Application code is licensed under MIT. Bundled fonts and WebAssembly assets keep
their original upstream licenses. Exported font instances inherit the license of
the selected base font.
