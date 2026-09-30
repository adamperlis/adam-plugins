# Product-led SaaS and AI

Use when value is best understood through a workflow, agent, or transformation.

## Structural recipes

### Workflow system

Best for multi-capability products such as Linear.

1. Outcome-led hero + real product canvas.
2. Three-part philosophy or differentiation.
3. Long product chapters organized by workflow stages.
4. Feature clusters within each chapter.
5. Customer evidence and integrations.
6. Pricing or trial close.

Each chapter should have a different product state but one shared visual grammar. Use long sections when the product genuinely supports a sequence.

### Agent / creation platform

Best for products like ElevenLabs, Perplexity, or Retool.

1. Hero includes an input, generated output, or selectable product mode.
2. Show category breadth without making every capability equal.
3. Demonstrate a complete before → action → result loop.
4. Add credibility close to the claim: model quality, customers, or measurable outcome.
5. Separate creator/self-serve and enterprise paths when both matter.

### Focused tool

Best for products like Cursor.

1. Quiet nav, concise claim, primary action.
2. One oversized, legible product frame.
3. A small number of task stories.
4. Compatibility, trust, and customer proof.
5. Repeat the action without adding a new visual language.

## Visual rules

- Product UI is the hero media. Crop to the decisive state; do not show the whole app at unreadable scale.
- Keep surrounding chrome quieter than the product demonstration.
- Use realistic task content. “Project Alpha / $12,345” placeholder dashboards erode credibility.
- When a hero is interactive, seed it with an example that teaches the product and offers an obvious next action.
- Cinematic media can create desire, but the next section must resolve into concrete workflow proof.

## Compose UI as product imagery

Learning from the September 2026 Cadence critiques: complete, readable panels alone did not reproduce the references' compositional quality. Plan the image slot and section layout together. These are options, not a mandatory grid or section count.

| Treatment | Choose it when | Preserve |
|---|---|---|
| Actual product UI or a faithful crop | Credibility depends on the real workflow | Decisive state, realistic content, recognizable controls |
| Simplified UI fragment | One capability gets lost in application chrome | Input, relationship, result; omit irrelevant navigation |
| Cropped UI composition | The product should feel larger than the frame | A sharp focal detail and enough context to interpret it |
| Interactive demonstration | Visitors benefit from testing a consequence | Working controls, consistent shared state, reset and failure boundaries |

Do not label original fictional UI as a real product capture. Illustrative fragments need meaningful content but not fake working buttons. Keep operational controls in a separate uncropped demo if art direction requires masking the illustration.

### Layout patterns to adapt

- **Dominant scene plus supporting cells:** give the core capability more area than secondary evidence. Unequal widths and spans should express priority, not random bento decoration.
- **Text outside the crop:** align the claim with its relevant UI detail. Keep the copy and action outside the clipping/masking layer.
- **Full-width scene → denser grid → quiet explanation:** vary scale and density across chapters rather than repeating alternating text/image rows indefinitely.
- **Interface beyond the frame:** use overflow clipping and a targeted edge fade to imply continuation. Keep the focal task sharp; never fade important numbers, statuses, controls, or the only explanation.
- **Mobile-specific framing:** select a new focal crop and offset, reduce peripheral chrome, and retain intentional grouping where it remains legible. Do not automatically expand every fragment into a complete tall card or shrink a desktop screenshot to fit.

Reference reasoning: the measured Linear study supports persistent work objects and broad product chapters; Cursor supports quieter text around a substantial product stage; ElevenLabs supports one selector shell with changing representative content; Firecrawl supports an executable operation near the claim. The specific mixed grid, masks, and offsets in Cadence are original adaptations responding to user feedback—not measured reproductions of all those sites. Consult the research ledger before claiming further source coverage.

### Borrowable implementation

For actual **page-level UI-filled feature grids**, use [FeatureGrids.tsx](../examples/reference-ui/FeatureGrids.tsx) and [feature-grids.css](../examples/reference-ui/feature-grids.css). A kanban board inside one giant screenshot is not a feature grid. The four original examples separate a cell's claim, clipped illustrative scene, and uncropped controls; they vary spans by importance (7/5, 8/4, full-width review, then 6/6). Each cell contributes different evidence rather than repeating the same dashboard. On mobile, change scene offsets and text measures; preserve the compact two-column voice cell where it remains readable. These are optional design examples, not measured vendor grids or required layouts. Open each study at `#features`.

Inspect [Cadence HTML](../examples/saas/index.html), [CSS](../examples/saas/style.css), and [state logic](../examples/saas/main.ts). Search for `hero-product-crop`, `feature-cell`, `mini-crop`, and `demo-disclosure`. Its linked source/task slot, date proposal, explicit approval, and reset are useful ingredients. Do not inherit its colors, launch premise, exact grid, or number of scenes by default.

```css
/* Illustration only: keep meaningful controls outside this masked layer. */
.product-crop { position: relative; overflow: hidden; }
.product-crop__art {
  width: 36rem;
  mask-image: linear-gradient(#000 75%, transparent);
}
@media (max-width: 40rem) {
  .product-crop__art { width: 26rem; margin-left: -2rem; }
}
```

Specify the scene's claim, focal detail, desktop crop, mobile crop, and behavior before implementation. A fade is not a substitute for a well-chosen crop. In interactive scenes, one change must update all related visible states; altered evidence may invalidate an earlier approval.

## Example transformations

- Generic: “AI that transforms your workflow” above a glowing orb.
- Directed: “Turn a customer call into prioritized engineering work” beside the exact transcript → issue → owner sequence.

- Generic: six cards for six features.
- Directed: one customer task shown end-to-end, followed by three compact capability annotations.
