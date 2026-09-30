# Borrowable code library

The examples are optional ingredients, not rules. Search [`../examples/pattern-index.json`](../examples/pattern-index.json) by `archetypes`, `technologies`, or `purpose`, then inspect the listed files.

## Start with the simplest layer

1. **HTML + CSS:** content hierarchy, responsive composition, product frames, grids, cards, pricing, editorial rhythm.
2. **Small JavaScript:** tabs, disclosure, progressive enhancement, pointer-responsive detail.
3. **React/Tailwind:** reusable components when the target already uses React.
4. **Framer Motion or GSAP:** state transitions or scroll narratives that CSS cannot express clearly.
5. **WebGL/R3F:** a governing visual metaphor, spatial explanation, material effect, or high-volume GPU animation.

Do not add a dependency solely because an example uses it. Translate the underlying behavior into the project’s existing stack when practical.

## Runnable studies

The build-served `examples/reference-ui/` contains four independent, source-attributed SaaS composition studies selected with `?study=cursor`, `linear`, `firecrawl`, or `elevenlabs`. Read [the evidence record](studies/direct-ui-reconstruction.md) before borrowing. Public code is original; inspected vendor HTML/CSS and screenshots are research evidence, not redistributed assets. These studies supplement—not replace—the older HTML examples below.

Open `examples/index.html` for the gallery. Four distinct studies work without a build:

- `vanilla/`: Northstar, an evidence workspace with linked notes, dissent, explanations, and a reversible sample commitment. Without JavaScript, all evidence stays visible and anchors work normally.
- `commerce/`: Lilt, a physical product with an original SVG object, native finish selection, sample bag feedback, specifications, and disclosures.
- `developer/`: Relay, a technical instrument with request/response fixtures for success, retry, and rejection. No external API is called.
- `research/`: Fieldwork, an editorial research narrative with a keyboard-operable range input that changes synthetic noise on a labeled chart.

Each study has its own hierarchy, proof format, and visual system. See [composition-recipes.md](composition-recipes.md) for why those choices fit the example. Replace all sample content and assumptions before real use. These are fictional demonstrations, not working businesses.

## Product-led SaaS and cinematic studies

- `examples/concepts/`: three independent Dayform art directions, selected by `?direction=closing`, `ledger`, or `room`. Borrow the reversible close-day workflow, live hours/rate/invoice calculation with draft invalidation, and phase-linked budget with an original shader background. Each has a distinct composition and two-family type system; they are candidates awaiting user selection, not a prescribed SaaS template. Read `DIRECTION.md`, `REVIEW.md`, and `ASSETS.md`. All product data and studio photography are illustrative.
- `examples/reference-ui/FeatureGrids.tsx` and `feature-grids.css`: 15 original UI-filled feature cells across four distinct grids. Borrow the separating layers (claim / cropped art / reachable controls), code diff, linked request, priority menu, schema, delivery event, audio editor, and review invalidation. Direct links use `?study=elevenlabs#features` (or cursor, linear, firecrawl). These extend the inspected compositions; they are not recovered vendor components.
- `examples/saas/`: Cadence, rebuilt under Frontend Design Director with exactly two loaded font families. Four purpose-built UI slots: working schedule/change preview, source-to-task fragments, an inspectable handoff canvas, and a release gate. Borrow the proposed/applied state separation, invalidation of earlier reviews, keyboard tabs, pricing calculation, and scroll-drawn SVG route. On mobile the schedule becomes dated cards. Run through Vite; read its `DIRECTION.md` and `REVIEW.md` before adapting it. No backend or real integrations.
- `examples/luma-directed/`: an object-first physical-product study with a persistent Three.js instrument and material selection. This is a different proof strategy from Cadence, not a required visual treatment for SaaS.
- `examples/cinematic/`: the earlier cinematic proposal, retained for comparison rather than presented as the current direction.

The [navigation follow-up](studies/navigation-followup-studies.md) explains which reference structures informed Cadence and which observations remain partial.

## Integration lab

From `examples/`, run `bun install --frozen-lockfile`, then `bun run dev` and open `/lab.html`. `bun run build` typechecks the recipes and builds all pages. The lab mounts two independent tab sets, ProductStory in a form, a reveal, a magnetic link, the WebGL field, and a GSAP scroll sequence. See [verification.md](verification.md) for actual tested states rather than assuming all recipes are fully verified.

## React and Tailwind

For icons, read [iconography.md](iconography.md) and borrow `examples/reference-ui/Icons.tsx`. The current studies use Radix SVG components with accessible surrounding labels, not Unicode UI symbols. Use another coherent family when the project calls for it.

`examples/react/MarketingPatterns.tsx` contains structural sketches for hero, product window, chapter, metrics, pricing, and CTA. They are not the preferred visual identity. Prefer the complete studies when choosing art direction. The file uses Tailwind utility classes with injectable content and optional `--pattern-radius` / `--pattern-accent` overrides.

`examples/react/MotionPatterns.tsx` contains Framer Motion examples for section reveals, a magnetic action, layout tabs, and an accessible product-story sequence. Motion is disabled or simplified when reduced motion is requested.

## GSAP

`examples/motion/scroll-story.ts` progressively enhances a pinned product story with `gsap.matchMedia()`, cleans up correctly, and leaves a readable static layout on small screens or reduced motion.

## WebGL and shaders

For occasional shaders behind product UI, read [shader-backed-ui.md](shader-backed-ui.md). `examples/webgl/paper-background.ts` is a reusable guarded Paper Shaders mount; the Harvest concept uses it on a separate background layer beneath semantic UI. It supplements—not replaces—the original Three/R3F examples below. Use Paper for 2D shader effects, Three for genuine spatial/material scenes, and CSS/WAAPI for ordinary UI feedback.

`examples/webgl/AtmosphereCanvas.tsx` is an R3F material study with a static CSS fallback, error boundary, context-loss handling, DPR cap, document/offscreen pausing, and reduced-motion handling. Read [the integration instructions](../examples/webgl/README.md) before copying it. The `?raw` shader imports require Vite or an equivalent configured loader.

- `atmosphere.vert`: low-amplitude vertex displacement.
- `atmosphere.frag`: an original soft spectral field with grain and pointer focus.
- `halftone.frag`: a print/data fragment requiring texture/uniform integration; it is not a runnable effect by itself.

WebGL is appropriate when it communicates material, space, motion, or a core metaphor. It is usually wrong for routine feature sections, forms, pricing, or text-heavy pages.

## Archetype starters

`examples/starters/archetypes.ts` defines section blueprints and proof types for six archetypes. `ArchetypePage.tsx` is explicitly a planning wireframe, with a `renderProof` slot and `className` override. It is not six art-directed pages. Use the sequences as prompts, replace planning copy, and supply a project-specific composition.

## Adaptation checklist

- Replace sample text and data with real product content.
- Map colors, type, spacing, and radius values to existing tokens.
- Remove dependencies the repository does not already need.
- Verify keyboard order, labels, focus visibility, touch behavior, and reduced motion.
- Test static fallback before approving an effect.
- Profile hero media and WebGL on a mid-range mobile device.
