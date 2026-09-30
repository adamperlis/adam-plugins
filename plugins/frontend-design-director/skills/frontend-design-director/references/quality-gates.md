# Quality gates

Use these to decide whether the work is ready, not to certify it by assertion. Visual recipes remain optional. Correctness, honest evidence, and the user's constraints are required.

## Evidence needed for a reviewed implementation

Save a short review record beside the project, with links to:

- the chosen concept and rejected alternative, with a reason grounded in the product;
- the confirmed existing-UI versus from-scratch choice (including whether product screens are preserved);
- selected UI microinteractions and any special-media opportunities, with purpose and fallback—not merely a list of animation libraries;
- desktop and narrow-mobile rendered screenshots (record actual viewport sizes);
- the first viewport, a middle transition, and the focal interaction's changed state;
- keyboard, reduced-motion, and JavaScript-disabled results where applicable;
- build/typecheck output for the code that is actually shipped;
- known gaps, unverified claims, and the revision made after reviewing the render.

A static browser capture does not prove animation, responsive behavior, or an interactive state. A compile check does not prove visual quality. Report these independently. If the browser is unavailable, mark visual review pending and do not call the output visually verified.

## Reject and revise when

- A product's promise is represented only by unrelated shapes, a fake metric, or a decorative dashboard.
- Repeated dashboard crops add no new evidence, or a mixed grid has no content-based hierarchy.
- A fade masks the decisive detail, or clipping hides a focusable control. Keep art crops separate from uncropped working interfaces.
- Every archetype has the same hierarchy, proof format, and interaction with a different color.
- A heading changes but the dominant layout remains a familiar unexamined template.
- A sample action does nothing, points to a dead endpoint, or pretends to submit real data.
- A claimed reference study has no destination URL and evidence of inspection.
- JavaScript failure hides important content, focus disappears, labels collide, or mobile overflows.

Choose the highest-impact failure, revise its structure or behavior, and recapture the affected states. Do not add an effect to compensate for a weak product explanation. Stop iterating once the brief and checks are satisfied; taste disagreements belong in the review record.

## Comparative evaluation

Claims such as “better than the default skill” require a matched evaluation. See [audit-and-evaluation.md](audit-and-evaluation.md). Until then, describe capabilities and observed improvements, not an unmeasured ranking.

## Concept

- Can the visual and verbal concept be stated in one sentence?
- Does the first viewport show what is sold and why it matters?
- Is the page recognizable without relying on the logo?

## Structure

- Does every section add a new proof or decision?
- Does evidence become more specific as the page progresses?
- Are homepage, product, solution, pricing, customer, and editorial pages doing distinct jobs?

## Visual system

- Verify the layered grid, actual safe insets, nested radii and component type budgets per [layered-grid.md](layered-grid.md); document deliberate deviations.
- Are type, spacing, color, radius, border, and media rules consistent?
- Is there one dominant visual idea rather than several unrelated effects?
- Are product screenshots or photographs art-directed and legible?
- Does each UI scene substantiate its adjacent claim, with a clear focal detail and intentional crop? Are fictional illustrations distinguished from real captures?
- Are repeated cards genuinely the right structure?

## Interaction

- Are states complete: hover, focus, active, loading, success, error, disabled, empty?
- Does motion have a named purpose and reduced-motion fallback?
- Are controls reachable and understandable by keyboard and touch?
- Does an interaction update related scenes consistently, including invalidating stale decisions when their inputs change?

## Responsive

- Does mobile preserve priority while changing composition?
- Do nav, tables, code, diagrams, media, and sticky elements work at narrow widths?
- Are tap targets, line lengths, and spacing comfortable?
- Does mobile preserve the intended art direction through a new crop or grouping, rather than merely expanding or shrinking every desktop panel?

## Accessibility and performance

- Semantic landmarks and heading order are valid.
- Text and controls meet contrast expectations.
- Images have useful alternatives; decorative media is ignored appropriately.
- Hero media does not destroy LCP; layout is stable; non-critical effects are deferred.

## Originality

- Is all copy original?
- Are borrowed ideas abstracted rather than copied?
- Would removing brand colors still leave an original composition?
