# Cadence, rebuilt — UI as the story

Governing skill: this repository's Frontend Design Director. The classic frontend-design skill was not used. This revision responds to the user's criticism that the earlier SaaS example did not use the references' real/abstracted UI slots convincingly. The earlier implementation is preserved in the local `work/cadence-before-rebuild/` directory; LUMA is unchanged.

## Concept and proof burden

This site should feel like a connected release room because the audience needs to see how one changed date affects the work around it—not merely hear that teams stay aligned.

Primary archetype: product-led SaaS. Audience: cross-functional software release leads. Product premise: keep sources, dependencies, and decisions attached to one release. Conversion: explore the local example. All software, people, prices, and work records are fictional; these are original HTML/CSS UI compositions, not captures from a real Cadence application.

## Compositions considered

1. **Selected: a product sequence with four different evidence slots.** Start with a cropped working schedule and a change control. Follow with two linked UI fragments, a wide dark handoff canvas, and a focused approval card. Each slot proves a different part of the same story.
2. **Rejected: a continuously pinned full-screen launch timeline.** It could give a strong scrolling signature but would repeat the earlier all-purpose dashboard, make the source context secondary, and impose a long scroll interaction on phone users.

## Sequence

Latest composition revision: lead with a static, deliberately oversized product composition; put the working schedule behind an explicit “Try the working release room” disclosure. Follow with an asymmetric three-cell grid (one dominant context scene, two supporting timeline/decision crops). Keep the handoff and approval sections as changes in density. On mobile, reframe the artwork rather than shrinking an entire desktop application; keep copy and controls outside the clipping regions. These are optional layout ingredients, not a mandatory SaaS template.

Promise → simulate an engineering delay → inspect its downstream dates → source/task context → handoff/next action → explicit release decision → illustrative pricing → return to demo.

The hero has two separate actions: preview the delay, then apply the revised dates. A proposed change cannot be approved. Applying a new plan invalidates earlier reviews. Release approval is separate from readiness, and a local change log keeps the decisions inspectable. October 8 moves to October 12 because the example uses business days and skips the weekend.

## Reference-to-implementation map

| Studied reference | Evidence used | Original adaptation |
|---|---|---|
| Firecrawl homepage | Task input near the promise; instrument-like operation/result emphasis | The change console triggers a visible date transformation; the revised plan requires confirmation |
| Cursor homepage | Restrained surrounding chrome; substantial legible product surface | A cropped release workspace supplies detail, rather than decorative charts or oversized empty framing |
| ElevenLabs homepage | Consistent selector shell with different representative content | Source buttons switch the document, highlighted decision, linked task, and owner as one UI slot |
| Linear homepage | Different work objects across connected workflow chapters | The same Orbit release continues through schedule, handoff, and approval |

These are structural adaptations from [measured studies](../../references/studies/visual-studies.md), not extracted proprietary components. The [coverage ledger](../../references/studies/coverage.md) still records incomplete navigation, motion, and mobile research. This rebuild does not change that research status.

## Art direction

- 1240px maximum page measure, 48px desktop gutters at 1280px, 76px masthead.
- Desktop opening: roughly 62/38 text split; 43–58px headline, 18px supporting proposition, 14px body. Opening spacing reduced after screenshot review to reveal more product earlier.
- Warm near-white, mineral-green stages, deep forest handoff chapter. Cobalt is reserved for the focal action, state, and focus. Fine borders and restrained corner radii tie the original UI fragments together.
- Exactly two loaded families: Bricolage Grotesque for propositions and DM Sans for body/UI. Contrast comes from scale, weight, density, composition, and background—not a third font.
- The source document is slightly rotated; its associated issue is offset beneath it. This creates a relationship and a deliberate crop, not a random floating-card collage.
- The handoff chapter is a wide stepped route with an inspectable detail panel; the final approval is an isolated product crop. Neither is another dashboard screenshot.

## Motion and responsive behavior

Date bars move only after the user simulates a change. Source and handoff transitions are short, finite state changes. Native scroll draws the routing line without intercepting scrolling, hiding content, or overwriting manual selection. Reduced motion removes travel and shows the complete route.

Below 580px the timeline becomes dated workstream cards; no sideways reading is required. Source controls move above the artifact. Handoff nodes become three large selection targets above the detail. The release card retains the same meaningful checkboxes and explicit action.

The default static document contains the initial schedule, source context, handoff, and release state. A no-script notice explains that the simulation needs JavaScript. No continuous autoplay, WebGL dependency, external API, or fake backend is present. Spatial rendering did not earn a role in this particular workflow; the separate LUMA and lab examples retain those techniques.

See [REVIEW.md](REVIEW.md) for actual verification and remaining limits.
