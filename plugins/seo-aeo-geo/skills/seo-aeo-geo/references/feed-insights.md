# Distilled AEO / SEO / GEO Insights

> **What this is:** durable AEO/SEO/GEO insights, auto-distilled each week from public
> SEO/marketing sources (vendor blogs, studies, official docs) and published automatically.
> Each entry cites its source so you can weigh it.
>
> **Trust level:** Lower than a hand-curated core. These come from vendor blogs (Semrush,
> Ahrefs, HubSpot, Search Engine Land, etc.) and may carry marketing bias. When an entry
> conflicts with a well-established study, treat the study as the stronger evidence.
>
> **Consumed by:** the open-source `seo-aeo-geo` Claude skill, which fetches `index.md`
> then the docs below. Newest entries on top.

---

<!-- ===== proposed 2026-06-17 (deduped, 25 new articles) ===== -->
## Proposed 2026-06-17 — backlog catch-up (deduped)

#### Zero-Click Is Now the Default — Hard Numbers  ✅ Safe

- **68% of U.S. Google searches ended without a click in early 2026 (up from 60.45% in 2024); AI Overviews cut CTR ~60% when present, and now appear on 20%+ of queries**
  - SparkToro/Similarweb clickstream data (Jan–Apr 2026) quantifies what the core's mental model describes qualitatively. Reframe audit KPIs: traffic ≠ visibility, and citation-in-answer is the primary objective, not clicks. Zero-click is structural, not a temporary dip.
  - _Source: Search Engine Land (SparkToro/Similarweb), 2026-06-09 — https://searchengineland.com/google-zero-click-searches-2026-study-479717_

#### ChatGPT Fetches Reddit at Query Time (mechanism refinement)  ✅ Safe (moderate trust)

- **ChatGPT issues retrieval queries *naming Reddit* before it answers — Reddit influence is active, query-time grounding, not just training-data exposure**
  - Refines the existing insight "Reddit shapes ChatGPT's understanding but rarely gets the citation": the shaping happens through live, upstream retrieval at inference, then ChatGPT attributes the answer to an institutional source. Tactical implication: Reddit presence must be *findable by a search query*, not just crawlable — and it's a real-time signal, not only a slow brand-building play.
  - _Source: Foundation Marketing (The Lab Vol. 295, Profound data), 2026-06-04 — https://foundationinc.co/lab/vol-295/_

#### GSC Now Has AI Visibility Measurement + Control  ✅ Safe

- **Google Search Console added a dedicated AI performance report (AI Overview impressions/clicks/CTR) and a per-page toggle to block content from AI-generated responses**
  - These are now the authoritative first-party tools for measuring and controlling AI Overview visibility — more direct than inferring from organic CTR drops. Make "GSC → AI performance report" the primary measurement step in any AEO audit. The block toggle is a new publisher lever for content where uncontextualized citation creates risk (paywalled/exclusive/thin pages).
  - _Source: Semrush blog (Google announcement), 2026-06-03 — https://www.semrush.com/blog/google-adds-ai-performance-reports/_

#### Lighthouse Now Audits "Agentic Browsing" Readiness  ✅ Safe

- **Google added an Agentic Browsing audit category to Lighthouse — sites are now formally scored on whether AI agents can navigate and act on them**
  - A new technical axis beyond crawlability: agents must be able to follow links, reach key content, and interact with forms without hitting JS-rendering walls. Overlaps existing AEO foundations (server-side rendering, semantic HTML, no JS-only critical paths) but extends into interactive surfaces. Run a Lighthouse Agentic Browsing audit alongside Core Web Vitals on complex sites (SPAs, gated content, heavy client-side routing).
  - _Source: Semrush blog (Google announcement), 2026-06-03 — https://www.semrush.com/blog/google-adds-agentic-browsing-category-to-lighthouse/_

#### Google AI Mode Queries Are ~3× Longer (extends fan-out)  ✅ Safe

- **AI Mode (1B+ monthly users) queries average ~3× the length of traditional searches — content tuned to short-tail keywords is mismatched to compound, conversational intent**
  - Extends the existing fan-out title-relevance principle to Google's own AI surface. Practical: structure H1/H2 headings and opening paragraphs to mirror how someone describes a full problem in a sentence, not a two-word keyword.
  - _Source: Search Engine Land (Google Marketing Live 2026), 2026-06-08 — https://searchengineland.com/google-ai-brief-replacement-keywords-479576_

#### UCD Brand-Signal Framework (complements FSA)  ✅ Safe

- **AI forms brand opinions through three filters — Understandability, Credibility, Deliverability (UCD) — and the operational expertise that makes a business valuable is rarely published where AI can see it**
  - Understandability: clear about/product pages + structured data. Credibility: experience/expertise/authority/trust signals. Deliverability: surfaced for the right queries at the right moment. UCD complements FSA — FSA is about *content to produce*, UCD is about *signals AI infers from your footprint*. The high-leverage gap: convert internal/operational knowledge (methodology, process docs, expert-attributed case studies) into crawlable content. Apply both lenses in a brand AEO audit.
  - _Source: Search Engine Land, 2026-06-09 — https://searchengineland.com/how-ai-forms-opinions-about-your-brand-479671_

#### Google Officially Flags "AEO/GEO Tool" Claims as Skepticism-Worthy  ✅ Safe (validates core)

