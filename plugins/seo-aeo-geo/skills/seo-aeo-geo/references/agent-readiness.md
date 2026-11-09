# Agent readiness for production sites

Use this playbook when auditing with Is It Agent Ready, improving a site's machine-readable surfaces, or verifying that an agent can complete a real product task.

## Establish the baseline

1. Inventory the requested domains and resolve redirects. Score canonical public production sites. Track staging, intentionally private or noindex sites, retired domains, redirect-only aliases, and unreachable hosts separately so the portfolio totals are interpretable.
2. Run the scanner on each canonical URL (see "Run the scanner" below). Record the date, scanner or rules version when available, selected profile, final URL, raw results, and exact check names. Report Content Site and All Checks separately when both exist. Compare like-for-like runs and inspect failures at the underlying endpoint before changing code. Record checks that are inapplicable or outside your control.
3. Measure search visibility separately. Test representative branded and unbranded questions. Record the engine, question, date, claims, source URLs and whether those sources actually support the answer. For category benchmarks, use the same checks and outcome criteria against comparable products. A scanner percentage measures the checks in that run. Category leadership and AI citation visibility require their own evidence. [Scanner](https://isitagentready.com/) · [Cloudflare scoring methodology](https://blog.cloudflare.com/agent-readiness/) · [Google's guide to generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Run the scanner

Get the score from the API, not by reading the web page. No key is needed. Behavior below was observed on 2026-11-08; if a call fails or the shape changed, read `https://isitagentready.com/llms.txt` and adapt.

```bash
OUT=<scratchpad>/agent-ready; mkdir -p "$OUT"
SITE=https://www.example.com
# All Checks, structured JSON (the score of record)
curl -sS -m 90 -X POST https://isitagentready.com/api/scan \
  -H 'content-type: application/json' -d "{\"url\":\"$SITE\"}" -o "$OUT/all.json"
# Content Site profile (fewer checks; a content site often scores higher here)
curl -sS -m 90 -X POST https://isitagentready.com/api/scan \
  -H 'content-type: application/json' -d "{\"url\":\"$SITE\",\"profile\":\"content\"}" -o "$OUT/content.json"
# The same failures as one markdown fix list, with a guide link per check
curl -sS -m 90 -X POST https://isitagentready.com/api/scan \
  -H 'content-type: application/json' -d "{\"url\":\"$SITE\",\"format\":\"agent\"}" -o "$OUT/fixes.md"

jq '{level, levelName, scannedAt, url}' "$OUT/all.json"
jq -r '.checks | to_entries[] | .key as $c | .value | to_entries[] | "\($c).\(.key)\t\(.value.status)\t\(.value.message)"' "$OUT/all.json"
jq '.nextLevel' "$OUT/all.json"   # what the next level requires, with a short prompt per check
```

- **Response:** `level` (0 to 5), `levelName`, `nextLevel` (target, requirements with `check`, `description`, `shortPrompt`, `specUrls`), and `checks` grouped as `discoverability`, `contentAccessibility`, `botAccessControl`, `discovery`, `commerce`. Each check has `status` (`pass`, `fail` or `neutral`), `message`, `details` and `evidence` (the exact requests the scanner made and what came back). Commerce checks do not count toward the score.
- **Profiles:** `"profile":"content"` matched the Content Site profile in testing (academyux.com scored 4 on All Checks and 5 on content). The API profile name for "API / Application" is undocumented; record which profile each number came from.
- **MCP alternative:** the same scan is the `scan_site` tool (argument `url`) on the Streamable HTTP server `https://isitagentready.com/mcp`.
- **Per-check guides:** each failure in `fixes.md` links an implementation guide at `https://isitagentready.com/.well-known/agent-skills/<check>/SKILL.md`. The scanner says its fix text is AI-generated and provided as-is.

## Apply the results

Treat the scan as a to-do list to triage, not a script to execute.

1. **Read the evidence first.** For each `fail`, look at `evidence` and fetch the endpoint yourself. A failure can be a firewall challenge, a redirect, an HTML fallback served with a 200, or a cached old response, and the fix for those is not the file the scanner asked for.
2. **Sort every failure into one of three buckets** and show the table to the user before changing anything:
   - **Fix now:** public crawl and retrieval (robots, sitemap, Link headers, AI bot rules, Content Signals, Markdown negotiation, llms.txt). These help every site.
   - **Fix only if real:** discovery files (API catalog, OAuth metadata, MCP Server Card, A2A card, Agent Skills, Auth.md, WebMCP, DNS-AID). Publish one only when it describes a capability the site actually runs. A card for a service that does not exist raises the score and misleads every agent that reads it.
   - **Out of scope:** checks that need DNS, registrar or account changes the user has not authorized, and checks that do not fit the site (OAuth on a brochure site). Record them with the reason.
3. **Implement from the guide and the spec**, not only from the scanner's short prompt. Follow the linked SKILL.md and the spec URL, and match the project's own framework and hosting.
4. **Verify each fix directly** (status, media type, body, headers) in preview, then on production after an authorized deploy.
5. **Rescan with the same profile** and report before and after: level, the checks that changed, and any that still fail with the reason.

## Make useful public content easy to retrieve

- Check canonical URLs, robots directives, sitemap entries, status codes, and CDN or WAF behavior on representative public pages. Test the home page and pages agents need to answer specific questions, such as product documentation, case studies, pricing, service descriptions and comparisons. Check that missing URLs return an appropriate error.
- Document the publisher's choices for search crawling, user-triggered retrieval and model training. Consult each provider's current bot documentation, then check that robots rules, edge policy and any Content Signals express those choices consistently. Keep an optional `llms.txt` or similar discovery file focused on canonical, maintained sources. Treat it as an optional discovery aid. [Content Signals](https://contentsignals.org/) · [Google's guide to generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- If offering Markdown over HTTP, derive it from the same published source as the HTML. Verify `Accept: text/markdown`, ordinary browser requests, and explicit exclusion such as `text/markdown;q=0` under the site's negotiation policy. Check status, representation, `Content-Type`, `Vary: Accept` on both variants, HEAD when supported, and cache isolation after alternating requests. Verify redirects and missing pages. Limit alternate representations to content approved for public access. [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html) · [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)

## Expose a capability that solves a real task

Choose one high-value task, the minimum inputs and access it needs, and an output the user or calling agent can verify. Start with read-only or draft output where that completes the job. Check actual outputs, the source of each claim, and what happens with missing, invalid, or unauthorized inputs.

- **Public API.** Publish an accurate OpenAPI document where useful. For RFC 9727 discovery, serve a valid linkset at `/.well-known/api-catalog` with the appropriate media type, such as `application/linkset+json` for JSON, and consider a `Link` header with `rel="api-catalog"`. Fetch every target and call representative operations. Bound returned data and inputs, and expose only published data on anonymous routes. [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html)
- **Browser tools.** Feature-detect WebMCP, verify tool availability and input/output behavior in a supporting browser, and preserve the standard page and form experience. For a prefilled draft, assert that the action sends no submission and leaves the final decision to the user. [Chrome WebMCP documentation](https://developer.chrome.com/blog/webmcp-epp)
- **Server tools.** For a protected HTTP MCP service, verify discovery from the real endpoint, its unauthenticated `401` and `WWW-Authenticate` challenge, protected resource metadata, issuer metadata, and minimum scope. Use a compatible real client or SDK to initialize, list and call tools. Test expired, wrong-audience or insufficient credentials and enforce account boundaries on each tool call. Use the exact registered redirect URI when testing OAuth and verify PKCE for a public client. Publish metadata for the endpoints and grants the product actually supports. [MCP authorization specification](https://modelcontextprotocol.io/specification/latest/basic/authorization)
- **Optional discovery.** Consider an MCP Server Card, Agent Skills discovery, Auth.md or A2A only when it describes a working capability and the intended clients support it. Check the adopted version, JSON shape, media type, endpoint and links. For skill indexes that declare digests, hash the exact bytes clients download, check referenced files are available, and publish the complete bundle where the skill needs multiple files. Fetch each discovery route directly to catch successful HTTP responses that contain an HTML fallback. [MCP Server Card extension](https://github.com/modelcontextprotocol/experimental-ext-server-card) · [Agent Skills discovery draft](https://github.com/cloudflare/agent-skills-discovery-rfc) · [Auth.md](https://workos.com/auth-md/docs) · [A2A specification](https://a2a-protocol.org/v1.0.1/specification/)

### DNS discovery and DNSSEC

Use DNS-AID where there is a service to advertise and a client or scanner that understands the record. Verify the owner name and SVCB answer against the supported draft, and distinguish a signed zone from a validated chain. With Cloudflare, use the `cf` CLI by default and follow the project's Wrangler workflow when it has a Wrangler configuration. For DNSSEC, inspect authoritative DNS and confirm the parent DS matches the active signing key. Check whether the registrar publishes it automatically or needs an authorized manual change. After propagation, query the actual discovery name through a trusted validating resolver and check the expected answer and authenticated-data (`AD`) flag. Report pending propagation separately, then rerun the scanner. [DNS-AID draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/) · [Cloudflare DNSSEC](https://developers.cloudflare.com/dns/dnssec/)

## Verify the user outcome before and after release

1. Test public discovery, unauthenticated behavior and the real user workflow as distinct checks. For a protected workflow, prefer synthetic fixtures with predictable results and a test identity when isolation is needed. If an existing authorized account can isolate the necessary synthetic data, it can serve the same test purpose. Read the consent scopes, keep calls limited to approved fixtures, and record identifiers or counts without including private content or tokens. Verify revocation and remove temporary fixtures or grants created for the test where applicable.
2. Test the normal entry point and confirm the answer against known data. Include the boundary most likely to break the workflow, such as older records, ambiguous inputs, missing sources, time zones, denied access, or a failed write. Capture evidence of each completed stage. A successful sign-in and tool listing establish connectivity. Mark workflow verification complete after a tool call returns the expected result.
3. Verify in preview where available, deploy when authorized, and confirm that the expected release serves on the canonical production host. Rerun direct protocol checks, the workflow smoke test and the same scanner profile. Report before and after scores, exact changed checks, task outcomes, any untested stages and remaining limitations.

## Field examples

These are test patterns from the Walkie, Academy UX and Gaia rollout. Reconfirm current availability and behavior when reusing them.

- **Walkie meeting evidence.** Use a synthetic meeting with known transcript segments. Search, fetch, and verify that a citation opens the right authorized meeting at the recorded timestamp. Cover older untimed segments, disabled transcript access, and a meeting owned by a different account. [Walkie MCP](https://trywalkie.com/en/mcp)
- **Academy UX hiring brief.** Turn a buyer's request into an editable draft with role, seniority, engagement, location, budget, timeline and open questions. Check cited salary or case-study URLs and compare the prefill to the actual form options. Verify that the form remains unsubmitted. [Academy UX API catalog](https://www.academyux.com/.well-known/api-catalog)
- **Gaia caregiver handoff.** Produce a read-only summary for one authorized child over a named interval in an explicit IANA time zone. Verify against synthetic event records, including another child, sleep spanning the window edge and missing data. Keep observations distinguishable from gaps and confirm another family's records are inaccessible. [Gaia MCP](https://gaiababy.app/mcp)
