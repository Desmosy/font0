# Third-Party Notices

This project bundles fonts and WebAssembly assets so the app can preview and
export fonts locally in the browser.

Application code is MIT licensed. Bundled assets keep their original upstream
licenses.

## Bundled Fonts

Fonts in `public/fonts` are open-licensed. Exported instances or derivatives
inherit the selected base font's license.

| File | Project | License |
| --- | --- | --- |
| `Fraunces.ttf` | Fraunces | SIL Open Font License 1.1 |
| `Inter.ttf` | Inter | SIL Open Font License 1.1 |
| `JetBrainsMono.ttf` | JetBrains Mono | SIL Open Font License 1.1 |
| `Nunito.ttf` | Nunito | SIL Open Font License 1.1 |
| `PlayfairDisplay.ttf` | Playfair Display | SIL Open Font License 1.1 |
| `Recursive.ttf` | Recursive | SIL Open Font License 1.1 |
| `RobotoSlab.ttf` | Roboto Slab | Apache License 2.0 |
| `SpaceGrotesk.ttf` | Space Grotesk | SIL Open Font License 1.1 |

When redistributing exported fonts, preserve any notices required by the base
font license.

## WebAssembly

`public/hb-subset.wasm` is used by `harfbuzzjs` for browser-side font
instancing. HarfBuzz and harfbuzzjs retain their upstream license terms.

## Adding Notices

When adding a bundled font or binary asset, include:

- asset filename
- upstream project name
- license name
- required notices or attribution
- source URL in the pull request description
