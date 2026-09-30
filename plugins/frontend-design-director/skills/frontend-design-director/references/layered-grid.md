# Layered grids and component hierarchy

Adam's requested default, added 2026-09-30. Use when defining a new system; preserve an established system when the intake choice calls for it. These constraints govern geometry and hierarchy, not the composition of every page.

## Four layers, in order

1. **Base grid:** 8px spacing unit. Use 8, 16, 24, 32, 40, 48, 64, 80, 96 for layout gaps, margins and padding. A deliberate 4px half-step is allowed only when the full step causes a demonstrated fit problem. One-pixel rules, library-designed 15px glyphs, fractional grid tracks, intrinsic image proportions, font sizes, and optical letterspacing are not spacing violations.
2. **Safe space and content:** 24px default card radius and internal safe inset. Show the safe rectangle separately from the content area. Group related label/control pairs more tightly than unrelated groups. Avoid accidentally doubling padding across nested wrappers. Use 24px as the outer card inset, not the padding of every child.
3. **Anatomy:** lay out headline, supporting text, media slot and controls before applying decoration. A media slot needs a focal point, crop boundary, and mobile alternative. Unequal grid spans should express importance. Keep controls outside faded or clipped illustration layers.
4. **Type:** declare the actual sizes and weights per component. Two families maximum across the page. **At most three distinct sizes and three weights per component**, not a universal three-size cap for the whole site. Do not subdivide every label into a fictitious “component” to evade the budget. A feature cell including its illustration is a useful audit boundary; so is a complete timesheet panel.

Choose families for the project; no named font or pairing is the default. See [typography-selection.md](typography-selection.md) for candidate selection. For cross-platform delivery, explicitly name any substitute and use a licensed distribution. A fallback stack is not permission to load additional design families.

## Nesting and examples

Outer 24px radius with 8px inset → inner 16px radius. Outer 24 with 24px inset → inner square corners. Do not give every nested surface identical 24px rounding. Derived corners are allowed even when zero; content safe area and media frame inset may differ if documented.

Example type budgets, not universal sizes:
- Editorial hero: 12px label, 16px explanation/action, 64px display; 400/500/600.
- Feature cell including its UI illustration: 12px metadata, 16px content, 24px heading/key figure; 400/500/600.
- Timesheet panel: 12px labels, 16px entries/totals, 24px title; 400/500/600.
- Mobile: recompose and select a smaller display size, e.g. 40px. Do not shrink operational text into 8px labels just to preserve desktop density.

## Verification

Inspect rendered padding, radii and computed typography. Measure visible text nodes at declared component boundaries; count sizes and weights, including metadata and buttons. Check a narrow viewport for overflow and crowded controls. A debugging overlay may expose an 8px grid and 24px safe areas, but it is not proof of compliance by itself. Record actual values and exceptions alongside screenshots. Keep this overlay out of the normal visitor experience.

Harvest's `examples/dayform/grid-system.css` and `?inspect=1` preview show this approach. Do not copy its identity onto the next brand.
