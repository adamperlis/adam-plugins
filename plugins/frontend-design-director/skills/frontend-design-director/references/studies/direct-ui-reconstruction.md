# Direct UI reconstruction studies

Observed 30 September 2026, at **1280 × 720 CSS pixels**. These are four representative homepage studies, not a completed navigation audit. [Open the runnable studies](../../examples/reference-ui/index.html). The implementation is original React/CSS and sample content informed by the observations below; it is **not recovered source code**, a production integration, or a pixel-identical clone.

## Evidence and provenance

The live browser supplied screenshots, DOM structure, heading bounding rectangles, computed typography, linked stylesheet URLs, and the interaction observations listed below. Publicly served CSS was retrieved separately. Raw captures, measurements, and proprietary stylesheets stay in the local `work/direct-reference/` research directory, outside this public skill repository. The repository contains summarized findings and our own implementation, not redistributed reference fonts, imagery, bundles, or trademarks.

Primary references: [Cursor](https://cursor.com/), [Linear](https://linear.app/), [Firecrawl](https://www.firecrawl.dev/), [ElevenLabs](https://elevenlabs.io/).

| Reference | Heading x / y / width | Computed size / line height / weight | Observed role |
|---|---|---|---|
| Cursor | 20 / 164 / 658.31 px | 26 / 32.5 px / 400 | Compact proposition gives most visual weight to the software stage |
| Linear | 40 / 272 / 1198 px | 64 / 64 px / 510 | Large two-line statement precedes one continuous workspace |
| Firecrawl | 100 / 362 / 1080 px | 60 / 64 px / 500 | Centered statement prepares a direct operation input |
| ElevenLabs | 64 / 232 / 552 px | 48 / 52 px / 300 | Light display heading pairs with a separate explanation column |

Coordinates are document geometry at the captured state, not responsive constants. Font families observed were CursorGothic, Inter Variable, Suisse, and Waldenburg respectively. These names document the references; they do not grant a license or require those fonts in an adaptation. ElevenLabs' adjacent explanation uses Inter at 16 / 24 px, weight 400, x664, width 552. Its heading bounds are shorter than two nominal line boxes; do not infer a different line height from the bounding rectangle.

## 1. Cursor: the product is the composition

The desktop sequence is a restrained proposition and action, then a broad muted image ground holding an inset, legible application. The software has distinct navigation, conversation, and document regions. Their unequal widths and content density are central to the effect. A generic graph inside a rounded card would not reproduce this structure.

The separately observed lower chapter uses roughly one-third of the width for vertically centered copy and two-thirds for a dense application stage. The app extends toward the right edge rather than becoming a small floating card. This is a chapter-level observation, not a statement that the hero uses the same split.

The inspected public stylesheet defines a 24-column grid with a spacing token equivalent to 10px. Its media controller is a positioned grid with centered contents and hidden overflow. It also contains horizontal snap-scrolling card machinery and 0.14s / 0.25s transition tokens. Those are real stylesheet mechanisms, but their presence alone does not establish that each is active in the hero. Two gradient-mask utilities exist in the stylesheet; the hero's particular fade implementation was **not** mapped to those selectors.

The inspected DOM exposes desktop download and mobile get-started variants. This supports an intent change across devices, not a claim that a mobile screenshot has been reviewed.

Borrowable structure: keep an outer scene separate from the inner software viewport; define each pane's role and crop boundary; allow a document or result to extend beyond the frame only when the visible portion still proves the claim. Place concise copy outside that dense scene. Recompose on mobile around the task and consequence rather than shrinking all three panes.

## 2. Linear: continuous workspace and chapter changes

The homepage pairs a large heading with a wide workspace, rather than repeating isolated feature cards. The observed product stage starts near x32 / y550. Later workflow chapters use a left title and right explanation before a substantial UI scene. The inspected chapter headings are 48 / 48 px, weight 510, with widths around 542px. Intake, planning, automation, and shipping are different stages of a workflow, not four synonyms for speed.

The heading DOM contains separately controlled desktop and mobile line spans, marked `aria-hidden`, with a visually hidden semantic version. A raw `textContent` extraction repeats the sentence because it includes all variants; it is not evidence of duplicate visible headlines. This is a useful distinction when collecting measurements automatically.

The first retrieved CSS file was only a toast stylesheet. A second targeted retrieval found the matching `QI8oKG_` heading component in [the page's public CSS](https://static.linear.app/web/_next/static/css/CKPQrUOL.css). At widths up to 640px its title has a 360px maximum width and 38px font size. The description's maximum width becomes 378px at 1280px and 276px at 640px. Its container changes to a column with 20px gaps at 1024px. Title-line wrappers add 30px padding balanced by −30px margins and use the content box for transforms. These are inspected responsive declarations; the mobile rendering itself remains unreviewed.

That stylesheet contains base declarations for UI masks, but declarations are not necessarily the active visual state. For example, the source includes a 0.55 scale and an 80%-to-100% fade for `_9Zs8oG_panel`; the live inspected element instead computes to **no transform and no mask**. Treat these as conditional or overridden source declarations, not a recipe for the observed composition.

A subsequent live inspection mapped the actual intake board to the combined `MwJdiW_container qM9FAa_container` classes. Its **computed** mask uses three gradients: bottomward black through 40%, transparent at 90%; rightward black through 68%, transparent at 96%; leftward black through 55%, transparent at 65%. It is translated −120px on x. This is stronger evidence than reading an isolated class: additional selectors override the base rule. In the same live state, `_9Zs8oG_panel` computed to no mask and no transform, with hidden overflow. Do not copy the base 0.55 scale and assume it is the visible state.

Borrowable structure: make the UI one coherent working surface; use crop and fading to remove competing edges, not to obscure the focal result. Keep titles and explanations on different scales. Let each chapter change the product state and the reader's understanding. If separate visual line-break variants are useful, preserve one accessible heading rather than announcing the statement twice.

## 3. Firecrawl: an operation on an instrument-like grid

The captured composition is light, centered, and visibly gridded. The outer content spans approximately x84–1195; the inspected visual grid has roughly 100px cells. An announcement and navigation precede the spacious proposition. The operation input begins near y638. The accent is concentrated in a meaningful headline fragment and action-related elements.

The first downloaded stylesheet contains font declarations rather than the hero's layout. A targeted second retrieval found the global utility stylesheet and page-specific styles. The global `text-body-input` utility specifies 15px type with 24px line height and 400 weight; radial fade and mask-border utilities are also present. The page's beacon scene explicitly clips overflow and fades from 83% height to transparent at the bottom, but it is a separate scene, not proof of how the hero grid is drawn. The hero grid's exact source selector remains unresolved. No live scraping/search request was submitted during this research. Our example's local input → result behavior is an original demonstration, not Firecrawl's recovered service logic.

Borrowable structure: align a real operation to the underlying grid; specify a valid input, action, output, and invalid-input state. Keep output data structured and readable. Grid lines should establish alignment and scale, not merely decorate a conventional card layout. On narrow screens, preserve the input and readable output before secondary scaffolding.

## 4. ElevenLabs: change the proof mode, not just the label

The heading and explanation occupy two 552px columns separated by 48px. Below, three top-level product tabs are approximately 380.66px wide each. Nested selectors use content-driven widths rather than three equal columns again. This distinction establishes category versus submode hierarchy.

The live product-tab interaction was exercised: switching from the creative presentation to the API category replaces the orb/carousel-led scene with a code-editor presentation. The visible evidence changes medium; this is more substantial than changing a heading above the same decoration. The inspected tab DOM includes React Aria identifiers and roving `tabindex` values. This documents markup and selection behavior, **not** a complete keyboard-accessibility audit or recovered event handler.

The substantive public stylesheet contains a grid using a configurable column count and inner-gutter token, plus a full-bleed horizontal scroller with nowrap flex layout, horizontal overflow, and hidden vertical overflow. Responsive rules occur at 40, 48, 64, 80, 96rem and other thresholds. These are stylesheet inventory observations, not confirmation of which breakpoint controls this particular hero. Linear and radial mask utilities also exist; their association with a particular orb or carousel edge was not traced here.

Borrowable structure: keep the framing stable while changing the evidence to fit the selected audience. Creative proof can be a playable artifact; developer proof can be a request and response. Implement genuine selected states, associated panels, and keyboard navigation. Do not fake a tab switch with a color change alone.

## How to use these examples

Choose the structure that matches the claim, then replace its visual identity and content. These are optional examples, not a universal four-section page template. In particular, do not merge the four studies into the same familiar centered hero, three cards, dashboard, and closing slogan.

- Preserve the relationship between copy scale and UI scale, not merely the color palette.
- Write realistic sample states with enough detail to explain one task. Clearly identify fictional data.
- Distinguish a clipped viewport, a fade mask, a background scene, and the software inside it. They solve different composition problems.
- Keep source observations separate from implementation choices. Our responsive layout, substitute fonts, state transitions, and synthetic assets are our work unless explicitly verified against the source.
- For Adam's projects, use at most two loaded font families. Different hierarchy can come from size, weight, line height, measure, and placement.

## Limits and verification

Source desktop observation and the ElevenLabs tab switch are verified as described above. Source mobile rendering, full keyboard traversal, reduced-motion behavior, complete navigation coverage, and exact animation timing are **not verified by this study**. Local example tests must be recorded separately; they cannot upgrade source evidence.

No source JavaScript implementation, WebGL shader, Three.js scene, or View Transition implementation was recovered in this pass. Linked script URLs are an inventory, not code analysis. At the inspected DOM states, Cursor had 0 canvases / 1 video, Firecrawl 33 canvases / 0 videos, and the ElevenLabs API-selected page 2 canvases / 0 videos. Counts do not establish visibility, rendering context, framework, or which scene they drive. A canvas is not proof of WebGL or Three.js. Use a canvas or 3D engine only when the intended demonstration needs it; do not add one to satisfy a technology checklist.

The separate Ditto service jobs had returned queued status without generated files. These direct studies do not depend on those jobs and must not be described as Ditto-generated output.
