# Cadence rebuild review — 29 September 2026

This record supersedes the earlier dashboard-led version. Governed by Frontend Design Director, not classic frontend-design. [Design reasoning](DIRECTION.md).

## Exercised in the in-app browser

- Desktop rendered at 1280px. Opening, source/task scene, handoff canvas, and release gate inspected. Increased meaningful UI text and reduced opening height after the first render; moved a route annotation away from the detail panel.
- Responsive iframe at 320, 390, and 768px: document width equals viewport width. At 390px the timeline becomes dated cards. At 768px the routing scene retains its three nodes and readable detail. This is responsive browser testing, not physical-device certification.
- Simulate delay → preview state → apply dates works. Release date changes from October 8 to October 12. The initial proposed change leaves the committed release date unchanged until applied.
- Pending date change blocks approval even after both review checkboxes are checked. Applying the new plan clears those previous checks.
- On the 390px frame: apply dates, complete both reviews, explicitly approve. Decision record reads “Jamie approved October 12.” Feedback states that nothing was sent or published.
- Source selection changes the highlighted source and linked task together. Design selection produces “Build the optional team-invite step.”
- Handoff selection updates person, source, and next action. Go-to-market produces the Orbit release candidate rather than the design file.
- ArrowRight switches the workspace tab. Monthly billing with nine editors produces $135/month.
- Changing a checked review after approval withdraws the approval and adds a corresponding change-log entry. Reset returns the original plan. No browser errors were logged during the checked flow.
- A sandboxed iframe without script permission displays the no-script notice and the semantic initial page at 320px. Interactive simulations require JavaScript, as stated. Other source/hand-off variants are enhancements, not separately available static pages.
- Only DM Sans and Bricolage Grotesque render as authored font families. The bundled older unused fonts are not loaded.

## Evidence

### Cropped-grid revision

The marketing opening now uses an illustrative product crop with an overlapping change proposal. The fully interactive room is a separate native disclosure opened by demo links. A dominant context cell plus two supporting cells replaces the equal-weight feature treatment. Original HTML/CSS artwork uses deliberate overflow and edge masks; actionable controls remain outside masks. The 320px visual review exposed cramped supporting artwork, so those cells gained vertical space. Desktop and mobile source switching and opening/simulating the disclosed demo were checked again. This revision does not imply a complete new audit of every interaction.

- [Desktop opening](../previews/saas-desktop.jpg)
- [Source and linked task](../previews/saas-source.jpg)
- [Handoff scene](../previews/saas-handoff.jpg)
- [Mobile layout](../previews/saas-mobile.jpg)

`responsive-review.html` is a development harness with width/font diagnostics and a no-script switch, not customer-facing navigation.

## Build and limits

TypeScript and Vite production build pass. Existing warnings in the separate vanilla/React/WebGL examples remain. Cadence does not import those heavy scene dependencies.

Reduced-motion handling is source-verified; the system preference was not live-emulated. No screen-reader, complete contrast, physical-phone, performance trace, or backend audit was performed. Small metadata still needs a full accessibility pass. Public research completeness, comparative superiority, and production readiness are not claimed.
