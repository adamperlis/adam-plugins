---
name: gaia-brand
description: Design, build, write, or review Gaia Baby Tracker app interfaces, websites, illustrations, motion, and marketing using its actual brand system. Use for Gaia-branded work or an explicitly requested study of Gaia's design language, not unrelated apps or deployment tasks.
---

# Gaia brand

Gaia is a calm, shared baby log. The identity combines warm sage-grey surfaces, quiet typography, hand-drawn characters, and a small warm-yellow accent. It should feel useful at 4am, not like a dashboard grading a parent.

## Start here

Identify the deliverable: native UI, website, copy, illustration, or campaign. Read [foundations](references/foundations.md) and only the relevant guides below. Use the bundled artwork and tokens rather than recreating the logo, approximating the palette, or substituting generic baby icons.

| Work | Read |
| --- | --- |
| Native screens, forms, navigation, charts | [App UI](references/app-ui.md) |
| Websites, landing pages, social, store assets | [Web and marketing](references/web-and-marketing.md) |
| Drawings and icon compositions | [Illustration and motion](references/illustration-and-motion.md) |
| Animated social/campaign assets, expressive character motion, loops, brand video | [Illustration and motion](references/illustration-and-motion.md) and [Gaia animation principles](references/animation-principles.md) |
| Headlines, microcopy, onboarding, localization | [Voice](references/voice.md) |
| Asset origin, reuse rights, source refresh | [Provenance](references/provenance.md) and [license](LICENSE.md) |

## Identity that must survive

- Figtree 400/500 for display and large figures; Inter 400/500 for body, labels, and running timers. Do not synthesize bold or introduce a third face.
- Light-mode cards are darker than the ground; inset wells are lighter than the cards. Dark mode has its own roles, not an inversion.
- Yellow decorates drawings and selection marks. Evergreen identifies primary actions in light mode. Never use a yellow wash as the default chart panel or yellow body text on a light background.
- Activities share one palette and differ through their drawing and label. Functional chrome stays clean and conventional.
- The native grid uses 16pt gutters, 24pt card padding and radius, 16pt card gaps, and 32pt group gaps. Pills remain pills.
- The hand-drawn wordmark is an asset, not the word “Gaia” typed in Figtree. Keep its geometry and aspect ratio.
- Motion communicates touch, change, or a meaningful celebration; it cannot delay access to the log, introduce blinking, or get in the way of scrolling.
- Expressive character motion is internally articulated: independently pose the action-driving body part and a delayed follower. A whole-asset transform is supporting motion, never the performance.
- Show accurate product UI and modest, verifiable claims. Demo data is labeled synthetic. Never invent testimonials, clinical outcomes, privacy certifications, or platform availability.

## Resources

`assets/tokens.json` is a framework-neutral snapshot of the actual native themes, type roles, layout, and motion. `assets/gaia.css` maps those themes into CSS custom properties; apply native type sizes only inside app-like UI, not across an entire marketing page.

`assets/illustrations.json` contains the activity set and wider character cast. `assets/illustrations/` contains individual SVGs; `assets/manifest.json` maps names and activity roles. To recolor a drawing without changing its geometry:

```sh
node scripts/render-illustration.mjs moon --theme dark --output /tmp/gaia-moon.svg
```

`assets/brand-board.html` is a local, self-contained-in-folder visual reference, **not an app screenshot**; `assets/brand-board.svg` is its smaller static identity specimen. Icons, wordmarks, and licensed font subsets are included. Relative paths resolve from this skill folder; no Gaia repository, account, network service, paid tool, or API key is required to use it.

## Handoff check

Check the actual output, not just its code: both themes, phone-width layout, long names and translations, larger text, safe areas, clear focus/touch targets, and reduced motion. For charts, verify units, uncertainty labels, true data geometry, and edge clipping. For marketing, verify the described feature and screen against the current product; this snapshot is not evidence of a future release.

Report any intentional departure from these rules. Work only on the requested deliverable: this skill does not authorize changing production, analytics, consent, App Store submissions, or public publishing.
