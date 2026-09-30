# Dayform / The shape of a workday

Latest user direction: create a new brand, not a Harvest rebrand. **Dayform** is the working name, with no trademark/domain clearance implied. Replaced Harvest's mark with an original stacked-work wordmark, renamed the illustrative application, and removed outbound Harvest signup/product links. All conversion actions lead to the local demo. Trial and live-integration claims were removed. Earlier Harvest research and design history below documents the starting point, not affiliation or ownership. Current route is `/dayform/index.html`; the old Harvest route redirects.

## Superseding hero direction — 0.4.3

The user rejected the familiar neutral/serif/SaaS composition as insufficiently distinctive and could not perceive the earlier shader behind the product UI. The hero now explores **the shape of a workday**: an exposed vermilion artwork of 48 flowing strands, grouped into the fictional project's 24 design / 16 build / 8 strategy hours. The headline is sans rather than another serif/italic formula. UI proof follows below; cards remain straight. The original `workday.frag` uses Paper's ShaderMount runtime, not a Paper preset or Three.js. Color/flow is illustrative, not live analytic data. CSS striped fallback, pause control, context-loss handling and reduced-motion opt-out remain. This is a revised hero direction; the whole site has not been established as a completed new brand. Earlier concept decisions below are retained as iteration history where superseded here.

Independent, user-requested marketing homepage redesign. Not an official Harvest property or an implemented Harvest application. The DataForSEO brief was superseded.

Confirmed intake: user chose **“Design new product UI for this concept”** on 2026-09-30. Apply Frontend Design Director 0.4.0; do not use the classic frontend-design skill.

## Updated motion pass

- One Paper Mesh Gradient behind the main UI scene: muted warm colors, grain, low-speed light shift gives the stage a softer material quality than the previous flat ruled fill. UI remains fully opaque DOM above it. Not a Three.js scene; no need for 3D geometry here.
- CSS ground remains for no JS, reduced motion, import/GPU failure, or context loss. Visible pause control, 600k pixel cap, runtime offscreen/tab-hidden suspension. No claim of measured mobile GPU performance.
- Timer: start/stop changes button state with immediate feedback; numbers update without bouncing. Tabs: short scene entrance for pointer use; keyboard navigation changes instantly. Invoice: shadow and status contrast change when a local draft is created; reset reverses them. The paper stays straight. Hover movements only on fine pointers; active presses have feedback.

## Design argument

This should feel like a thoughtfully run independent studio because Harvest's audience needs to see how small time-tracking habits support a healthy business. Primary archetype: product-led SaaS. Two font families: Besley (matching the inspected current brand's heading family) and Onest (an approachable sans for the newly designed UI), served via Google Fonts. This is a project-specific choice, not a prescribed font pairing. Warm orange comes from Harvest's identity; olive is an original supporting color for budget/capacity data. The brand SVG is referenced at its official public URL, not redistributed.

Alternative considered: a full-height orange editorial hero with animated hours becoming revenue. Rejected: it delays the product and implies an automatic revenue outcome. Selected: compact asymmetric editorial opening, then a broad workflow stage with three genuinely different media states (timesheet, report, invoice), followed by four unequal UI feature cells. The subsequent user-requested motion pass added a restrained Paper WebGL background; no Three.js geometry is needed.

## Grid revision

Applied 0.4.1: 8px layout rhythm; feature cards 24px outer radius and 24px copy inset; product frame 24px/8px/16px nested corners on mobile. Artwork is intentionally cropped and can extend past its safe text area. Mobile app-body inset is 16px (one full grid step smaller than desktop) to preserve usable text. Font budgets verified on complete cards including their UI illustrations: 12/16/24px, up to three weights. Hero 12/16/64px (40px mobile). Borders, optical letterspacing, intrinsic SVG logo dimensions, and Radix's 15px icon grid are exceptions to the layout spacing grid. Updated in 0.4.2: all UI illustrations, documents and notification panels remain straight; decorative card rotation was removed at the user's request. Debug overlay at `?inspect=1` shows the base grid, content-safe area and art bounds without changing the regular visitor view.

## Geometry and references

- Desktop width 1200, 40px margins at 1280; opening 1.3:1, Besley ~61px / 1.19. Main product below opening, not shrunk into a decorative hero column.
- ElevenLabs measured selector study: stable selector with a different proof format per mode. Harvest modes preserve the same fictional Acme project but show distinct jobs.
- Cursor inspected product stage: inset readable app on a separate image ground; quiet chrome. Our ruled orange stage is original.
- Linear chapter reasoning: different workflow states, not one dashboard restyled. Grid 7/5 then 5/7 with different evidence: calendar, budget, people, invoice. Crop/fade only on noninteractive illustration layers. All working controls stay unmasked.
- Mobile below 680: concise category labels, time entry's control on its own row, peripheral chrome removed, calendar reframed, full-width feature cells with different internal compositions. No scaled-down desktop screenshot.
- Icon choice: Radix fits the compact 15px operational UI and already exists in this repository. Considered Phosphor for friendlier weight variants and Carbon for reports; neither justified a second installed family for this restrained interface. Named imports, MIT notice in public/licenses.

## Source research, 2026-09-30

- https://www.getharvest.com/ — rendered at 1280 × 720; inspected DOM and computed H1 (Besley, 70px, rgb(29,30,28)); observed orange mark, neutral warm background, centered rotating proposition. Cookie notice obstructed part of screenshot; no claim of complete visual coverage.
- https://www.getharvest.com/features/time-tracking-software — text inspected: timer, weekly entries, calendar, desktop/mobile, approvals.
- https://www.getharvest.com/features/reports-and-analysis — text inspected: budgets, time breakdowns, internal costs, capacity.
- https://www.getharvest.com/features/invoicing-and-payments — text inspected: timesheet-based invoice, Stripe/PayPal, accounting sync.
- https://www.getharvest.com/features, /why-harvest, /resources, /integrations, /pricing — main navigation destinations retrieved; not full rendered/interaction audits. Homepage menus inspected via rendered DOM. Not every subnavigation page studied.
- https://www.getharvest.com/signup — link observed, not submitted.

No prices, fabricated customers, performance promises, or customer quotes. Sample hours and invoice figures are explicitly fictional. Features vary by plan. External CTAs lead to official site. Prototype noindex; no official canonical or Organization impersonation schema.

## Scope

Static semantic marketing content; interactive local timer, accessible tabs, local invoice-draft state. The timer is a local demo, not persisted or connected to Harvest. Reports/invoice show a separate fixed completed-project fixture (48h), not a running live report. No payment, account creation, or real invoice transmission. Source files are original; not vendor JavaScript or recovered application code.
