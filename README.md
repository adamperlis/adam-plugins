# adam-plugins

Personal plugin marketplace by Adam Perlis. The repo is public so the same skill packages can be installed in Claude Code and, where supported, OpenAI/Codex plugin surfaces.

## Install

### Claude Code

```bash
claude plugin marketplace add adamperlis/adam-plugins
claude plugin install frontend-design-director@adam-plugins
claude plugin install video-skills@adam-plugins
claude plugin install ui-motion@adam-plugins
```

### Codex / ChatGPT Desktop

```bash
codex plugin marketplace add adamperlis/adam-plugins
```

Then open the Plugins Directory and install the plugin bundles you want from the `Adam Plugins` marketplace.

## Plugin Catalog

| Plugin | Skills | What it does |
|---|---:|---|
| `frontend-design-director` | 1 | Routes marketing/frontend work by site archetype, then applies evidence-backed composition, motion, typography, and quality gates. |
| `ui-motion` | 2 | Kinetic typography heroes and scroll-linked blur manifesto transitions. |
| `design-constraints` | 1 | Designs UI with explicit spatial and typographic constraints instead of letting the model guess. |
| `awwwards-motion` | 1 | Awwwards-level motion: spring physics, GLSL, React Three Fiber, post-processing, particles, and interactive 3D. |
| `fullstack-coding` | 1 | Systematic full-stack development guidance for architecture, debugging, code quality, security, testing, and deployment. |
| `video-skills` | 11 | Complete video production bundle for creator videos, product demos, component loops, tutorials, brand films, thumbnails, and social hooks. |
| `social-video` | 1 | Legacy standalone social-video hooks skill, kept for backward compatibility. Prefer `video-skills` for the complete bundle. |
| `seo-aeo-geo` | 1 | SEO/AEO/GEO audits and implementation for websites and Ghost themes, including schema and AI visibility guidance. |

## Invoking Skills

Claude Code and Codex use different explicit skill syntax:

| Host | Example |
|---|---|
| Claude Code | `/frontend-design-director redesign this SaaS homepage` |
| Codex | `$frontend-design-director redesign this SaaS homepage` |

Plain language also works in many clients, but explicit invocation is clearest when you know the skill is installed.

## Frontend Design Director

Use this for substantial marketing sites, landing pages, product frontends, launch pages, and design critiques where the page needs a point of view rather than generic polish.

> /frontend-design-director design a marketing homepage for a developer tool. Preserve the product UI, but rethink the narrative and section structure.

> $frontend-design-director critique this landing page for hierarchy, product proof, motion, and mobile composition.

## UI Motion

The `ui-motion` plugin is for front-end work where the motion idea is the product story, not decoration. It packages two reusable UI skills extracted from the Zine homepage direction.

[Try the live UI Motion demo](https://adamperlis.github.io/adam-plugins/plugins/ui-motion/examples/contained-ui-motion-demo.html) or [read its install guide](plugins/ui-motion/README.md). For the full frontend pack, install `frontend-design-director` before `ui-motion`; both are also usable independently.

### `kinetic-inflated-hero`

Use this when you want a full-viewport hero built around living typography: inflated letters, soft-body motion, Matter.js-style collisions, Pretext-inspired kinetic type behavior, SVG goo/blur filters, and a signature word effect.

![Kinetic inflated hero reference](plugins/ui-motion/assets/zine-hero-reference.png)

**Claude Code**

> /kinetic-inflated-hero design a full-screen launch hero for an AI visibility product. Make the main visual inflated physical type, not a dashboard screenshot.

**Codex**

> $kinetic-inflated-hero implement a hero where the word "invisible" blurs and disappears letter-by-letter, then resolves back into focus.

### `scroll-blur-manifesto`

Use this for the section immediately after a loud hero: a quiet editorial argument that resolves from blurred ghost text into sharp copy as the user scrolls. It is especially useful for Lenis + GSAP ScrollTrigger builds.

![Scroll blur manifesto reference](plugins/ui-motion/assets/scroll-blur-manifesto-reference.png)

**Claude Code**

> /scroll-blur-manifesto build a warm, editorial manifesto section where each word appears as a blurred ghost before sharpening on scroll.

**Codex**

> $scroll-blur-manifesto use this after the hero. Keep it warm, editorial, and restrained; use sharp and pre-blurred text layers instead of animating blur on every word.

## Video Skills

The `video-skills` plugin includes the full public video bundle from [adamperlis/video-skills](https://github.com/adamperlis/video-skills):

| Skill | Use it for |
|---|---|
| `creator-video` | A person presenting or demonstrating a product on camera |
| `feature-video` | A short video of a real software feature |
| `ui-component-clip` | A seamless loop of one interface component |
| `silent-product-demo` | A designed UI demo without narration |
| `ui-tutorial-video` | A step-by-step tutorial in the real interface |
| `narrated-product-film` | A voice-led film with visual proof for each line |
| `brand-film` | A narrative launch or campaign film |
| `brand-grid-video` | A moving grid of UI and brand elements |
| `video-brand-system` | Shared color, type, motion, sound, and framing rules |
| `video-thumbnails` | Still covers and short animated loops |
| `social-video-hooks` | Openings, scripts, and timed beat sheets for social clips |

## Packaging

Each plugin folder includes:

- `plugin.json` for portable Agent Plugins / OpenAI-compatible hosts.
- `.codex-plugin/plugin.json` as a Codex compatibility fallback.
- `.claude-plugin/plugin.json` for Claude Code.
- `skills/<skill>/SKILL.md` for skill instructions.

Marketplace files:

- `.agents/plugins/marketplace.json` for Codex / ChatGPT desktop marketplace discovery.
- `.claude-plugin/marketplace.json` for Claude-compatible marketplace discovery.

## Layout

```text
.claude-plugin/marketplace.json     # Claude-compatible marketplace manifest
.agents/plugins/marketplace.json    # Codex / ChatGPT desktop marketplace manifest
plugins/<plugin>/
  plugin.json                       # portable OpenAI / Agent Plugins manifest
  .codex-plugin/plugin.json         # Codex compatibility manifest
  .claude-plugin/plugin.json        # Claude plugin manifest
  skills/<skill>/SKILL.md           # skill instructions
  assets/                           # optional screenshots/reference images
```
