# LUMA directed — implementation review

This is the rebuild governed by our **Frontend Design Director** skill, not the classic frontend-design skill. [Direction and rejected alternative](DIRECTION.md). The original LUMA remains at `../cinematic/` for comparison. The unfinished Cadence SaaS draft is separate in `../saas/` and has not received this visual review.

## Implementation

Original HTML/CSS/TypeScript; Three.js 0.180 in the existing Vite project. Three type families: Bodoni Moda (product designation/editorial), Archivo (body/interface), DM Mono (specimen notation). Original lathed geometry, instanced knurling, generated engraving and glass shader. The prior lens-construction idea is reused, but the page structure, typography, materials, story, renderer/stage coordination, and product interactions are rebuilt.

Run `bun run dev --port 5173 --strictPort` from `examples/`, then visit `/luma-directed/index.html`. `/luma-directed/index.html?view=static` selects authored SVG diagrams without WebGL. Opening the source directly with `file://` is not supported because it imports ES modules.

## Checks performed

- TypeScript and full Vite production build passed. Existing lab dependency warnings about ignored `use client` directives and a large Three.js chunk remain; this is not a performance certification.
- Desktop inspected at 1280 × 720; phone inspected at 390 × 844. No horizontal overflow in the checked phone states.
- Construction navigation and component selection checked. Aperture control operated with the keyboard; End produced `ƒ / 8.0`.
- Native finish radios operated with ArrowRight through Carbon → Alloy → Oxide. Selected specification and specimen dialog correctly reported Oxide.
- Specimen dialog opened and closed with Escape.
- Motion toggle checked: pressed state changes to true and label becomes “Enable motion.” This tests the page toggle, not OS-level reduced-motion emulation.
- Static fallback route checked: the SVG diagram is displayed and the canvas is hidden. Static view hides rotation/aperture controls; finish specification remains available without implying that the generic diagram changes material.
- Browser console reported no errors in the first full-WebGL inspection.

## Revisions after rendering

Moved a hero annotation away from the oversized designation; removed that redundant annotation on mobile. Corrected the desktop opening height, increased construction-body and button type sizes, and increased mechanism scale. The home anchor now includes the header. Finish values synchronize from native form state on page show, avoiding inconsistent restored selections.

## Evidence

- [Phone opening](../previews/luma-directed-mobile.jpg)
- [Changed material: Oxide](../previews/luma-directed-oxide.jpg)
- [Desktop opening](../previews/luma-directed-desktop.jpg)
- [Construction state](../previews/luma-directed-construction.jpg)

## Honest limitations

Not production-qualified or optically accurate. No real-world dimensions, lens prescription, mount compatibility, manufacturing spec, price, inventory, order, or reservation is offered. Fine decorative metadata is intentionally small; a complete contrast/tap-target/accessibility audit remains outstanding. JavaScript-disabled rendering was implemented with fallback markup but not tested in a script-disabled browser. Context-loss recovery and BFCache lifecycle are implemented but not forced in the browser. No mid-range physical-device GPU profile or screen-reader audit was performed. The page is a design proposal, not proof that the skill outperforms a default skill.

## Image provenance

[field-study.png](field-study.png) was generated with the built-in image-generation tool and copied into this project. It is captioned as generated concept imagery, not as a photograph made with LUMA. No photographic performance claim is inferred from it.

Final prompt:

> Use case: photorealistic-natural. Asset type: full-bleed editorial image in a fictional premium camera-lens website called LUMA; not a UI screenshot. Primary request: a cinematic black-and-white photograph-like image of a quiet Mediterranean seafront concrete diving platform and a solitary distant swimmer on a late afternoon, horizon over the upper quarter, strong oblique sunlight and graphic angular shadows on concrete in the near foreground, tiny human scale, silver sea with delicate grain. Composition: wide 3:2 landscape, uncompromising editorial crop, low view across concrete toward ocean, asymmetric architectural diagonal from lower-left into middle-right, sculptural spare scene, naturally believable details. Beautiful analog tonal depth, fine film grain, expressive but restrained, rich deep blacks and luminous highlights. No text, no lettering, no camera, no lens, no logos, no watermark, no rounded border. This is original concept imagery, not a simulation of a specific lens.

Original code inherits the repository MIT license. Font licenses are included in `fonts/`. Reference-site proprietary code and assets are not redistributed.
