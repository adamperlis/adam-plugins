# TRACE review — 29 September 2026

## September 30 revision

The September 29 design was rejected for visual sameness despite passing functional checks. The current composition uses a compact proposition and contextual application stage, removes tilted source sheets, and increases important UI text. The new 390px opening was inspected; a missing space around a hidden line break was caught and fixed. The earlier screenshots and checks below refer to the original iteration until replaced. Build success is not evidence that the user's visual bar is met. Ditto code recovery remains pending.

Built using Frontend Design Director v0.3. See [direction and reference reasoning](DIRECTION.md).

## Observed

- Desktop 1280 × 720: opening, evidence grid and successful replay inspected. Tightened the opening to bring the failed span into the first viewport.
- Responsive iframe: document width matched 320, 390 and 768px viewports. At 320px the source art initially overlapped feature copy; moved it lower and reworked its crop. The revised active-policy statement is readable in the 390px render. No physical-device test performed.
- Span selection changes inspector title and evidence. Initial failed-policy state is available without interaction.
- Current-policy replay changes the answer. Archived-policy replay reproduces the failure. Changing the source invalidates the previous result. Reset restores current-source selection and original span.
- Script-disabled sandbox displays the initial page and an explicit fallback notice. Dynamic controls remain disabled until initialization.
- Computed font families: Archivo and Plex only. Both are bundled locally with licenses in their existing example font directories.
- TypeScript and production build pass. Existing unrelated vanilla/motion/large-bundle warnings remain. TRACE adds no runtime dependency; its built script is approximately 3KB before gzip.

## Evidence

- [Opening](../previews/trace-desktop.jpg)
- [Evidence composition](../previews/trace-evidence.jpg)
- [Replay result](../previews/trace-replay.jpg)
- [Mobile policy crop](../previews/trace-mobile.jpg)

## Limits

Semantic native buttons/select/anchors, focus styles, and reduced-motion override are implemented. Full keyboard traversal, screen-reader output, measured contrast and live reduced-motion emulation were not audited. Small technical metadata warrants an accessibility pass before production. Replay is a deterministic local fixture, not a real model call or a universal claim about agent quality. No fresh reference research or comparative superiority is claimed.
