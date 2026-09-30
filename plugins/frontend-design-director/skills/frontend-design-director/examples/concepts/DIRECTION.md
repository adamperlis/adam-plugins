# Dayform: three directions to compare

30 September 2026. User requested all three proposed art directions as browser prototypes. These are candidates, not an approved brand or production service. The previous `dayform/` study remains unchanged. Confirmed intake: new brand and new product UI, not Harvest's existing interface. Dayform remains an uncleared working name.

Open `index.html` through Vite; choose `?direction=closing`, `?direction=ledger`, or `?direction=room`. Each page has a comparison navigation. `mobile.html` is a 320/390/768px iframe review harness, not the mobile delivery URL; phones use the normal page.

## 01: Closing Time

The site should feel like a campaign for the end of the working day because independent teams need confidence that their work is accounted for before they leave.

- Poster → close-day operation → unequal weekly-view/invoice grid → campaign close.
- Full-width two-line Anton headline, overscale static 17:00, citron field. Onest supplies operational text. Two families, bundled OFL fonts.
- Alternative considered: center a clock above an app screenshot. Rejected because it would return to the repeated object-above-dashboard pattern. Clock and message instead occupy the same campaign field, followed by independent product proof.
- Product grid is 7/5, supporting grid 5/7; 24px outer radius and inset. Invoice illustration is cropped and faded below the decisive entries. Controls remain outside it.
- Mobile recomposes clock before action, uses a full-width action, and gives the timesheet full readable width. At 320px some entry text is deliberately 12px rather than squeezing 16px into the available row.
- Add 30 minutes → 6h30m total; review → locked entry control and reviewed state; reopen → editable. A sun lowers on completion (650ms). Clock colon runs only two cycles (4s), never loops indefinitely. Reduced motion removes both effects. No shader: the typographic concept does not need one.

## 02: The Working Ledger

The site should feel like a legible commercial record because studios need to connect effort to income.

- Ruled headline with margin annotation → hours-to-money equation → editable project ledger → live invoice → three connected principles.
- Onest plus Geist Mono; licensed local substitutes rather than the board's unlicensed Suisse labels. Onest's numerals carry the proposition; mono is reserved for marginal/record information.
- Alternative considered: put the invoice in the opening beside a headline. Rejected in favor of the full-width calculation, making the project's value the composition itself.
- Flat editorial rules are deliberate exceptions to rounded cards. Dense project rows use 12/16px; the invoice uses 12/16/24px. Desktop hero is 96px at 1280px. Mobile 40px at 320px and 48px at 390px. Mobile equation becomes a vertical receipt-like sequence.
- Changing design hours or hourly rate updates the hero equation, task amounts, remaining budget, and invoice. Any edit invalidates a previously created sample draft. Drafts are local only, never saved or sent. Meter transitions are 200ms; no decorative shader.

## 03: Room for the Work

The site should feel like entering a working creative studio because the audience wants practical administration to support their craft.

- Full-bleed studio photograph → editorial premise → 7/5 schedule/budget grid → 5/7 people/invoice grid → quiet close.
- Besley for editorial display, Onest for the software. Two bundled OFL families. Photography, not a floating dashboard, establishes the human subject. Mobile uses a different image focal crop at 64%.
- Alternative considered: make the photograph a small card adjoining the app. Rejected because it reduced the people to decoration. Here the photo owns the first scene; the app owns the next.
- Timeline illustration extends beyond its viewport and fades at the right; phase buttons remain outside the cropped layer. Cards use 24px radii and insets; the inner budget paper is intentionally square.
- Selecting Concept/Development/Delivery changes used time to 24/48/64h. Planning an extra day adds 8h; changing phase resets the extra day. All linked budget totals update together.
- Original `light.frag` produces broad moving window-light bands behind the crisp budget paper. Paper Shaders supplies the runtime, not the design or a Three.js scene. Exposed background is intentional. Pause control, bounded 600k pixel budget, offscreen/document pausing, context-loss fallback, and reduced-motion opt-out come from the existing lifecycle wrapper. CSS provides the static ground.

## Shared constraints and provenance

- 8px layout units; 24px card safe areas; no UI rotation, perspective, or skew. Rules use 1px; glyph geometry and optical letterspacing are intentional non-grid dimensions.
- Product component type budgets are 12/16/24px; display moments have separate expressive scales. Header/navigation and the clock display are distinct functional components. At most two loaded families per direction. The comparison gallery uses Anton/Onest only.
- Radix provides the small 15/16px operational glyphs: restrained and legible at this UI density. The existing MIT notice is retained. Other catalog families remain eligible for other projects.
- Reference reasoning: Cursor's outer-scene/inner-UI distinction; Linear's object continuity and selective crop/mask; ElevenLabs' changes of proof mode; Mercury's image-led aspiration followed by concrete tasks. These come from the existing measured studies, not a new research pass. No vendor assets, source scripts, or proprietary fonts were copied.
- Sample project data, team names, timesheets, and invoices are fictional. The photo is generated, not a real customer or studio endorsement. There is no backend, account creation, persistence, invoice delivery, pricing promise, or real integration.

See `REVIEW.md` for observed checks and limits, and `ASSETS.md` for the generated asset prompt and provenance.
