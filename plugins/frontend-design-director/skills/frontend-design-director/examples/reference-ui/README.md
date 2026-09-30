# Direct-reference UI studies

Four **original reimplementations of measured compositions**, not extracted vendor components, full-site clones, or production products. Source screenshots and raw source bundles stay outside this public repository. Original fictional branding, copy, CSS art, and product data.

Run the existing examples Vite server, then open `reference-ui/index.html`. Open the collapsed Studies control to switch examples; direct links accept `?study=cursor`, `?study=linear`, `?study=firecrawl`, and `?study=elevenlabs`.

## Code to borrow

- `Icons.tsx`: Radix SVG icon components, named imports, decorative accessibility defaults, and CSS window dots. Package version is locked; its MIT notice is retained in `../public/licenses/radix-icons-LICENSE.txt`.
- `FeatureGrids.tsx` + `feature-grids.css`: fifteen original UI-filled cells across four page-level feature grids, with unequal spans, crop layers, edge fades, and local interactions. Jump to `#features` or use the visible UI feature grids link. These are original extensions, not newly measured vendor layouts.
- `main.tsx`: independent compositions and their local interaction state, divided by source comments.
- `style.css`: Tailwind entry, focus treatment, two-family typography, and reduced-motion fallback.
- `responsive-review.html`: actual iframe viewports (320 / 390 / 768 / 1280), study switching, document-overflow measurement.

### Cursor → Fieldnote

Measured 1280px desktop composition: 26/32.5px normal hero at x20/y164; stage begins around y350, inset application at x100/y400; queue/conversation/document pane structure. Adaptation uses original gradient art instead of the reference image, approximate Arial font metrics instead of the proprietary font, and original writing UI. Task selection changes both the conversation and draft; approval state updates visibly. Narrow screens preserve document readability and replace the queue with a select; the conversation precedes the document.

### Linear → Tandem

Measured desktop composition: 64/64px title, x40/y272; workspace begins around y550. Large continuous application view, quiet chrome, detailed content, decorative right-edge fade. Chapter uses a 48px title opposite 26px explanatory text, then foreground conversation over a masked board. Issue selection changes the title, description, and criteria; Document/Activity changes content; status select changes local state. All data is fictional. No persistence or issue backend.

### Firecrawl → Pagewire

Measured desktop composition: 1112px bounded instrument grid, 101px cells, centered 60/64px proposition, orange action syntax, compact operation input. Source/result scene is an original extension, not an observed exact section clone. Validates URL syntax; every valid URL loads the **same local fixture**, clearly labeled. Format controls render Markdown, JSON, or text. No crawling, requests, backend, or invented metrics.

### ElevenLabs → Sonora

Measured desktop composition: 48/52px heading, 552px columns with 48px gap, wide segmented selector above a cropped large-orb composition. Uses original CSS gradients, **not WebGL**, and no vendor assets. Voice choice, category, product context, and silent visual-preview state are local interactive controls. API panel is illustrative. No speech or audio is generated.

## Evidence limits

Sources inspected September 30, 2026: https://cursor.com/, https://linear.app/, https://www.firecrawl.dev/, https://elevenlabs.io/. Primary desktop capture: 1280 × 720. These are focused studies, not complete navigation coverage. Mobile arrangements are original adaptations, not verified reproductions of the source sites' mobile layouts. No claim of pixel-perfect fidelity, source-code equivalence, or vendor behavior equivalence. Publicly served source evidence and visual observations are documented separately in the skill research ledger.

Typography uses Arial and monospace only. Focus styles and reduced-motion fallbacks are implemented; see [REVIEW.md](REVIEW.md) for tested states and limits. The collapsed study selector is research tooling, not part of the referenced composition.