- **Google's third-party guidance doc now lists tools "promising improvements for AI experiences and search formats (AEO/GEO tools)" alongside other claims to evaluate critically — no tool has privileged access to AI feature signals**
  - Google-official validation of the skill's anti-snake-oil stance: core quality signals remain the primary lever. When advising clients evaluating third-party AEO tools, cite this doc — it shifts the burden of proof onto the vendor.
  - _Source: Search Engine Land (Google docs update), 2026-06-07 — https://searchengineland.com/google-adds-guidance-on-third-party-seo-tools-services-advice-and-updates-hiring-an-seo-doc-479637_

#### AI Search Is the Top Purchase-Intent Signal in B2B Discovery  ✅ Safe (moderate trust)

- **AI search was the #1 predictor of purchase intent for CRM software buyers; AI-referred traffic converts higher despite lower volume — the zero-click trade-off is leads-quality-positive for B2B**
  - AI-briefed visitors arrive further down the consideration funnel. For B2B SaaS, appearing in AI consideration-phase answers can matter more than organic traffic volume. Map content to the queries buyers run during *shortlist formation* (reinforces the core's shortlist-position insight), not just awareness queries.
  - _Source: HubSpot State of AEO 2026, 2026-06-01 — https://blog.hubspot.com/marketing/ai-search-behavior — (moderate trust — vendor report)_


<!-- ===== proposed 2026-06-01 web (Perplexity source selection) ===== -->
## Proposed 2026-06-01 — Perplexity engine (web research)

#### Perplexity Rewards Freshness + Niche Topical Authority  ✅ Safe (moderate trust)

- **Perplexity is a RAG engine with a strong recency bias and a preference for niche topical authority over generic domain strength**
  - Two-stage pipeline: retrieve (query match + authority signals) → rank for the most specific, accurate, well-structured answer. Averages ~5.3 cited sources per answer with a strong skew toward content published in the last ~12 months. A niche site with deep vertical expertise can out-cite a high-DA generalist. Practical: keep target pages genuinely fresh (real updates + `dateModified`) and build demonstrable topical depth in your vertical rather than chasing broad domain authority.
  - _Source: synthesized from multiple 2026 Perplexity citation analyses (AuthorityTech, SearchPilot, Stackmatix) — moderate trust; cross-source synthesis, not a single hard-data study_

#### Perplexity Favors Unique, Well-Structured, News-Style Content  ✅ Safe (moderate trust)

- **When sources overlap, Perplexity cites the one with unique information and clean structure; news/journalism content dominates its citations**
  - It preferentially cites original research, proprietary data, case studies, expert interviews, or novel frameworks over commodity rehashes, and clear heading hierarchy / extractable structure raises citation odds. Practical: lead pages with a distinct original angle and structure for extractability — this is the FSA "Structure" + "Freshness" lenses applied specifically to Perplexity.
  - _Source: synthesized from multiple 2026 Perplexity citation analyses — moderate trust_


<!-- ===== proposed 2026-06-01 backlog (ChatGPT citation study) ===== -->
## Proposed 2026-06-01 — backlog deep-read (LLM-assistant engines)

#### ChatGPT Citation Requires Ranking in Classic Search  ✅ Safe

- **To be cited by ChatGPT, you generally must first rank in traditional web search — it's the dominant supply channel**
  - In a 1.4M-prompt study, 88% of ChatGPT's actual citations came from the "search" retrieval channel (88.46% citation rate). Reddit/YouTube/academia are pulled in at scale but cited <2% of the time, and ChatGPT cites only ~50% of the URLs it retrieves. Practical: classic SEO ranking is the price of entry for ChatGPT visibility.
  - _Source: Ahrefs (Louise Linehan), 2026-04-15 — https://ahrefs.com/blog/why-chatgpt-cites-pages/_

#### Reddit Shapes ChatGPT's Understanding but Rarely Gets the Citation  ❗ Nuances core

- **Per-engine split: Reddit drives AI *consensus/context*, but owned/institutional ranked pages earn the actual ChatGPT *citation***
  - Reddit has its own retrieval channel (16M+ data points) yet is cited only 1.93% of the time; 67.8% of all non-cited URLs are Reddit. ChatGPT "learns from the crowd, then cites another institution." This nuances the core's 57M-citation study (where Reddit is the top channel): the two measure different things — overall AI citations across engines vs. ChatGPT-specific cited sources. Treat Reddit as an *influence* play, not a *citation* play, for ChatGPT.
  - _Source: Ahrefs (Louise Linehan), 2026-04-15 — https://ahrefs.com/blog/why-chatgpt-cites-pages/_

#### Title–Fan-out Relevance Drives ChatGPT Selection  ✅ Safe

- **Match titles/headings to ChatGPT's internal fan-out sub-questions, not just the head keyword**
  - Cited pages showed much higher cosine similarity between their title and the query's fan-out sub-questions (max-match 0.656) than non-cited pages (~0.48). A pre-fetch gatekeeping layer uses title + URL + snippet to decide which retrieved URLs to even open. Practical: phrase H1/title and section headings to mirror the specific sub-questions a topic fans out into.
  - _Source: Ahrefs (Louise Linehan), 2026-04-15 — https://ahrefs.com/blog/why-chatgpt-cites-pages/_


<!-- ===== proposed 2026-06-01 (from 5 new article(s)) ===== -->
## Proposed 2026-06-01

#### LLM Query Classification Determines Retrieval Strategy

- **Segment content by query type: "what's true now" triggers live search; "how things work" relies on training data**
  - LLMs fire real-time web searches for time-sensitive queries (prices, rankings, comparisons, current events) but answer conceptual/definitional queries from training data alone. This means freshness infrastructure (`dateModified`, frequent updates, crawlability) matters most for transactional/comparative content, while depth and entity consistency matter more for evergreen how-to content.
  - _Source: Edward Sturm, March 21, 2026 — (no URL in article)_
