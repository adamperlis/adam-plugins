# UI Motion

Two reusable frontend skills for kinetic hero typography and scroll-driven text reveals, available for Claude Code and Codex.

**[Try the live interactive demo](https://adamperlis.github.io/adam-plugins/plugins/ui-motion/examples/contained-ui-motion-demo.html)** — explore both effects, adjust the DialKit controls, and copy a component with your settings.

## Install The Pack

For the full frontend pack, install `frontend-design-director` first for page-wide direction, then `ui-motion` for the two motion patterns below. `design-constraints` is an optional companion for tighter layouts. These plugins can also be used independently.

**Claude Code**

```bash
claude plugin marketplace add adamperlis/adam-plugins
claude plugin install frontend-design-director@adam-plugins
claude plugin install ui-motion@adam-plugins
```

**Codex**

```bash
codex plugin marketplace add adamperlis/adam-plugins
```

Then install `frontend-design-director` and `ui-motion` from the Plugins Directory. Ask for both in the same task when you want the page-wide design direction and one of these specific effects.

It contains two skills:

| Skill | Use it for | Primary tools |
|---|---|---|
| `kinetic-inflated-hero` | Full-screen kinetic typography heroes with inflated physical letterforms. | React/Next.js, Matter.js-style physics, Pretext-inspired typography, SVG goo/blur filters, CSS keyframes |
| `scroll-blur-manifesto` | Quiet editorial sections where text resolves from blur into clarity on scroll. | Lenis, GSAP ScrollTrigger, layered sharp + pre-blurred text, opacity crossfades |

## Contained Code Example

The [live demo](https://adamperlis.github.io/adam-plugins/plugins/ui-motion/examples/contained-ui-motion-demo.html) is a single-file HTML/CSS/JS example. You can also [view its source](examples/contained-ui-motion-demo.html). It includes:

- an electric-blue kinetic inflated hero whose letters fit measured space around the nav, statement, and bottom copy
- a per-letter invisible-word blur/refocus effect
- a warm editorial scroll section
- sharp and pre-blurred text layers that crossfade on scroll
- separate Hero and Section reveal panels using real DialKit, with saved values and presets
- Matter.js hover collision with sharp letters, timed letter pops, and a synchronized one-shot "invisible" wash
- a `Copy component` action in each DialKit panel that copies a standalone example for that section with the current settings embedded
- CDN-loaded Matter.js, DialKit, Lenis, GSAP, and ScrollTrigger
- a reduced-motion fallback

The real Zine implementation uses Next.js, React, Matter.js, `opentype.js`, Lenis, GSAP ScrollTrigger, and local fonts loaded with `next/font/local`: Geist, Fragment Mono, Inter, DM Mono, and OT2049 for the inflated hero glyphs. The contained demo loads OT2049 Bold from a sibling `Zine` checkout for local preview. The hosted example uses the open-licensed Bricolage Grotesque fallback; it does not redistribute OT2049. Before using the copied hero code in another project, replace the `@font-face` URL with a licensed font asset you can serve there. The demo uses Matter bodies, measured obstacle pockets, and hover scaling, while production Zine deforms actual font outlines through a particle lattice.

## Invoking These Skills

Claude Code and Codex use different explicit skill syntax:

| Host | Kinetic hero | Scroll blur manifesto |
|---|---|---|
| Claude Code | `/kinetic-inflated-hero` | `/scroll-blur-manifesto` |
| Codex | `$kinetic-inflated-hero` | `$scroll-blur-manifesto` |

Plain language also works in many clients, but explicit examples are clearer when you know where the skill is installed.

## Kinetic Inflated Hero

This skill helps create a hero that behaves like a kinetic brand object. Use it when a normal SaaS headline plus screenshot would feel too generic.

![Kinetic inflated hero reference](assets/zine-hero-reference.png)

It guides the agent to:

- use a full-viewport composition
- make inflated letterforms the main visual system
- treat support copy and CTAs as obstacles the letters avoid
- preserve legibility while keeping the type alive
- use a signature per-letter blur/disappear/refocus effect for important words such as “invisible”
- avoid generic AI sparkles, dashboard mockups, and purple gradients

Example prompts:

**Claude Code**

> /kinetic-inflated-hero design and implement a launch hero for Zine. The phrase is “Your site is invisible to ChatGPT, Claude, Gemini, Perplexity, Grok.” Make the word “invisible” defocus and vanish letter-by-letter, then resolve back into focus.

**Codex**

> $kinetic-inflated-hero design and implement a launch hero for Zine. The phrase is “Your site is invisible to ChatGPT, Claude, Gemini, Perplexity, Grok.” Make the word “invisible” defocus and vanish letter-by-letter, then resolve back into focus.

## Scroll Blur Manifesto

This skill helps build the calmer section after a loud hero: the product argument becomes readable as the user scrolls.

![Scroll blur manifesto reference](assets/scroll-blur-manifesto-reference.png)

It guides the agent to:

- use a warm near-white editorial canvas
- render one large left-aligned manifesto paragraph
- highlight key words as electric-blue filled pills
- use Lenis + GSAP ScrollTrigger for scroll-scrubbed motion
- reveal text through a sharp layer and a pre-blurred ghost layer
- animate opacity between layers instead of animating blur on many words
- preserve readable static text for crawlers, screen readers, and reduced-motion users

Example prompts:

**Claude Code**

> /scroll-blur-manifesto build the section after my hero. Start with “Introducing Zine,” then reveal a large manifesto paragraph word-by-word. Each word should appear blurred first, hold briefly, then sharpen as I scroll.

**Codex**

> $scroll-blur-manifesto build the section after my hero. Start with “Introducing Zine,” then reveal a large manifesto paragraph word-by-word. Each word should appear blurred first, hold briefly, then sharpen as I scroll.

## Packaging

- `plugin.json` is the portable Agent Plugins manifest for OpenAI/Codex-compatible hosts.
- `.codex-plugin/plugin.json` is the Codex compatibility fallback and declares `skills: ./skills/`.
- `.claude-plugin/plugin.json` keeps the same plugin installable in Claude Code.
- Skill files live in `skills/<skill>/SKILL.md`.
- Reference images live in `assets/` and are also copied into skill-specific `assets/` folders when useful.
