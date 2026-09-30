---
name: seo-aeo-geo
description: >
  Comprehensive SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine
  Optimization) audit and implementation for websites and Ghost themes. Use this skill
  whenever the user mentions SEO, AEO, GEO, schema markup, structured data, AI
  visibility, search optimization, generative engine optimization, answer engine
  optimization, being cited by AI, showing up in ChatGPT/Perplexity/Gemini/AI
  Overviews, or when auditing/improving a website or theme for search performance.
  Also trigger when the user asks about entity authority, speakable content, query
  fan-out, or how AI search engines decide what to cite. Trigger proactively when
  reviewing a theme, CMS, or site — even if the user doesn't explicitly say "SEO".
---

# SEO / AEO / GEO Skill

## First Step: Pull the Latest Research

Before doing anything else, ground yourself in current research. Recommendations that
aren't grounded in the material below tend to drift into folklore. Pull from these
sources, in order:

### 1. Live distilled research (works for everyone)

A companion repo publishes fresh AEO/SEO/GEO insights, auto-distilled from public sources
each week and refreshed automatically. Fetch the index first, then the doc(s) most relevant
to the user's question:

```
WebFetch: https://raw.githubusercontent.com/adamperlis/aeo-geo-research/main/index.md
```

The index lists the current research documents with their raw URLs and a one-line summary of
each. Fetch the 1–2 most relevant, e.g.:

```
WebFetch: https://raw.githubusercontent.com/adamperlis/aeo-geo-research/main/insights/feed-insights.md
```

Treat these as **lower-trust than the core mental model below** — they come from vendor blogs
and cite their sources, so weigh each on its provenance. When a fetched insight conflicts with
the studies in this file, the core wins unless the new source is clearly stronger evidence.

**If WebFetch is unavailable or fails,** fall back to the bundled snapshot at
`references/feed-insights.md` (it may be older than the live copy). The durable principles in
this SKILL.md always apply regardless of whether the fetch succeeds.

### 2. Optional — your own research vault

If you maintain a local notes/research vault exposed via an MCP (e.g. Obsidian), also search it
for the user's topic for deeper, private grounding. Skip this step entirely if you don't have one.

```
(example, if an Obsidian MCP is connected)
mcp__obsidian__obsidian_search: "AEO answer engine optimization"
mcp__obsidian__obsidian_search: "GEO generative engine optimization schema"
```

### 3. Optional — the live official guidance

Fetch Google's own guide for the most current first-party guidance:
`https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`

---

## The Core Mental Model

Understanding the shift from SEO → AEO/GEO changes everything about what to prioritize.

**Old SEO:** Get your page to rank #1. Success = clicks to your site.
**AEO/GEO:** Get your brand cited inside AI-generated answers. Success = being *chosen* as a source.

The key insight from Foundation/AirOps (57M citations study):
- **Only 10% of AI citations go to brand-owned domains**
- **90% are third-party**: Reddit (20.8%), YouTube (13%), LinkedIn (11%), review sites, forums
- During **unbranded discovery queries** (when buyers build their shortlists), only **2.2%** of citations are brand-owned
- **Shortlist position determines 80% of sales outcomes**, and it forms inside AI before any website visit

This means: theme/code-level work (schema, structure, semantic HTML) is necessary but not sufficient.
You must always tell the user what they can do *off-site* too.

---

## The Engine Map — "AI search" is not one system

Do not treat "AI" as a monolith. Visibility tactics are **engine-specific**, and they sometimes
conflict. Diagnose which surface the user actually cares about, then apply the matching playbook.

### Google Search + AI Overviews / AI Mode
**Authoritative source: Google's own guide** (fetch live):
`https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`

Google is explicit: AI features are *rooted in core Search ranking and quality systems*, so
**classic SEO still applies.** What Google actually tells you to do:
- Create valuable, **non-commodity** content — firsthand experience, a real point of view, beyond common knowledge
- Clear structure: headings/sections, helpful images/video, readability
- Technical foundation: indexable, crawlable, snippet-eligible, semantic HTML, good page experience, minimal duplication
- For commerce: Merchant Center feeds + Business Profile
- Principle: *"Focus on what your visitors would enjoy, find helpful, and feel satisfied with."*

