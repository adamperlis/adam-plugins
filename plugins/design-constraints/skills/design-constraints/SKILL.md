---
name: design-constraints
description: Design UI by handing the model explicit spatial and typographic constraints instead of letting it guess. Use whenever building or restyling any interface — a component, a page, an app, a design system — and whenever the user says the output "looks AI-generated", "looks generic", "doesn't feel designed", or asks to match a reference. Triggers include "restyle", "make this look better", "design a component", "build a UI", "clean up the spacing", "pick fonts", "set up design tokens", or any request where visual quality is the point rather than a side effect. Also use when reviewing an interface for visual defects.
---

# Design by constraint

A model asked to invent a UI from nothing produces the average of everything it
has seen. That average has a look — evenly rounded cards, four font weights, a
gradient hero, padding that varies by ten pixels between siblings — and people
now recognise it on sight.

The fix is not better taste in the prompt. It is **removing the decisions**. Lock
the grid, the radii, the padding and the type to a small set of legal values, and
the model stops guessing about spacing and starts working on the actual problem.

This skill is that set of constraints, plus the failure modes that show up when
you apply them for real.

## The constraints

Adopt these verbatim unless the project already has a system. If it does, the
project's system wins — read its tokens file first and apply what is there.

### Spatial

```
Base grid          8px. Every margin, padding, gap and size is a multiple.
Outer padding      24px on panels and cards.
Outer radius       24px on panels and cards.
Half-step          4px, legal ONLY where 8 overflows. Not a general escape hatch.
```

Three numbers do most of the work: `8`, `24`, and the derived inner radius below.

### Concentric radii

The one rule that separates "designed" from "nearly right":

```
inner radius = outer radius − inset
```

A 24px card with 24px of padding holds a 0px child — which means a card that
holds a rounded thing needs a *smaller* inset. In practice: **24px outer, 8px
inset, 16px inner.**

Give a child the same radius as its parent and it reads as a sticker laid on top.
Give it a larger one and the corners visibly fatten at the arc. Neither looks
like a mistake you can name, which is why it goes unfixed.

### Typography

```
Families           2 maximum. One sans for everything, one accent (serif or mono).
Weights            2-3 maximum, per component.
Sizes              2-3 maximum, per component.
```

The weight limit matters most. Models overindex on weight to signal hierarchy and
end up with 400/500/600/700 on one card, which reads as noise rather than
structure. Hierarchy comes from **size and colour first**, weight last.

**Mono is a material, not a font.** It belongs on things that are machine-read or
column-aligned: timecodes, readouts, numeric fields, key hints, IDs. Put it on a
tooltip or a button label and the control reads as a code sample. If you cannot
say what makes the text machine-like, use the sans.

### Colour

One accent. Spend it on the single most important action per view and keep
everything around it neutral. Semantic colours (success/warning/danger) are a
separate axis and do not count as the accent.

Pick neutrals deliberately — a pure mid-grey reads as unconsidered; a grey biased
a few degrees toward the accent reads as chosen.

## The process

Constraints are necessary and not sufficient. The rest is method.

### 1. Start from real references, not from a description

Collect 2-4 interfaces that already do what you want. Name what specifically is
being borrowed — "the way libraries.dev nests a recessed media area inside a card
frame", not "clean and modern". A reference you cannot describe in one concrete
sentence is a mood, and a mood does not transfer.

Measure the references rather than eyeballing them. Pull the actual hex values,
the actual radii, the actual type scale. **Approximating a palette is how you get
something that looks like the reference in a screenshot and wrong in use.**

### 2. Go component by component, not screen by screen

Build one component. Look at it. Fix it. Then the next.

A whole screen generated at once gives you twenty decisions to review
simultaneously, so you review none of them and accept the lot. One component at a
time is what makes the iteration real.

### 3. State the change as a constraint, not as a feeling

Feedback that moves the work:

- "The inner radius should be 16, not 24 — it has to nest inside the 24px frame."
- "Halve the grid padding; 24 is doing the work of 12 here."
- "That should be sans. Mono at tooltip size reads as code."

Feedback that does not:

- "Make it cleaner."
- "This feels off."
- "More polish."

If you catch yourself writing the second kind, find the number behind it.

### 4. Hand-select imagery

Art direction does not survive being delegated. Pick the images, the icon set and
the illustrative style explicitly, or the model will reach for the stock-photo
average.

## Failure modes

These recur. Check for them before declaring a component done.

**Nested padding.** A wrapper and its body each carry `padding: 24px` and they
nest — so the content sits 48px in and every sibling is misaligned. Search for a
container whose only child is another container; one of them should have no
inset. This is the single most common spacing defect.

**Grid overflow at the edge.** An 8px gutter overflows a track that has 4px to
spare, so the last column clips. The half-step exists for exactly this. Use it
there and nowhere else.

**Dead tokens.** Tokens defined but never resolving — a colour wrapped in the
wrong function, a var that was renamed in one file. Every utility silently falls
back and the palette is decorative. **Verify a token actually renders before
building on it**; a design system that compiles is not a design system that
applies.

**Borders at rest.** A hover treatment written as a border, left on permanently
because the rule sat one selector too high. Every control looks selected. If
everything has an outline, nothing reads as focused.

**Partial hover states.** An animated ring that shows only the travelling arc
gives motion but not location — the viewer sees something happening and cannot
tell which control they are on. A hover state's job is to identify the target, so
the complete outline must be present; the animation rides on top of it.

**Effects that swallow their content.** A bezel, gloss or glass treatment
composites over what is inside it. On a pill with a label that reads as material;
on a 16px glyph it eats the glyph. Size-gate the treatment: **a face gets the
effect, an icon gets the CSS approximation.**

**Theme defined in one branch only.** A colour whose sole definition lives inside
a dark-mode media query or a `[data-theme]` block does not exist in the default
state. Define every token on bare `:root` first, then redefine in each branch.

**The animation that never ran.** Canvas and WebGL effects driven by
`requestAnimationFrame` are suspended in a backgrounded tab. An effect inspected
through automation, in a tab that is not frontmost, renders nothing and looks
exactly like a broken shader. Confirm the tab is visible before concluding an
effect is broken.

## Checklist

Before calling an interface done:

- [ ] Every spacing value is a multiple of 8 — or a deliberate 4 where 8 overflowed
- [ ] Nested corners satisfy `inner = outer − inset`
- [ ] No container nests its own padding inside another's
- [ ] At most 2 families, 3 weights, 3 sizes per component
- [ ] Mono only on machine-read text
- [ ] One accent, spent once per view
- [ ] Controls carry no border at rest unless they are genuinely selected
- [ ] Hover identifies the target, not just that something is happening
- [ ] Both themes defined from bare `:root`
- [ ] Tokens verified to render, not merely to exist

## Credit

The framing — explicit constraints over model guesswork, iterating component by
component — follows Marvin Schwaibold's account of the approach. The specific
values, failure modes and checklist here come from applying it.
