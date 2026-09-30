# Iconography: choose a family, then use it consistently

Use a real SVG icon set for navigation, actions, file types, status, and playback. Do not assemble a product interface from unrelated Unicode symbols, emoji, and ad-hoc drawings. Ordinary punctuation, brand artwork, and simple CSS window dots are not interface-icon substitutes.

## Full selection catalog—every family is available as a choice

All 25 sets nominated by Adam, plus IBM Carbon, are eligible. **There is no default family and no preferred four-set shortlist.** Radix in the existing studies is one implementation example, not the starting point for every future design. Review the full catalog against the brief; inspect the actual glyphs before deciding. The prompts below are possible reasons to investigate a set, not claims that it only suits one category.

| Icon set | Selection prompt / when to investigate |
|---|---|
| Untitled UI Icons | Does the project need a cohesive product-design vocabulary that pairs with its UI components? Check the exact free or paid collection. |
| Feather Icons | Would a restrained, familiar outline vocabulary cover the required actions without extra visual weight? |
| Majesticons | Does the visual direction benefit from a different silhouette or paired outline/filled treatment? Inspect available variants. |
| Unicons by IconScout | Does its vocabulary cover the product's specialized subjects? Check the selected collection and distribution terms. |
| Heroicons Legacy v1.0 | Is an existing product already using v1 geometry? Preserve consistency rather than silently mixing in v2. |
| Heroicons v2.0 | Do its size/style variants fit the intended control sizes and selected states? Treat this separately from v1. |
| Iconoir | Does its particular outline character better match the project's typography and art direction? |
| Iconizer | Resolve the publisher and exact collection before downloading; the name alone is ambiguous. Then inspect its fit to the brief. |
| css.gg Icons | Would a CSS-oriented icon approach be useful in this stack? Inspect the selected distribution and rendering at actual size. |
| Phosphor Icons | Does the interface need a coherent range of icon weights or a more expressive treatment? |
| Radix Icons | Are compact, restrained glyphs appropriate for a dense interface? Its documented optical grid is 15×15. |
| Lucide Icons | Does its outline vocabulary and framework support match the product's needs? |
| Tabler Icons | Does the product need a wide vocabulary of specialized UI and domain symbols? |
| Ionicons | Does its visual language fit a mobile-oriented application or an existing Ionic-based product? |
| Remix Icon | Do its available treatments support a consistent selected/unselected system for this project? |
| Flowbite Icons | Does the project already use Flowbite, or do these glyphs best match the surrounding components? |
| Eva Icons | Does its geometry match the product's existing visual language, particularly in an Eva-based interface? |
| Atlas Icons | Does the chosen Atlas collection offer the vocabulary and stylistic range required? Verify the exact publisher and package. |
| MingCute Icons | Would a softer icon personality fit the product better than a neutral technical set? |
| Tetrisly Icons | Does its component-oriented vocabulary fit the design system? Verify the precise asset license. |
| Doodle Icons | Is a hand-drawn, illustrative direction intentional? Keep it separate from dense operational UI unless tested for clarity. |
| Solar Icons | Do its available styles suit the intended visual character? Verify attribution and redistribution conditions before adoption. |
| MynaUI Icons | Does its icon language integrate well with the project's component styling? |
| Fluent System Icons | Is a Microsoft/Fluent-compatible visual vocabulary appropriate, or does the product already use it? |
| Humbleicons | Does a quieter, economical icon vocabulary cover the required tasks? |
| IBM Carbon Icons | Is a technical, enterprise, or IBM-aligned direction appropriate? Use its designed size variants rather than arbitrary scaling. |

### How to choose from the catalog

Start with the product's visual brief and any existing system. Compare a few plausible sets using the **same actual required glyphs**—for example search, filter, document, person, warning, and playback—at the intended UI sizes. Select for optical clarity, personality, required coverage, framework fit, and license. Do not repeatedly choose a familiar set without considering whether another listed family better serves the brief. Record the choice and a brief reason in the project's direction notes.

The supplied icon counts, style counts, and license labels are discovery hints, **not verified metadata**. They can change or refer to a particular edition. Resolve the official source and verify the exact version/asset terms when selecting any family; do not copy the supplied counts or “no attribution” labels into client-facing claims.

Verified implementation entry points from this integration: [Radix](https://www.radix-ui.com/icons), [Carbon usage](https://carbondesignsystem.com/elements/icons/usage/) / [code](https://carbondesignsystem.com/elements/icons/code/), [Lucide](https://lucide.dev/), and [Phosphor React](https://github.com/phosphor-icons/react). These links are conveniences, not a restricted list of allowed families. Resolve the official distribution for any other selection before installing it.

## Implementation contract

- Prefer the project's existing family. Otherwise choose one family per interface and document it. Do not install every candidate or mix families for incidental variety.
- Use the library's intended sizes and geometry. Radix is designed on a 15×15 grid; Carbon documents 16/20/24/32px sizes. Do not force arbitrary stroke widths onto a filled-path set.
- Use `currentColor` so icons inherit state and contrast. Pair status color with text or another distinguishable cue.
- Import only the needed components. Avoid runtime CDN lookup and icon fonts when a local SVG/component package meets the task.
- A decorative icon beside text is `aria-hidden` and not focusable. An icon-only button needs an accessible name on the button, a visible focus treatment, and an adequate hit area independent of its glyph size.
- Keep feature illustration and icon roles separate: a file glyph can label a document, but it cannot demonstrate the document workflow.
- Check official license terms for the exact package or downloaded asset. Preserve required copyright/license notices. Free usage, open-source licensing, no visible credit, and permission to redistribute are distinct questions. Do not assume every product under a brand uses the same license.

## Borrowable implementation

The four reference studies use `@radix-ui/react-icons` 1.3.2, recorded in the examples lockfile. [Icons.tsx](../examples/reference-ui/Icons.tsx) provides a small named-import map and a decorative SVG wrapper; [style.css](../examples/reference-ui/style.css) handles baseline alignment. Existing labels carry meaning. No new font is loaded.

```tsx
import { PlayIcon } from '@radix-ui/react-icons';

<button type="button" aria-label="Play preview" onClick={playPreview}>
  <PlayIcon aria-hidden="true" focusable="false" width={15} height={15} />
</button>
```

Keep hit-target styling and behavior in the surrounding component. The wrapper is not a reason to hide a standalone meaningful icon from assistive technology without an accompanying label.

Radix's [official page](https://www.radix-ui.com/icons) and [license](https://github.com/radix-ui/icons/blob/main/LICENSE) identify MIT licensing. The installed package's notice is retained in `examples/public/licenses/radix-icons-LICENSE.txt` and copied by Vite into the build. This preserves the notice rather than interpreting “no attribution” as permission to remove it. Other candidate licenses were not audited in this integration.
