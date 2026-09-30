# Composition recipes

These are original implementation decisions with concrete values, not extracted source code or universal style rules. Choose a recipe because it serves the content. Preserve a client's established identity.

## Evidence workspace — Northstar

**Intent:** make a difficult choice inspectable. A neutral paper canvas and editorial display face support reading; restrained green and clay distinguish support from dissent.

At desktop, use a 1320px maximum content width, 48px minimum side margins, a 104px masthead, and a two-line typographic opening. Pair Manrope at fluid 78–150px with Instrument Serif italic at 1.15 times the surrounding headline. Tracking is negative only on display text; small labels use positive tracking. The hero's coordinate drawing is subordinate to the claim. A full-width clay strip changes the rhythm before the working example.

The workspace has two content columns separated by a 72px connection lane. Source notes occupy the left; an explanation, implication, source, and limitation occupy the right. The diagram connects actual notes. Selecting contrary evidence narrows the proposed audience. This is the focal interaction; no WebGL is required.

At 650px, remove the connector lane and put the explanation after the ordered notes. Selecting a note moves focus to the explanation. With JavaScript disabled, show every explanation and keep normal anchor navigation. Keep navigation links available at every width.

**Borrow:** `examples/vanilla/`. **Change first:** scenario, evidence, consequence, type voice. **Avoid:** preserving the serif/clay palette for every SaaS brief.

## Object merchandising — Lilt

**Intent:** understand and desire one physical object. The first panel is a large isolated lamp illustration; the adjoining panel has name, price, finish, and sample purchase action. A 1.15:1 desktop split gives the object slightly more space. Deep blue is the object stage; warm paper is the information surface. Product identity comes from silhouette and material treatment rather than software chrome.

The SVG layers are shadow → stem → base → shade → light opening → cable. A gradient gives the shade a directional highlight; it is a material cue, not background decoration. Native radio inputs change the visible finish and accessible image title. Keep price and delivery terms adjacent to the action.

Below the fold, pair a material close-up with a specification list, then use native disclosure elements for care and returns. Mobile shows the object first, then the complete purchase block; no sticky overlay competes with the selector.

**Borrow:** `examples/commerce/`. **Change first:** replace the illustration with verified photography, specifications, availability, taxes, and seller terms. **Avoid:** presenting this fictional concept as a real product or checkout.

## Technical instrument — Relay

**Intent:** help a developer inspect a request and understand failure recovery. A bounded page grid and dot field establish the instrument metaphor. Orange belongs to routing emphasis and actions. A three-step rail introduces receive → route → deliver. The dense dark request/response region is an intentional contrast with the spacious introduction.

Request and response columns are equally weighted and independently scrollable. A native select changes the destination condition; a button runs a local fixture. Success, rate limiting, and invalid signature produce different status codes and explanations. Preserve event identity across retry states. Do not invent performance claims or make a decorative terminal look live.

On mobile, put request above response and retain visible code overflow. Prefer meaningful code size over fitting every line without scrolling.

**Borrow:** `examples/developer/`. **Change first:** actual endpoint, schema, error semantics, copy behavior, authentication instructions. **Avoid:** automatically running requests against real services.

## Research explanation — Fieldwork

**Intent:** introduce a question, let a reader explore it, then expose the method. A large serif thesis sits above a contour illustration. The chart uses green for the signal and a dotted brown path for observation; both label and line style distinguish the series.

The experiment pairs a narrow explanatory column with a wider chart. A range input changes deterministic synthetic noise, leaving the underlying signal unchanged. Update the numeric output, chart description, and written interpretation together. No continuous animation is needed. The same concept remains legible without JavaScript through initial paths and a caption.

An editorial index uses ruled rows, dates/categories, and titles, rather than SaaS feature cards. Methods follow the examples. Do not label concept summaries as published research.

**Borrow:** `examples/research/`. **Change first:** source data, uncertainty, method, publication links. **Avoid:** visual precision that implies unsupported scientific accuracy.

## When motion earns its place

Use state motion to show an object continuing through a change: a selected note reveals its consequence; a finish updates the same lamp. Start with 180–260ms transitions and adjust to distance and task. These are tuning values, not rules. Avoid hiding all content until intersection observers run.

Use GLSL when many samples, material behavior, or spatial explanation actually need the GPU. Read `examples/webgl/README.md` for the tested Vite integration and fallback contract. The supplied atmosphere is a technical material study, not a finished identity. Palette changes alone do not make it subject-specific.
