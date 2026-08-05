# adam-claude-plugins

Personal [Claude Code](https://code.claude.com) plugin marketplace.

## Install

```bash
claude plugin marketplace add adamperlis/adam-claude-plugins
claude plugin install social-video@adam-plugins
```

To develop against a local checkout instead:

```bash
claude plugin marketplace add ~/code/adam-claude-plugins
```

## Plugins

| Plugin | Contents | What it does |
|---|---|---|
| `social-video` | skill: `social-video-hooks` | Writes briefs, scripts, and shot lists for short-form social video (Reels, TikTok, Shorts). Encodes hook stacking at t=0 and a ~3s retention cadence. |

## Layout

```
.claude-plugin/marketplace.json     # marketplace manifest
plugins/<plugin>/
  .claude-plugin/plugin.json        # plugin manifest
  skills/<skill>/SKILL.md           # skill, with name + description frontmatter
```

Adding a plugin means creating the directory above and appending an entry to the
`plugins` array in `marketplace.json`.
