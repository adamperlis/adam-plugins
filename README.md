# adam-claude-plugins

Personal [Claude Code](https://code.claude.com) plugin marketplace.

## Install

```bash
claude plugin marketplace add adamperlis/adam-claude-plugins
claude plugin install social-video@adam-plugins
claude plugin install ui-motion@adam-plugins
```

To develop against a local checkout instead:

```bash
claude plugin marketplace add ~/code/adam-claude-plugins
```

## Plugins

| Plugin | Contents | What it does |
|---|---|---|
| `social-video` | skill: `social-video-hooks` | Writes briefs, scripts, and shot lists for short-form social video (Reels, TikTok, Shorts). Encodes hook stacking at t=0 and a ~3s retention cadence. |
| `ui-motion` | skills: `kinetic-inflated-hero`, `scroll-blur-manifesto` | Builds high-taste kinetic typography heroes and scroll-linked blur manifesto transitions. |

## Layout

```text
.claude-plugin/marketplace.json     # marketplace manifest
plugins/<plugin>/
  .claude-plugin/plugin.json        # plugin manifest
  skills/<skill>/SKILL.md           # skill, with name + description frontmatter
```

Adding a plugin means creating the directory above and appending an entry to the
`plugins` array in `marketplace.json`.
