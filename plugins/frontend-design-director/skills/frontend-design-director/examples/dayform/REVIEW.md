# Dayform concept review — 2026-09-30

## New brand / visible shader revision

Renamed to Dayform at the user's request. Original stacked-work mark replaces the Harvest asset; all demo CTAs stay local. New name is provisional, not trademark/domain-cleared. An original `workday.frag` runs through Paper's runtime in an exposed hero artwork. Browser inspection at 1280px showed a ready shader and a visible 588 × 368px canvas, not hidden behind a UI panel. Pause/resume changed pressed state true/false. Mobile wrapper widths 320 and 390 showed no page overflow. Build passed. Hero evidence saved locally as `outputs/work/harvest-review/dayform-hero.png`; old folder name reflects iteration history. A subsequent mobile correction restores introductory copy and places artwork before that copy. Reduced-motion/context-loss code remains, not newly end-to-end tested. Historical review below applies to the earlier implementation, not a certification of a completed rebrand.

Built with Frontend Design Director 0.4.1. Intake confirmed new product UI; no classic frontend-design skill. See DIRECTION.md for source scope and the rejected composition. This is a marketing prototype, not Harvest application/backend functionality.

## Verified

- `bun run build`: TypeScript + production Vite build passed. Existing unrelated vanilla non-module, use-client/source-map and large Three/lab chunk warnings remain.
- Desktop 1280 × 720: hero, report state, invoice state and feature-grid transition rendered and inspected. Mobile review iframe 390 × 844: hero and grid inspected. Narrow 320px and tablet 768px document widths matched viewport widths, no horizontal overflow.
- Rendered feature cells, each including illustrative UI: 12/16/24px only; at most three weights. Hero 12/16/64px; main timesheet/report 12/16/24px. Computed body family Onest; heading Besley. Font assets now bundled locally rather than requiring Google Fonts network access; font file returned HTTP 200.
- Main tabs switch between materially different scenes. Timer start changed to pressed Stop; elapsed time advanced to 1:45:27; Stop restored idle. Invoice creation showed “DRAFT CREATED” and sample feedback; Reset returned “DRAFT PREVIEW”. No external submission.
- Paper background created a canvas, wrapper reported ready. Pause changed control to Play with pressed=true. CSS fallback remains behind the canvas. Actual GPU animation frame pacing has not been profiled.
- Wi-Fi URL `http://192.168.4.25:5176/harvest/index.html` returned HTTP 200.
- Revision after inspection: larger mobile metadata; consistent 24px card framing and 12/16/24 typography; mobile navigation kept available; locally served fonts; type choices made project-specific rather than prescribed by skill.

## Evidence

Local screenshots outside the public repo at `outputs/work/harvest-review/` relative to the task directory: desktop-hero.png, desktop-grid.png, invoice-created.png, mobile-320.png, mobile-grid-390.png. Early mobile screenshots precede local-font packaging; desktop captures include final font asset links. They are viewports, not complete-page captures. Screenshots cannot establish animation timing or physical mobile performance.

## Known limits

- Keyboard tab-arrow handlers, reduced-motion branch, no-JS presentation, shader context-loss cleanup and import-failure fallback exist in code; end-to-end tests of those paths are not complete. A full accessibility/contrast audit and physical iOS/Android GPU test are pending.
- Timer is a local demonstration without persistence. Report and invoice use a fixed completed-project fixture, not a live aggregation of the timer; feature illustrations are noninteractive and labeled sample data.
- Font families are configured and locally served; the browser automation's FontFaceSet enumeration was empty, so it did not independently confirm per-font loaded status. Do not equate computed family names alone with loaded-face verification.
- Harvest logo still references its official remote SVG. This is an independent concept, clearly disclosed and noindexed. Official signup/product links leave the prototype.
- Skill-creator Python validator could not start because PyYAML is absent. Frontmatter and reference links were reviewed separately; do not claim that validator passed.
