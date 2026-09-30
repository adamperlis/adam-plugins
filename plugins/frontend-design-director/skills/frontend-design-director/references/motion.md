# Motion and interaction

Motion needs a job: orient, explain, focus, confirm, or express the concept.

## Make an opportunity pass, not just a hover pass

Actively look for useful animation in the product UI itself: a tab indicator follows selection, a timer changes into a running state, a row joins a reviewed group, a budget bar reflects a changed input, an invoice moves from draft to confirmed, or a popover emerges from its trigger. Choose moments that reveal cause and consequence. Changing a button color is not a complete product story; looping a fake cursor is not a functioning demo.

For each selected interaction, record trigger → visible change → settled state. Keep real data/state authoritative; animation should not simulate success before an action completes. Keep interruption and reversal coherent. Use concise feedback (often 120–250ms, tuned to distance); a longer explanatory sequence may be appropriate for an infrequent marketing demo. Do not delay keyboard navigation or focus changes to finish a transition.

Consider a selective shader-backed UI scene, WebGL material, or Three.js spatial moment in the same pass. Atmosphere can be a valid purpose when it supports a specific visual identity. See [shader-backed-ui.md](shader-backed-ui.md), including Paper Shaders. This is not a requirement to use every technology in every project.

Prefer CSS transitions for reversible color/transform states; WAAPI for a short programmatic sequence; Motion/GSAP when choreography needs it. No `transition: all`. Gate decorative hover movement to hover-capable fine pointers; supply equivalent press/focus feedback. Keep control hit areas stable, respect reduced motion, and do not hide page content until a scroll observer fires.

## Choose a motion character

- Product-led: crisp state transitions, direct manipulation, short sequencing.
- Developer: instrument-like, precise, data or terminal progression.
- Fintech: calm, controlled, reassuring; avoid playful overshoot on serious actions.
- Commerce: tactile material response, careful image transitions, optional product rotation.
- Research: explanatory layers, reveal of systems or relationships.
- Experimental: one signature spatial or typographic behavior supported by quiet utility motion.

## Rules

- Establish still composition first.
- Prefer transform and opacity; reserve expensive effects for one focal region.
- Scroll animation should explain sequence or depth, not merely delay reading.
- Autoplay media needs pause controls when long or distracting.
- Hover cannot be the only way to access content.
- Preserve focus order and visible focus states through animated layouts.
- Under reduced motion, replace travel/parallax with direct state changes and keep all information available.
- Test on a mid-range mobile device; animation that drops input responsiveness is a defect.
