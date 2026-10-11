# Gaia animation principles

Gaia uses the classic twelve principles of animation as a craft framework, translated for a calm baby-tracking product. Apply this guide to character moments, illustration loops, campaign motion, onboarding, and other expressive sequences. Ordinary UI transitions still follow the shorter duration and easing roles in [Illustration and motion](illustration-and-motion.md).

## The twelve principles, in Gaia's voice

1. **Squash and stretch — preserve the drawing.** Use subtle deformation to suggest weight or softness, usually within `0.95–1.05`. Preserve apparent volume and the traced character's recognizable silhouette. Never distort data geometry, type, or functional controls to make them feel lively.
2. **Anticipation — prepare the meaningful action.** Give a toss, hop, reveal, or turn a small setup so it reads clearly. Roughly 10–20% of an expressive sequence is often enough. Routine taps and logging actions should respond immediately rather than making the caregiver wait for a performance.
3. **Staging — one focal action.** The viewer should know what to watch without scanning. Keep supporting elements quieter, preserve generous empty space, and do not animate every character or decoration at once. Functional UI remains readable throughout.
4. **Straight-ahead and pose-to-pose — choose control deliberately.** Build product motion and branded loops pose-to-pose so start, key action, recovery, and end state are intentional. Reserve straight-ahead variation for loose particles or organic details where exact continuity is not important.
5. **Follow-through and overlapping action — let secondary parts settle later.** Ears, fabric, a toy, or a small accent may trail the main body by a few frames and settle after it. Keep one secondary part's delay restrained, usually about 40–100ms in UI-scale motion; use Gaia's named stagger roles for lists or repeated items. Secondary motion must not extend an app interaction or create a perpetual idle distraction.
6. **Slow in and slow out — avoid mechanical movement.** Use Gaia's named enter, exit, and settle curves, or a similarly shaped eased path for longer campaign motion. Product motion that physically overshoots uses an interruptible spring; reserve timed settle or overshoot curves for named tokenized transitions or authored campaign keyframes. Linear timing is appropriate only when a real value or controlled playback requires it.
7. **Arcs — organic things travel organically.** Character heads, trunks, hands, tossed objects, and celebratory accents should follow simple arcs. Navigation, sheets, and data marks use direct paths so the interface stays precise.
8. **Secondary action — support, never compete.** One small delayed action can reinforce the main beat: an ear follows a turn, a yellow ball trails a trunk toss, or a sparkle lands after a reveal. If it becomes the first thing noticed, reduce it or remove it.
9. **Timing — let weight and context set the pace.** Keep routine UI within Gaia's 90–480ms duration roles. Expressive marketing loops may breathe over roughly 2–4 seconds, with a readable action and a short rest. A three-second loop should not contain three seconds of constant motion.
10. **Exaggeration — clarify with restraint.** Enlarge the clearest pose or timing contrast just enough to make the action legible at small sizes. Prefer a slightly deeper anticipation or cleaner silhouette over a huge bounce, elastic face, or carnival-scale confetti.
11. **Solid drawing — respect weight, anchors, and geometry.** Set transform origins where the character bears weight, keep feet or contact points grounded, and preserve the supplied SVG viewBox and proportions. Review silhouettes at the delivery size; a technically smooth move can still feel weightless if the anchor is wrong.
12. **Appeal — warm, specific, and recognizable.** Keep Gaia characters friendly, imperfect, and emotionally clear without turning them into hyperactive mascots. Motion should deepen the existing drawing's charm rather than adding generic cartoon habits.

## Character articulation gate

Every expressive character loop must pass these checks before export:

- **No sticker motion.** A root transform may carry the character's weight, but it cannot be the action. Independently key at least the body, the part that causes the action, and one connected follower. If disabling the root transform makes the character effectively still, the animation fails.
- **Pose the parts.** Define distinct rest, anticipation, action/contact, follow-through, and settle poses. Between anticipation and action, at least two internal relationships must change—for example trunk-to-head and tail-to-body. Detached props, particles, and camera motion do not count.
- **Prove the silhouette.** Compare rest, anticipation, and action frames at the same root position and scale. Their outer contours must read as distinct poses at delivery size. If only position, rotation, opacity, or a detached prop changes, reject the loop.
- **Animate the mechanism.** The anatomy that causes the event must lead it and pass through contact or release. A trunk toss requires the trunk to curl/load, accelerate through release, and follow through; a jump requires the legs to compress and extend; a wave originates through shoulder, elbow, and wrist. Never animate the effect while its cause stays static.
- **Overlap connected parts.** Key at least one connected follower on a different phase from the body. Ears, tails, fabric, and similar parts should lag acceleration by roughly 2–5 frames at 30fps and settle 2–6 frames after the driver. Do not give every group the same keyframes or easing.
- **Account for every flexible appendage.** Each visible ear, tail, trunk, loose sleeve, or similar flexible form must either react purposefully to the force or be deliberately held still by the pose. Accidental stillness reads as an unrigged sticker. Multiple connected followers may overlap when they all reinforce the same primary action, stay lower-amplitude than the driver, and use distinct phase offsets; they do not count as competing secondary story beats.
- **Use anatomical pivots and flexible shapes.** Put transform origins at joints and attachment points. Trunks, tails, and other flexible parts must change curve through segmented groups or path morphs; rotating a rigid appendage around its bounding-box center is not articulation.
- **Rig before animating.** If the supplied SVG is monolithic, prepare an animation-only layered rig that preserves the resting silhouette, create a true pose-to-pose filmstrip, or choose a different action. Do not substitute a root bounce for missing articulation.

**Elephant toss check:** the body compresses, the trunk visibly changes curvature and tip position before and through release, the head or ear counter-moves, and the tail lags then settles. The ball begins its free arc at the trunk-release frame. A moving ball plus a translated or rotated static elephant fails.

## Loop construction

- Start and end on the same pose, position, scale, opacity, and background state. Compare the first frame with the loop boundary rather than judging by feel alone.
- Structure a short loop as rest → anticipation → action → follow-through → settle → rest. Leave enough stillness for the character to feel calm.
- Keep one primary action and at most one separate secondary story beat. The driver's connected followers may overlap as part of that same action. Use the yellow accent as a small focus cue, not a full-scene wash.
- Marketing loops may repeat. In the product, expressive animation is finite, interruptible, and dismissible where appropriate; it must not block logging or replay on every visit.
- For reduced motion, hold the strongest pose or replace travel, overshoot, and stagger with a short opacity change. Do not remove the meaning of a state change.
- Audit at actual size and speed. Check silhouette clarity, contact points, first/last-frame continuity, dark/light rendering, and whether the loop remains calm after several repetitions.

## Motion handoff

Name the primary action, anticipation, secondary action, transform origins, total duration, and reduced-motion treatment. For loops or exports, also name the frame rate and loop boundary. For exported media, state whether the output is seamless and whether audio is intentionally absent.
