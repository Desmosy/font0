# Contributing

Contributions are welcome. The most important rule is that the app must remain
usable without a real API key.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3939.

The placeholder API key enables the deterministic fallback path. Add a real
`NVIDIA_API_KEY` only when you need to test model-backed generation.

## Before Opening A Pull Request

Run:

```bash
npm run check
```

Pull requests should be focused and easy to review. Avoid unrelated formatting,
large asset churn, or broad rewrites unless the change requires them.

## Development Guidelines

- Keep provider keys and generated credentials out of git.
- Preserve the prompt, edit, preview, and export workflow.
- Keep shared font parameter changes compatible with `sanitizeParams`.
- Prefer existing components and helpers over new abstractions.
- Keep the no-key fallback working for new generation behavior.
- Update docs when behavior, setup, or architecture changes.

## Adding Bundled Fonts

Only add fonts with redistribution-friendly licenses.

Checklist:

1. Add the font file to `public/fonts`.
2. Add or update the matching `@font-face` rule in `app/globals.css`.
3. Add the font entry in `lib/fontCatalog.ts`.
4. Use the font's real variable axis ranges.
5. Add license details to `THIRD_PARTY_NOTICES.md`.
6. Run `npm run check`.

Exported instances inherit the selected base font's license, so license metadata
must be accurate.

## Secrets

Do not commit:

- `.env` or `.env.local`
- real provider keys
- generated credentials
- screenshots that show keys
- issue logs that include authorization headers

If a key is exposed, revoke it before continuing development.