What Google says you do **NOT** need (myths it debunks directly):
- ❌ `llms.txt` / special AI markup
- ❌ "Chunking" content into tiny pieces
- ❌ Rewriting content just for AI systems
- ❌ Seeking inauthentic "mentions"
- ❌ Over-focusing on structured data (helpful, not required for AI features)

### LLM assistants — ChatGPT, Perplexity, Claude
Different mechanics from Google, and different from each other. These are the assistants where
people *chat* — citations work via a retrieval pipeline, not just ranking. What we know (see
the live research index for sourced detail, refreshed weekly):
- **ChatGPT:** to be cited you generally must first **rank in classic web search** — ~88% of its
  citations come from the "search" retrieval channel. **Title↔fan-out semantic relevance** drives
  which retrieved URLs get opened/cited. **Reddit shapes its *understanding* but is rarely *cited*
  (~1.93%)** — an influence play, not a citation play.
- **Perplexity:** RAG engine with a **strong recency bias** (favors content from the last ~12
  months) that weights **niche topical authority over generic domain strength**; cites ~5.3
  sources/answer, prefers **unique/original** content (proprietary data, expert quotes, novel
  frameworks) and clean heading structure, and **news/journalism dominates** its citations. Keep
  pages fresh + distinctly structured. *(Moderate trust — synthesized from vendor analyses, not a
  hard-data study.)*
- **Claude:** leans on its own retrieval + entity signals; no strong vendor-neutral study yet —
  apply general retrieval principles (freshness, entity clarity, extractable structure) and verify
  before advising.
- **Cross-assistant:** entity authority + consistent third-party presence (the 57M-citation study
  below) matters broadly for entering the consideration set across all of them.

> ⚠️ **Engines can conflict.** Example: the 57M-citation study (below) makes Reddit the *top*
> citation channel across AI broadly, while the ChatGPT-specific study shows Reddit is used for
> context but almost never cited *by ChatGPT*. Both are true — they measure different surfaces.
> Always state which engine a recommendation targets.

---

## The FSA Framework

Diagnose every site through these three lenses. Miss one and the others can't compensate.

### Freshness
- Is the content recently updated? AI systems track whether language matches *how topics are discussed today*
- Fast-moving verticals (AI, SaaS, fintech): ~90-day shelf life before content loses relevance signals
- `dateModified` in schema is the technical signal — but the *content* must actually change, not just the date
- One real update per quarter beats five cosmetic changes per month

### Structure
- Can an AI model lift a clean, accurate answer out of the *first few hundred words*?
- AI structure = **extractability**, not just crawlability
- Patterns that work: clear H2/H3 hierarchy, definitions at the top of sections, bullet lists, tables, FAQ blocks, summary sections
- If the best insight is buried three paragraphs into a section that requires prior sections to make sense, AI will skip it

### Authority
- **Entity authority** (not domain authority) — is your brand consistently described the same way across the web?
- One mention = a data point. Repeated mentions in similar contexts across multiple channels = model confidence
- This lives mostly *off-site*: podcast appearances, Reddit threads, LinkedIn posts, guest articles, expert quotes, community participation
- Consistent `sameAs` links in Organization schema help machines map your brand entity across domains

---

## Audit Framework — Run in This Order

### 1. Technical Foundation
Check that AI crawlers can access content:
- `robots.txt` — nothing accidentally blocking GPTBot, Googlebot, PerplexityBot, ClaudeBot
- Pages are server-rendered (not client-only JS) — critical for GEO; AI crawlers have lower tolerance for JS-heavy pages than Googlebot
- Canonical URLs are correct — no duplicate content confusing the crawler
- `sitemap.xml` exists and is submitted to Search Console
- Core Web Vitals are reasonable (page experience signal)
- Semantic HTML: `<article>`, `<main>`, `<header>`, `<nav>`, `<time>` are used correctly

### 2. Schema Markup
See `references/schema-patterns.md` for copy-paste implementations.

