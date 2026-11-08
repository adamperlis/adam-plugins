# Keyword and question research for websites

Use this to decide which queries and questions a site should answer, and which page answers each one. App Store keywords are a different job: use the `keyword-research` skill for those.

The output is a **query map**: clusters of real queries, the intent behind each, the evidence that people search them, and the one page that should answer each cluster.

## Rules

- **Never invent search volumes.** Without a volume source, say "no volume data" and rank by the evidence you do have. A made-up number looks precise and steers the whole plan.
- **Free sources first.** Paid keyword APIs (DataForSEO, Semrush, Ahrefs, Moz) are used only when the user already has a key configured. Never sign up or buy access for them.
- **Research questions, not just keywords.** AI Mode and assistant queries run about three times longer than classic searches and read like a full problem description. Keep the user's wording; do not compress it to two-word head terms.
- **One cluster, one page.** Two pages chasing the same intent split the signal (cannibalization). Map each cluster to a single existing or new URL.

## Sources, in order of trust

### 1. Google Search Console (best: real queries for this site)

What people already typed before seeing this site. Use the Performance report (Search results, last 3 to 16 months, Queries and Pages tabs), the Search Console API (`searchanalytics.query` with dimensions `query` and `page`) if the user has access, or Zine's GSC sync when the site runs on Zine.

Pull these lists:
- **Striking distance:** average position 5 to 20 with real impressions. The cheapest wins; the page already ranks and needs better coverage of that query.
- **Low CTR, high impressions:** the title and description do not match what the query asks.
- **Question queries:** filter for `how`, `what`, `why`, `can`, `best`, `vs`, `alternative`, `cost`, `price`. These are the AEO targets.
- **Query to page mismatches:** one query spread over several URLs (cannibalization), or a query landing on a page that does not answer it.
- **AI Overviews / AI Mode:** check the search appearance filters for AI surfaces where they are available.

New site with no data: skip to the sources below and say the map is unvalidated until Search Console has a few weeks of data.

### 2. Assistant prompts (query fan-out)

Ask real buying questions in at least three assistants (ChatGPT, Perplexity, Gemini), signed out where they allow it: branded ("is <brand> free?") and unbranded ("best <category> for <need>", "cheaper <leader> alternative"). If the audit already ran an agent test, reuse its answers. Assistants break a buyer question into sub-questions (query fan-out). Record, for each unbranded prompt:
- the sub-questions or searches the assistant ran, when it shows them,
- the competitors and pages it cited,
- what it said that was wrong or missing about the brand.

Each sub-question is a candidate query, and each cited competitor page shows the format that wins it.

### 3. Google autocomplete (free, real phrasing)

```bash
q() { curl -sS -m 20 "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=$(printf %s "$1" | jq -sRr @uri)" | jq -r '.[1][]'; }
q "headless cms for"
for w in how why what best vs alternative cost; do q "$w <seed>"; q "<seed> $w"; done
```

This is an unofficial endpoint: use it lightly (tens of calls, not thousands), and switch to manual searching if it starts failing. Autocomplete shows that a phrasing exists, not how big it is. Also note "People also ask" and "Related searches" from a few manual searches on the head terms.

### 4. Competitor coverage

For the competitors that the agent test named:
- read their sitemaps (`/sitemap.xml`, including sitemap indexes) and list the topics and comparison pages they publish,
- read the H1 and H2s of their pages that assistants cited,
- list the comparisons and "alternatives" pages they have that this site lacks.

A topic several rivals cover, and that assistants cite, is evidence of demand even without volume numbers.

### 5. Community phrasing

Search the category's subreddits, forums, YouTube comments and support threads for how real buyers describe the problem. Use their words for headings and FAQ questions.

### 6. Paid volume data (only if a key is already configured)

Use it to size clusters the free sources already found. Record the provider, location, language and date, because volumes differ between tools.

## Building the map

1. **Collect** every candidate query with its source.
2. **Cluster** queries that one page could fully answer. Same intent and same answer means one cluster, even when the wording differs.
3. **Label intent** for each cluster:
   - informational ("how does X work")
   - comparison ("X vs Y", "X alternatives")
   - commercial ("best X for Y", pricing)
   - transactional ("X sign up", "download X")
   - navigational (brand plus page)
4. **Map** each cluster to the one page that should answer it: an existing URL, or "new page" with a proposed slug.
5. **Prioritize** using the evidence:
   - business value: does a person asking this become a customer?
   - existing traction: Search Console impressions and position
   - gap: rivals cited and this site absent
   - effort: refreshing a page that already ranks beats writing a new one
6. **Hand off** each row as a concrete action: a new page, a refresh, a title and description rewrite, an added FAQ, or a comparison page.

## Output table

The row below is an illustration of the format, not real data.

| Cluster | Primary query | Variants | Intent | Evidence | Page | Action | Priority |
|---|---|---|---|---|---|---|---|
| CMS for Astro | headless cms for astro | astro blog cms, best cms astro | commercial | GSC: 1.2k impressions, position 14; autocomplete; ChatGPT cited 2 rivals | /astro (exists) | Refresh: add a comparison table and FAQ | High |

Put the source in the Evidence column for every number: "GSC 2026-08 to 2026-10", "autocomplete", "agent test 2026-11-08". If a cell has no data, write "none". Do not leave it blank, and do not estimate.

## Measuring

Re-pull the same Search Console report 4 to 8 weeks after changes ship, and compare position, impressions and CTR for each mapped cluster. Re-run the same assistant prompts and check whether the brand now appears for the clusters it targeted. Report branded and unbranded results separately.
