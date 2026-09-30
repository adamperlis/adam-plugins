# Prototype review — 30 September 2026

These are three candidates for comparison, not a finished service or a claim of design superiority. Built using Frontend Design Director; the classic frontend-design skill was not used.

## Rendered evidence

Desktop captures are 1280×720. Narrow captures show a 320px-wide, 844px-high iframe inside the desktop browser; screenshots include the surrounding review harness. These are responsive browser checks, not physical-device tests.

- [Closing Time desktop](review/closing-desktop.png), [320px timesheet](review/closing-320-demo.png).
- [Working Ledger desktop](review/ledger-desktop.png), [320px project](review/ledger-320-demo.png).
- [Room for the Work desktop](review/room-desktop.png), [320px product opening](review/room-320-demo.png), [changed desktop budget / paused shader](review/room-project.png).
- Also visually inspected Closing Time and Room heroes at 390px, and all three heroes at 320px. No complete physical-phone scroll audit was performed.
- Desktop DOM measurement: document scrollWidth = 1280 for each 1280px viewport; no horizontal document overflow.
- Computed desktop h1 families/sizes: Closing Time Anton 149.76px; Ledger Onest 96px; Room Besley 67.84px. Body uses Onest. Ledger marginal information uses Geist Mono. Each direction uses at most two families; comparison gallery uses Anton/Onest.

## Focal interactions exercised

1. Closing Time: add final notes (30 minutes), then close the day. Live status reported `6h 30m reviewed`; the extra-entry action becomes disabled. Reopen is available. The screenshot is the initial mobile state, not proof of the changed state.
2. Ledger: create draft; Reset draft appears. Press ArrowRight on the native design-hours slider: total increases from 48 to 49h and Create sample draft returns (earlier draft invalidated). Select $150/hour: hero and invoice both report $7,350. Budget meter reports 49 hours used.
3. Room: choose Delivery then add an extra day: 72h used / 8h remaining. Pause background motion becomes Play background motion with aria-pressed=true. One canvas mounted, shader host reports ready. Pause state and changed budget captured.

## Revisions during review

- Imported studio photography as a Vite asset rather than leaving an unresolved runtime-relative image path. Final build contains the hashed JPEG.
- Fixed the mobile ledger budget meter to track its live percentage horizontally as well as vertically on desktop.
- Added post-render initial-anchor handling so direct links into React-rendered demos scroll to their target.
- Comparison gallery does not load the Room serif; it uses only two families itself.
- Narrow-screen spacing and readable control placement reviewed; all operational controls sit outside faded illustrations.

## Build and limitations

- `bun run build` passed TypeScript and Vite after final implementation changes. Existing unrelated warnings remain for legacy vanilla script bundling, Framer Motion use-client/source maps, and large lab/Three chunks. The concepts do not import Three.js.
- `git diff --check` passed.
- Native slider keyboard interaction was tested. Full Tab-order, screen-reader, automated contrast, focus-through-every-state, and touch interaction audits remain unverified.
- Reduced-motion CSS and the existing shader opt-out wrapper are present; a fresh OS/browser reduced-motion toggle was not exercised in this pass. GPU context-loss and offscreen-resume paths were not re-tested here. Physical mobile GPU performance and thermals remain unverified.
- These React prototypes require JavaScript. A noscript disclosure is present; there is no server-rendered/no-JS version of the pages.
- No backend, persistence, invoice sending, real integrations, registration, or customer proof. Images and sample data are identified as illustrative. All copy and UI remain proposals for user review.