Priority order (implement in this sequence):
1. **Organization / NewsMediaOrganization** — on *every* page, not just homepage. Entity authority requires the publisher to be declared sitewide.
2. **Article with `["BlogPosting", "NewsArticle"]` co-type** — `NewsArticle` signals freshness to AI systems
3. **`speakable` specification** — marks the CSS selectors of extractable content (title, excerpt, first paragraph) for AI Overviews and voice
4. **BreadcrumbList** — navigation context for every post and tag page
5. **CollectionPage with `about` entity** — for tag/category archive pages; tells AI what the collection is *about*
6. **WebSite** — on homepage only, with publisher reference (no SearchAction unless you have a working URL-based search route)
7. **ItemList with `name`** — each item should include `name`, not just `url`

What NOT to do (myths from Google's official guide):
- ❌ `llms.txt` or `ai.txt` files — Google doesn't treat them specially
- ❌ Chunking content into tiny pieces
- ❌ Rewriting content specifically for AI systems
- ❌ Over-focusing on structured data — it's helpful but not required for AI features

### 3. Content Structure (advise the user — not always code changes)
- Does each post open with a direct statement answering the core question? (extractability)
- Are there H2/H3 sections with self-contained meaning?
- Does the publication cover **query fan-out** — the follow-up questions around each topic?
- Are there FAQ sections on key pages?
- Use **semantic triples**: Subject → Predicate → Object (e.g. "Acme Weekly is a newsletter covering the fintech industry.")

### 4. Entity Authority (off-site — advise the user)
Based on the 57M citation study, these are the highest-leverage off-site channels:
- **Reddit**: 20.8% of all AI citations, 30.9% in unbranded discovery — most important single channel
- **YouTube**: 13% — video explainers, walkthroughs, shorts
- **LinkedIn**: 11% — company posts, founder thought leadership
- **Review/directory sites**: category-specific (G2, Product Hunt, etc.)
- **Help/support docs**: 8% — well-structured how-to content AI loves to cite

The citation fingerprint is **vertical-specific** — always check which sources AI actually cites for the user's specific topic/industry before recommending channels.

---

## Ghost-Specific Implementation Notes

Ghost's Handlebars helpers for conditional schema:
- `{{#post}}...{{/post}}` — post context
- `{{#page}}...{{/page}}` — static page context
- `{{#is "home"}}` / `{{#is "tag"}}` / `{{#is "author"}}` — page type checks
- `{{#has tag="events"}}` — check if post has a specific tag
- `{{#is "home"}}...{{else}}...{{/is}}` — use `else` for "not home" (no `{{#unless @is.home}}`)
- `{{url absolute="true"}}` — always use `absolute="true"` in schema URLs
- `{{date published_at format="YYYY-MM-DDTHH:mm:ssZ"}}` — ISO 8601 for schema dates
- `{{#foreach tags}}"{{name}}"{{#unless @last}},{{/unless}}{{/foreach}}` — iterate tags for keywords

Schema files live in `partials/schema/` and are included in `default.hbs`.
After editing CSS, run `node node_modules/.bin/gulp build` in the theme directory to rebuild.

---

## Reporting to the User

After completing any implementation, structure your report as:

**What was implemented (theme/code level):**
List each schema/structural change and which research insight or Google guide principle it addresses.

**What still needs attention (content level):**
Be specific — e.g., "Post excerpts are missing on 3 posts; they're used as `description` in Article schema"

**Off-site recommendations:**
Based on the citation study, name the 2–3 highest-leverage external channels for *this specific publication's topic area*. Be specific — don't just say "be on Reddit." Say which subreddits, what content format, and why AI systems cite that source type for their vertical.

**How to measure:**
- Google Search Console → AI Overviews impressions
- Run "money prompts" in ChatGPT, Perplexity, Gemini — the questions buyers actually ask in their category
- Track whether the brand appears in responses to unbranded category queries (hardest and most valuable)

---

## References

- `references/schema-patterns.md` — Ready-to-use JSON-LD patterns for Ghost/HBS themes
- `references/audit-checklist.md` — Systematic checklist for a full SEO/AEO/GEO audit
- `references/feed-insights.md` — Bundled snapshot of distilled insights (offline fallback; the live copy is fetched in Step 1)
- Live research index (fetch for the latest): `https://raw.githubusercontent.com/adamperlis/aeo-geo-research/main/index.md`
- Google's official guide (fetch live for latest): `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`
