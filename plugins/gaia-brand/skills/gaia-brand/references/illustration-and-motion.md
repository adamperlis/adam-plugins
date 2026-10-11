# Illustration and motion

## The hand

Reuse approved drawings before generating new ones. The line is a confident imperfect fineliner, not a rough pencil sketch, polished geometric icon, brushstroke, 3D mascot, or shaded cartoon. Simple organic/geometric shapes, generous empty space, asymmetric body plans, tiny dot eyes, and few facial marks make the family recognizable.

One small flat warm-yellow spot belongs to an accessory, hat, toy, bow, or natural animal beak. Never flood a human face, blanket, or whole costume yellow. No grey shading, texture, cross-hatching, extra color palette, captions, signature, or watermark. Faces are friendly; keep noses compact, especially babies and the corrected standing mother. Do not reproduce an oversized adult nose from an older generation prompt.

For new drawings use the bundled set as a visual reference. Approximate visible line weight is about 1.08% of figure height; it is geometry, not a heavy decorative stroke. Preserve different silhouettes so a sheet does not become the same character wearing twelve costumes. Put each isolated drawing on a clean, separable field; asset transparency is for final output, not a requirement to change the native card fill.

New-art prompt scaffold:

> Draw [subject] in Gaia's existing fineliner hand, matching the provided Gaia assets. Simple uneven organic shapes, confident slightly irregular black line, plenty of open space, friendly minimalist face with visible dot eyes and a compact nose. One small #FEE951 accent on [accessory]. No shading, gradients, texture, lettering, watermark, realistic anatomy, or additional colors. Keep the figure isolated and fully visible.

Treat generated art as a draft until visually reviewed; brand instructions are not a provenance or copyright clearance guarantee. Do not copy a third-party illustrator's character or signature.

## Rendering contract

The bundled illustrations are traced **filled shapes**, not SVG strokes. Paint the accent group first and ink above it. Do not add `stroke-width`, outline the traced ribbons again, close paths by hand, or redraw them to “clean up” the wobble. Tight viewBoxes preserve each drawing's aspect ratio; a stable square layout slot can align different drawings without distorting them.

Light: primary ink #1D1D1B, accent #FEE951. Dark: primary ink #F2F2ED, same accent. The bundled render helper recolors the role groups. A standalone SVG loaded through `<img>` does not inherit CSS variables from its parent: generate a dark version or inline it when theme adaptation is required.

Activity mapping: feeding → bottle; sleep → moon; diaper → diaper; pumping → pump; tummy time → tummy; growth → sprout; health → thermometer; milestones → star. The larger cast is for compositions, empty states, onboarding, and special moments, not for loading every character into every screen.

The app icon has a dense drawing collage and custom wordmark on warm yellow, with dedicated dark/tinted masters. Do not stretch a single activity illustration into an icon substitute. Use the included master for Gaia's actual app identity.

## Motion language

Native duration roles: instant 90ms, fast 150ms, normal 220ms, slow 320ms, deliberate 480ms. Usual enter curve `(0.16, 1, 0.3, 1)`; exit `(0.7, 0, 0.84, 0)`; settle `(0.22, 1, 0.36, 1)`. Detailed configs are in the token snapshot.

For expressive characters, “prefer transform” means transforms on articulated groups with joint-correct origins—not one transform on the whole SVG. The root carries weight; the action-driving part and at least one follower are keyed independently. Apply the character articulation gate in [Gaia animation principles](animation-principles.md).

- Touch-following motion is interruptible physics; discrete number/icon/error changes use the named timed transitions. Sheets may use the dedicated sheet spring with their contents following slightly behind. Do not give every tap a bouncy celebration.
- Press scales: small controls 0.94, standard buttons 0.97, large cards 0.985. Preserve layout dimensions.
- Drawn selected-nav ring is a deliberate 620ms pen gesture, not a spinner.
- Chart entrance: fade 280ms, reference rise 520ms, data-line draw 760ms, points land as the line reaches them. Bars do not overshoot because their height is a value; a momentarily exaggerated bar shows false data.
- Celebrate a child's new month/birthday with a short, expressive character moment and light confetti when that feature is requested. Dismissal stops it; do not replay every visit or interrupt logging. Animate anticipation, tilt, squash/stretch sparingly rather than making an unrelated character bounce forever.
- In Reanimated use shared-value `.get()`/`.set()` in the Gaia codebase. Prefer transform and opacity; do not animate native filter/blur or the screen's ground gradient.
- Reduced motion keeps meaning, removes travel/overshoot/stagger, and makes feedback near-instant (90ms). No physics explosion or confetti spray is necessary to convey a successful save or birthday.

For the website's broader playfulness and performance limits, use the web guide. The product is quieter than the marketing hero.
