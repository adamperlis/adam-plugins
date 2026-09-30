# Shader-backed product scenes

Use occasionally to give a UI composition atmosphere, depth, or a subject-specific texture. Keep the software legible and interactive above a separate GPU layer. This is an ingredient library, not an instruction to turn every website into a gradient.

## Opportunity map

| Moment | Candidate | Why it may earn the cost |
|---|---|---|
| Quiet ground behind a product frame | Paper Mesh Gradient, Grain Gradient, Waves | Low-frequency light or texture separates UI from the page; tune to the brand, not a rainbow default |
| Editorial, print, research, craft | Paper Texture, Halftone, Dithering | A material vocabulary that supports the subject; keep body text and controls outside the filter |
| Creative/media product output | Water, Fluted Glass, Liquid Metal | Demonstrate a visual effect on a separate artwork; do not distort the operational UI |
| Physical product or spatial mechanism | Three.js / React Three Fiber | Real geometry, lighting, camera movement, or material changes communicate something 2D cannot |
| Scroll-based story | DOM first; canvas/Three only if needed | Preserve one object across meaningful states; no scroll hijacking or reading delays |
| Transaction/task completion | CSS or WAAPI microinteraction | Feedback belongs to the changed UI; a whole-screen shader is usually unnecessary |

## Paper Shaders

Explore [the official gallery](https://shaders.paper.design/) and the individual effect's controls before choosing. [Mesh Gradient documentation](https://shaders.paper.design/mesh-gradient) documents colors, distortion, grain, speed, frame, and pixel budget. React package: `@paper-design/shaders-react`; vanilla runtime: `@paper-design/shaders`. Paper is not Three.js; do not claim a Three scene just because it uses WebGL.

Verified 2026-09-30: installed versions **0.0.81**, package manifests and bundled LICENSE identify **Apache-2.0**. Preserve the accompanying LICENSE and NOTICE. Earlier releases used different terms: do not assume all historical versions or unrelated gallery assets have the same license. Pin the chosen version and recheck on upgrade. Official [repository](https://github.com/paper-design/shaders) and [license](https://github.com/paper-design/shaders/blob/main/LICENSE). No claim that all shader sites are free or unrestricted.

## Layer contract

```css
.product-stage { position: relative; isolation: isolate; overflow: hidden; background: #edb689; }
.shader-background { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.product-ui { position: relative; z-index: 1; } /* native, crisp, selectable DOM */
```

Keep a static CSS background underneath; it is also the no-JS, unsupported-GPU, reduced-motion, and context-loss treatment. Scope `overflow:hidden` to the illustration boundary, not focusable controls or popovers. Crop UI only when the focal evidence remains visible. Do not flatten the UI into a canvas screenshot to apply a shader.

## Borrowable runtime

See [paper-background.ts](../examples/webgl/paper-background.ts) for a guarded, lazy-imported vanilla mount used behind the Harvest concept's product stage. It catches import/initialization failure, opts out on reduced motion, pauses via a visible control, uses a bounded pixel budget, removes the canvas after context loss, and disposes its listeners/resources. The installed runtime implements offscreen and document-hidden pausing; do not assume that about other packages.

React is also eligible: the official `MeshGradient` component supports `speed={0}` for a static frame and `maxPixelCount`/`minPixelRatio`. In a React app, wrap lifecycle, error handling, pause preference, and context loss at the scene boundary; do not treat a minimal docs snippet as a complete production wrapper.

## Design and performance check

Name the scene's job, UI focal point, chosen shader parameters, and why a CSS treatment was insufficient. Lower saturation, spatial frequency, and motion before reducing UI contrast. For a subtle background, a low-resolution raster stretched under opaque UI may be enough. Start with one active GPU scene; profile before adding more. Slow speed is not a lower frame rate—pause/offscreen behavior and pixel budget matter.

Under reduced motion, prefer the CSS fallback or one static frame. Continuous nonessential motion needs an accessible pause. Keep paused preference stable through tab changes. On mobile, simplify or remove the shader if it harms input responsiveness, legibility, battery, or thermals. A desktop screenshot does not establish phone GPU performance.

Test: rendered shader, fallback, pause/resume, reduced motion, context failure, offscreen return, and legibility with the actual UI. Record unverified paths honestly. Never claim all those paths are tested because the guards exist in code.

## Visibility is part of the composition

If a shader is selected as a brand moment, give it enough exposed area and contrast to register. A canvas hidden almost entirely behind opaque UI does not establish a visual identity. Review the rendered result, not just whether a canvas mounted. Conversely, don't increase intensity behind body text to compensate for a poorly positioned scene.

Harvest's revised `examples/dayform/workday.frag` is an original 48-strand illustration, grouped 24/16/8 to connect with a clearly labeled fictional project. It uses Paper's runtime, **not a Paper gallery preset or Three.js**. The exposed hero scene replaces the earlier mostly obscured Mesh Gradient. This is a candidate brand direction, not evidence of a completed rebrand or measured uniqueness.
