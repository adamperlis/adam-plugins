---
name: frontend-design-director
metadata:
  version: 0.4.3
description: Design, build, or critique distinctive marketing websites and product frontends by first identifying the site archetype, then applying an evidence-backed structure, visual system, interaction model, and quality bar. Use for landing pages, multi-page marketing sites, SaaS and AI products, developer tools, fintech, ecommerce or physical products, research/editorial sites, portfolios, and high-concept launches. Do not use for ordinary application UI work where an established product design system already dictates the answer.
---

# Frontend Design Director

Create a coherent design argument, not a decorated template. Preserve an existing brand or design system when one exists; these references supply reasoning and structure, never someone else’s identity, copy, assets, or signature composition. All recipes and code samples are optional starting points: adapt, combine, or ignore them when the product, repository, or audience calls for a different answer.

## Route before designing

### Ask about the existing UI first

Before designing or rebuilding a site, explicitly establish: **“Should we use the existing UI, or start from scratch?”** Ask once per project when the answer is not already explicit. For an existing brand, distinguish the marketing-site layout from the product UI shown within it: keeping the brand does not answer whether to preserve its application screens. A useful single question is “Keep the existing site/product UI, redesign the marketing site around the existing product UI, or design both from scratch?” If the user already chose, confirm that choice rather than asking again. For a genuinely new product with no UI, confirm the from-scratch direction.

Record the answer in the direction notes. While awaiting it, research and inventory the existing system, but do not finalize or replace its UI. Preserve mode uses real or faithfully reconstructed screens and the established design system; redesign mode permits new UI, clearly labeled as concept rather than actual product screenshots. This is Adam's requested intake gate, not a requirement to ask again before every small edit.

Identify the primary archetype and buying condition. If the brief spans categories, choose one primary archetype and at most one secondary influence.

| Archetype | User must believe | Default evidence | Read |
|---|---|---|---|
| Product-led SaaS / AI | “I understand the workflow and want to try it.” | product-in-action, use cases, customer proof | [saas-ai.md](references/saas-ai.md) |
| Developer platform / infrastructure | “It works, integrates, and will scale.” | live-looking output, code, architecture, benchmarks | [developer-platforms.md](references/developer-platforms.md) |
| Enterprise / fintech | “This is credible, controlled, and worth switching to.” | outcomes, controls, implementation, trust | [fintech-enterprise.md](references/fintech-enterprise.md) |
| Ecommerce / physical product | “I desire this object and can confidently buy it.” | product photography, detail, fit, proof, logistics | [commerce-physical.md](references/commerce-physical.md) |
| Research / science / editorial | “I grasp why this matters and trust the work.” | narrative, diagrams, publications, people | [research-editorial.md](references/research-editorial.md) |
| Portfolio / studio / launch | “This point of view is memorable.” | art direction, selected work, one governing metaphor | [portfolio-experimental.md](references/portfolio-experimental.md) |

When uncertain, read [routing.md](references/routing.md). For inner pages, read [page-archetypes.md](references/page-archetypes.md) and the relevant [inner-page composition study](references/studies/inner-page-studies.md).

## Working method

1. Write a one-sentence concept: “This site should feel like **X** because the audience needs to believe **Y**.”
2. Choose a small set of relevant references from [reference-library.md](references/reference-library.md). Read the matching measured examples in [visual-studies.md](references/studies/visual-studies.md). Check their evidence level: an extracted heading list cannot substantiate a visual or interaction claim. References can support architecture, expression, or a particular behavior; there is no required number.
3. Establish the page’s job, conversion, proof burden, and one dominant visual idea before choosing components.
4. Draft the section sequence in plain language. Every section must advance understanding, proof, differentiation, or action; remove sections that only restate the hero.
   For product-led pages, identify the claim each UI scene proves, then choose actual UI, a focused crop, simplified UI, or an interactive demonstration. Borrow section-level layout patterns as well as surface styling: relative cell sizes, text-to-art alignment, crop boundaries, and changes in density. Record which inspected reference supports the choice. Read the UI-scene guidance in [saas-ai.md](references/saas-ai.md); one dashboard should not carry every claim.
5. Sketch two plausible compositions before committing to a showcase design. Choose the one that best explains this product. Record actual type sizes and line lengths, grid proportions, image crops, section transitions, and mobile ordering. Read [layered-grid.md](references/layered-grid.md): use an 8px base grid, 24px outer radius/inset for cards, explicit safe/content areas, and at most three type sizes and weights per component. Two font families maximum; **choose fonts for the project, never a fixed house pairing**. Read [typography-selection.md](references/typography-selection.md) when selecting new type. An existing system or an explicit user override takes precedence. Use [composition-recipes.md](references/composition-recipes.md) for concrete, optional examples. A token list alone is insufficient art direction.
6. Build the semantic skeleton and responsive hierarchy first. Then make an explicit **motion and special-media opportunity pass**: identify where UI microinteractions, a shader-backed product scene, or WebGL/Three.js could improve feedback, storytelling, atmosphere, or material understanding. Read [motion.md](references/motion.md) for this pass and [shader-backed-ui.md](references/shader-backed-ui.md) when considering GPU media. Choose worthwhile moments rather than defaulting to a motionless page or adding effects everywhere. Shader backgrounds behind crisp UI are encouraged occasional ingredients, not a universal hero treatment. Record the purpose, trigger, static fallback, and mobile treatment of each selected moment.
7. Verify with [quality-gates.md](references/quality-gates.md). Save rendered desktop and mobile evidence and exercise the focal interaction. Record failures and revise before calling a page reviewed. If animation materially shapes the experience, also read [motion.md](references/motion.md).

