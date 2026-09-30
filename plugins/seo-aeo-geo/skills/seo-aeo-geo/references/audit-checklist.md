# SEO / AEO / GEO Full Audit Checklist

Systematic checklist for auditing a site across all three layers: technical crawlability,
structured data, content structure, and entity authority.

Work through these in order — technical foundation must pass before schema, schema before
content advice makes sense.

---

## Layer 1: Technical Foundation

### Crawl Access
- [ ] `robots.txt` exists and does NOT block: `GPTBot`, `Googlebot`, `Googlebot-News`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `OAI-SearchBot`
- [ ] Pages are server-rendered — no critical content gated behind JS that requires browser execution
- [ ] Canonical URLs are set correctly on all pages — no duplicate pages at www/non-www or http/https
- [ ] `sitemap.xml` exists at `/sitemap.xml` or linked from `robots.txt`
- [ ] Sitemap has been submitted to Google Search Console

### URL and Redirect Health
- [ ] No chains of 301 redirects (A→B→C) — each destination should be a single hop
- [ ] No redirect loops
- [ ] 404 pages return actual 404 status (not soft 404 with 200 status)

### Page Performance
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (check Search Console)
- [ ] Images have explicit `width` and `height` attributes to prevent layout shift
- [ ] Above-the-fold images use `loading="eager"`, below-the-fold use `loading="lazy"`
- [ ] Fonts use `font-display: swap` to prevent render-blocking

### Semantic HTML
- [ ] One `<h1>` per page, matching the page's primary topic
- [ ] Logical heading hierarchy: `<h1>` → `<h2>` → `<h3>` (no skipped levels)
- [ ] `<article>` wraps post content (not just a generic `<div>`)
- [ ] `<main>` wraps the primary content area
- [ ] `<nav>` wraps navigation, `<header>` and `<footer>` are used correctly
- [ ] Publication dates use `<time datetime="YYYY-MM-DDTHH:mm:ssZ">` attributes
- [ ] Author names use `<a rel="author">` where possible

---

## Layer 2: Schema Markup

### Organization / Publisher Entity
- [ ] `Organization` (or `NewsMediaOrganization`) schema appears on **every page** — not just homepage
- [ ] Organization `@id` is consistent across all pages: `{{site.url}}#organization`
- [ ] `sameAs` includes all known brand URLs: main domain, social profiles, Wikipedia if exists
- [ ] Homepage has full Organization block with `logo`, `foundingDate`, `founder`, `knowsAbout`
- [ ] Non-home pages reference Organization by `@id` only (lightweight reference)

### Article / Post Pages
- [ ] `@type` uses `["BlogPosting", "NewsArticle"]` co-type (NewsArticle is the freshness signal)
- [ ] `headline` present and ≤ 110 characters
- [ ] `description` is set (from post excerpt, not truncated body text)
- [ ] `datePublished` uses ISO 8601 format with timezone
- [ ] `dateModified` uses ISO 8601 format with timezone
- [ ] `image` object includes `url`, `width`, `height` (1200×630 recommended)
- [ ] `author` includes `@id`, `name`, `url`, and `sameAs` (Twitter, personal site)
- [ ] `publisher` references Organization by `@id`
- [ ] `isPartOf` references WebSite by `@id`
- [ ] `mainEntityOfPage` set to the canonical URL
- [ ] `keywords` populated from post tags
- [ ] `articleSection` set from primary tag
- [ ] `speakable` spec marks CSS selectors of extractable content
- [ ] `inLanguage` is set (e.g., `"en-US"`)

### Homepage
- [ ] `WebSite` schema with `name`, `description`, `url`, `publisher`, `inLanguage`
- [ ] Full `Organization` block (not just `@id` reference)
- [ ] No `SearchAction` unless there is a working URL-based search route (not JS overlay)

### Archive / Tag Pages
- [ ] `CollectionPage` + `ItemList` co-type
- [ ] `about` entity declares what the collection is about (important for topical relevance)
- [ ] Each `ListItem` has `name` and `url` (not just `url`)
- [ ] `isPartOf` references WebSite, `publisher` references Organization

