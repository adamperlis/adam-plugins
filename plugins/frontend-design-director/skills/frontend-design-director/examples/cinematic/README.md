# LUMA — proposed cinematic flagship

An original, fictional optical-product concept. A proposal for critique, not a finished commercial site or an optical simulation.

Run `bun run dev` from `examples/`, then open `/cinematic/index.html`. ES modules require HTTP; do not open this source page directly with `file://`.

## Borrowable ingredients

- `main.ts`: persistent Three.js assembly, lathed annular housing, instanced knurling, generated focus-scale texture, aperture blades, and an original GLSL glass treatment.
- One normalized native-scroll timeline coordinates the assembled, exploded, transmission, and reassembled views. The render loop sleeps when the pose settles and pauses in hidden tabs.
- `style.css`: Barlow Condensed / Barlow / IBM Plex Mono type system; asymmetric stage-and-caption composition; mobile rearrangement; chapter rail; reduced-motion treatment.
- `index.html`: semantic, readable chapters independent of canvas, native range control, anchor navigation, and explicit motion toggle.

The reference lesson borrowed from Prism and Pear is continuity: one visual subject carries a narrative across scroll chapters. Their proprietary source, fonts, assets, models, and shaders are not included. This is not an implementation of their complete production systems. No Astro, Sanity, View Transition API, film-sequence compositor, or physically accurate optical renderer is claimed here.

Original code inherits the repository MIT license. Font licenses are included in `fonts/`.

## Status

Prototype built and visually checked at 1280 × 720 and 390 × 844. Native keyboard aperture control, chapter anchors, and the motion toggle checked in-browser. TypeScript and production build checked. Still needs broader device/GPU and accessibility testing before production use.