## Calibrate the claim to the evidence

The library is under active evaluation. It is not proven better than Claude's default frontend skill. The initial Northstar example failed because its visual vocabulary was generic and its product states did not demonstrate the claim. The replacement studies and [audit record](references/audit-and-evaluation.md) document the corrective work.

For product demos, specify an input, a user action, and a visible consequence. Include disagreement, failure, uncertainty, or limits where those affect the decision. Fictional examples must identify sample data. Never add invented customer metrics to make a layout look credible.

For reference research, preserve the navigation URL including anchors, discovery source, retrieval status, visual-review status, viewport, and interaction notes. A queued clone job, fetched sitemap, or captured screenshot awaiting review is not a completed study. Use the [coverage ledger](references/studies/coverage.md); leave blocked items visible.

## Borrowable implementation examples

For reference-led SaaS work, read [direct UI reconstructions](references/studies/direct-ui-reconstruction.md) and inspect the matching `examples/reference-ui/` study before choosing a layout. These separate Cursor, Linear, Firecrawl, and ElevenLabs compositions preserve evidence density, crop boundaries, and distinct demonstration formats; they are optional original reimplementations, not vendor source or a universal template. Compare geometry and interaction states, not just palette. Do not describe a retrieved stylesheet or queued clone as a verified reconstruction.

When the task includes implementation, read [code-library.md](references/code-library.md), then inspect only the relevant files under `examples/`. The library includes a runnable vanilla HTML/CSS/JavaScript page, reusable React and Tailwind patterns, Framer Motion and GSAP interactions, WebGL/React Three Fiber shaders, and code-shaped page starters for all six archetypes.

- Treat examples as ingredients, not a required stack or visual system.
- Prefer the target repository’s framework, tokens, dependencies, and conventions.
- Start with the lowest-complexity pattern that expresses the idea; consider canvas, shaders, and Three.js deliberately when they improve explanation, identity, atmosphere, or material character. A restrained shader background can give a product scene depth without becoming the product itself. Do not add Three.js when a full-screen fragment shader alone suffices.
- Copy the behavior, then rewrite the visual language and content for the project.
- Preserve semantic HTML, keyboard behavior, reduced-motion fallbacks, and static fallbacks when adapting an example.

## Design heuristics to adapt

- Give each page one dominant idea. Repetition creates identity; unrelated tricks create noise.
- Show the product, object, evidence, or thesis in the first viewport. A generic gradient is not product proof.
- Use composition before decoration: scale, placement, crop, rhythm, contrast, and whitespace do more work than shadows or effects.
- For Adam's projects, keep UI cards, screenshots, documents, and notification panels straight and aligned to the grid. Do not add decorative rotation, skew, or perspective tilt—including on hover or during state transitions—unless he explicitly requests it. Create depth with crop, scale, layering and spacing instead. Older tilted examples are not a precedent to repeat.
- Make the hero specific. Pair a sharp claim with a concrete visual or interaction that proves it.
- Treat the hero as a unique brand moment: derive its visual idea, composition, copy and motion from this brand's particular story. Do not default to the same headline-plus-dashboard arrangement, serif accent, or abstract gradient. Product proof can follow the hero when that gives the identity room to establish itself. A new effect or palette alone is not a rebrand; assess whether the idea can extend coherently beyond the opening.
- Alternate proof modes down the page: demonstration → metric → customer → mechanism → action. Avoid ten identical feature cards.
- Match density to risk. Developer pages may be information-dense; luxury products need space; regulated products need calm clarity; experimental sites need a stable navigational spine.
- Use accent color as syntax: action, state, category, or narrative emphasis. Do not sprinkle it randomly.
- Make typography carry hierarchy. Use no more type styles than the content model needs, and keep line lengths intentional.
  For Adam's projects, the current preference is a maximum of two loaded font families unless he explicitly overrides it. This is a project preference, not a universal design law.
- Let the interface explain itself. Product visuals need legible states, realistic data, and a clear focal task—not decorative dashboard confetti.
- Choose interface icons from the full [26-set catalog](references/iconography.md): all 25 sets Adam supplied plus IBM Carbon. There is no default icon family; select by the project's art direction, required glyphs, stack, and verified license. Keep one coherent family and sizing/weight system per interface, respect existing design systems, and avoid improvised Unicode/emoji UI substitutes. Radix in the examples is just one implementation, not a prescribed choice. Icons support the UI; they do not replace product evidence.
- Mobile is a recomposition. Preserve the concept while changing crop, order, density, and interaction; do not merely stack desktop columns.
- Respect `prefers-reduced-motion`; never gate meaning behind hover, scroll choreography, or a canvas effect.
- Do not reproduce unrelated reference copy, trademarks, imagery, proprietary UI, or a recognizable page wholesale. Abstract the principle and create original work. For a user-requested redesign of an existing brand, preserve its identity and product UI when that is the chosen mode; distinguish a concept from an official site and verify asset-use terms before public distribution.

## Avoid the “AI website” default

Reject these unless the brief genuinely calls for them:

- centered headline + purple glow + three equal cards + logo strip;
- every section inside a rounded rectangle;
- icons used where a concrete product state or photograph would be stronger;
- arbitrary glassmorphism, blurred blobs, or floating pills;
- huge type with no relationship to the product’s tone;
- motion on every element instead of one choreographed system;
- copied dark-mode developer aesthetics for non-technical audiences;
- long pages that repeat claims without increasing evidence.

When a result still feels generic, do not add polish first. Revisit the concept sentence, evidence choice, section order, and dominant visual idea.
