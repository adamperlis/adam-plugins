# Verification — 0.2.0

Verified 29 September 2026. This is a bounded engineering and visual review, not an accessibility certification, performance benchmark, or proof of superiority to another skill.

## Build and packaging

- TypeScript checking and Vite production build passed.
- Skill frontmatter passed the skill-creator validator.
- Fonts are local; their SIL Open Font Licenses are included.
- Vite reports ignored `use client` directives and a large integration-lab chunk (approximately 1.36 MB before gzip, 399 KB gzipped). The lab intentionally mounts React, Framer Motion, GSAP, and Three.js together. It is not a recommended production bundle budget. Standalone studies do not load that chunk.
- Northstar retains a classic script for direct HTML-file use. Vite warns that it cannot bundle that tag; the build explicitly copies the script into the production destination.

## Browser checks

Automated checks used isolated headless Chrome on the local HTTP previews, with synthetic data only. No account creation, real checkout, external API submission, or reference-site mutation occurred.

| Surface | Exercised behavior |
|---|---|
| All four studies | One H1; no horizontal document overflow at 320, 390, 768, and 1440px; desktop and mobile captures |
| Northstar | Keyboard evidence selection; focus transfer; contrary evidence; commit and reopen synchronized across record, badge, and summary |
| Northstar without JavaScript | All three evidence explanations and navigation links readable |
| Lilt | Native finish selection updates the illustrated object; sample bag reflects selected finish |
| Relay | Accepted delivery, retry, and rejected-signature fixture branches |
| Fieldwork | Keyboard range input changes the observation path, output, and explanation |
| React lab | Two independent tab groups; unique IDs; arrow-key selection; ProductStory inside a form without accidental submit |
| GSAP lab | Desktop enhancement mounts; last step reachable; live reduced-motion switch restores all three static frames |
| WebGL lab | A dispatched context-loss event removes the canvas while preserving the CSS fallback |

No uncaught page errors were recorded in this test run. Context-loss event handling is tested; real GPU-driver loss and device-wide performance are not. The halftone shader remains an integration fragment, not a separately rendered and validated demo.

## Visual review

Reviewed the four desktop and mobile layouts. An independent Astra follow-up confirmed the prior blockers were resolved: synchronized decision state, readable evidence metadata, explicit non-submit button types, and the expanded integration lab. A narrow-screen finish-selector overflow and an unintended SVG grid fill were found and fixed during review.

Captured evidence: [Northstar desktop](../examples/previews/vanilla-desktop.png), [mobile](../examples/previews/vanilla-mobile.png), [dissent state](../examples/previews/vanilla-dissent.png); [Lilt](../examples/previews/commerce-desktop.png); [Relay](../examples/previews/developer-desktop.png); [Fieldwork](../examples/previews/research-desktop.png). These images show the examples, not the reference sites.

## Reproduce the checks

From `examples/`, install with `bun install --frozen-lockfile`, run `bun run build`, and serve the production output with `bun run preview --port 4174`. In another terminal:

```sh
bunx playwright install chromium
bun run verify
```

The runner writes screenshots and results to ignored `examples/test-results/`. Override `DESIGN_BASE_URL` for another server, and optionally `DESIGN_CHROME` for an existing Chrome executable. It tests the production site by default, including Northstar's copied script and the transformed shader imports.

## Still open

- Full screen-reader, contrast, zoom/reflow, touch-device, Safari, and Firefox audits.
- Real-device GPU, memory, battery, loading, and frame-time budgets.
- Complete visual/mobile/interaction research for all reference navigation destinations. See [coverage](studies/coverage.md): 477 discovered URLs are not 477 completed studies.
- A matched, blinded comparison against Claude's default skill; only the [evaluation protocol](audit-and-evaluation.md) exists today.
- User judgment of the revised art direction. Passing implementation checks cannot settle taste.