### Navigation / Breadcrumbs
- [ ] `BreadcrumbList` on all post pages
- [ ] Position 1 = Home, position 2 = primary tag/section, position 3 = post title
- [ ] Breadcrumb items reflect actual navigation structure

### Validation
- [ ] No schema errors in Google's Rich Results Test
- [ ] No critical errors in schema.org validator (`https://validator.schema.org/`)
- [ ] No "duplicate @id" warnings in rich results test

---

## Layer 3: Content Structure (Extractability)

These are advisory items — not code changes, but content recommendations for the user.

### Post / Article Level
- [ ] Every post opens with 1-2 sentences that directly answer the core question (no windup)
- [ ] `<h2>` sections are self-contained — each section makes sense without reading the others
- [ ] Definitions appear at the top of the section that introduces a new term
- [ ] Data points and statistics are in their own sentence, not buried in a longer sentence
- [ ] Lists use `<ul>` or `<ol>` (not faked with dashes or asterisks in body text)
- [ ] Tables used for comparisons, not prose descriptions of the same data

### FAQ / Q&A Coverage
- [ ] Key pages have a FAQ section covering follow-up questions (query fan-out)
- [ ] FAQ questions match how users actually phrase search queries (not internal jargon)
- [ ] Answers in FAQ sections are self-contained (complete answer without context)

### Semantic Triples
- [ ] Each post contains at least one clear Subject → Predicate → Object sentence near the top
  - Example: "Acme Weekly is a newsletter covering the fintech industry."
- [ ] These sentences are in the first paragraph or excerpt (for AI extractability)

### Excerpt / Meta Description
- [ ] Every post has a custom excerpt set (not auto-generated from first paragraph)
- [ ] Excerpt is 150-160 characters, answers the question the post addresses
- [ ] Excerpt appears in Article schema `description` field

---

## Layer 4: Entity Authority (Off-Site)

Advisory — cannot be verified from the codebase, but ask the user to check.

### Brand Consistency
- [ ] Organization name is stated identically across all platforms (no "Acme by Acme Corp" vs "Acme" vs "acme/Acme")
- [ ] `sameAs` URLs in schema match actual profile URLs
- [ ] Company description on all platforms uses same ~2-sentence framing

### Third-Party Presence (Based on 57M Citation Study)
- [ ] **Reddit** (20.8% of AI citations): Active presence in relevant subreddits; content being discussed or linked
- [ ] **YouTube** (13%): Video content exists covering core topics; descriptions are searchable
- [ ] **LinkedIn** (11%): Company page active; founder/team posting thought leadership
- [ ] **Product Hunt / G2 / category review sites**: Listed and reviewed in relevant directories
- [ ] **Podcast appearances**: Founder/team quoted or appearing on relevant podcasts (high trust signal)
- [ ] **Guest articles**: Brand mentioned in third-party publications covering the same vertical

### Freshness Signals
- [ ] At least one substantive content update per quarter on core topic pages
- [ ] `dateModified` in schema reflects actual content changes (not cosmetic edits)
- [ ] News/time-sensitive content updated or archived when no longer current

---

## Ghost-Specific Checks

- [ ] `ghost_head` is the last tag in `<head>` (Ghost injects canonical, og:, twitter: meta here)
- [ ] Schema partials are included *after* `{{ghost_head}}` (avoids conflicts with Ghost's own schema)
- [ ] `{{url absolute="true"}}` used in all schema URLs (relative URLs break validators)
- [ ] No duplicate `og:title` or `og:description` from custom schema conflicting with Ghost's output
- [ ] Theme passes `npx gscan@6.2.0 <theme-path>` with no errors (warnings OK)

---

## Measurement

After implementing changes, track:
- **Google Search Console** → Performance → AI Overviews impressions/clicks
- **Rich Results Test** → all structured data types should pass
- **"Money prompts"**: Run queries buyers actually use in ChatGPT, Perplexity, Gemini — check if brand is cited
- **Unbranded category queries**: "best [category] newsletter" / "who covers [topic]" — hardest to win, highest value
- **Monthly**: check if `sameAs` entities are being picked up (search `site:linkedin.com "<brand>"` etc.)
