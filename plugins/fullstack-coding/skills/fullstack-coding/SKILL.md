---
name: fullstack-coding
description: Systematic full-stack web development with emphasis on code quality, architecture, and debugging. Use this skill whenever the user asks to build, debug, refactor, or architect a web application, API, component, or feature. Triggers include any coding task involving frontend (React, Vue, Svelte, HTML/CSS), backend (Node.js, Python, serverless functions, REST/GraphQL APIs), databases, deployment, CI/CD, or dev tooling. Also use when the user asks to review code, diagnose a bug, set up a project, choose between technical approaches, or write tests. If the user says "build," "fix," "debug," "refactor," "deploy," "scaffold," or discusses any technical architecture decision, use this skill. Even if the request seems simple, consult this skill to ensure consistent quality patterns are applied.
---

# Full-Stack Web Development

Systematic approach to building, debugging, and architecting web applications. Every coding task follows the same core loop: understand → plan → build → verify → refine.

## The Core Loop

Every task, no matter how small, passes through this:

1. **Understand** — What exactly needs to happen? What are the constraints? What already exists?
2. **Plan** — What's the approach? What could go wrong? What's the simplest thing that works?
3. **Build** — Write the code. Small, verifiable steps. Commit logical units.
4. **Verify** — Does it work? Does it handle edge cases? Does it fail gracefully?
5. **Refine** — Is it readable? Would someone else understand this in 6 months? Any dead code?

For small tasks (fix a bug, add a field), this loop takes 30 seconds of thought. For large tasks (new feature, architecture change), each step gets real attention.

---

## Project Understanding

Before writing any code, orient yourself in the codebase:

**Read before you write.** When working in an existing project:
- Check the project root for config files (package.json, tsconfig, .env.example, docker-compose) to understand the stack
- Look at the directory structure to understand conventions already in use
- Read existing code in the area you're modifying to match patterns
- Check for a README, CONTRIBUTING.md, or docs/ folder

**Ask the right questions when context is missing:**
- What's the runtime environment? (Browser, Node, edge, serverless)
- What's already installed? (Don't add axios if they're using fetch; don't add lodash for one function)
- Are there existing patterns for this? (How are other API routes structured? How are other components organized?)
- What's the deployment target? (Affects build config, env vars, runtime constraints)

**Don't assume the stack.** Ask or infer from the codebase. If the user doesn't specify, ask before defaulting. Common stacks to recognize: Next.js (App Router vs Pages), Remix, Astro, SvelteKit, Nuxt, Express, Fastify, Django, Rails, Laravel, Spring Boot.

---

## Architecture Decisions

Good architecture is about managing complexity over time. These principles apply regardless of framework.

### File & Folder Structure

Organize by feature, not by type. This scales better as projects grow.

```
# Prefer this (feature-based)
src/
  auth/
    login-form.tsx
    auth-provider.tsx
    use-auth.ts
    auth.test.ts
  billing/
    pricing-table.tsx
    checkout-flow.tsx
    use-subscription.ts

# Over this (type-based)
src/
  components/
    LoginForm.tsx
    PricingTable.tsx
    CheckoutFlow.tsx
  hooks/
    useAuth.ts
    useSubscription.ts
```

Feature-based grouping means when you work on auth, everything you need is in one place. When you delete a feature, you delete one folder. When you onboard someone, you point them to one directory.

Exceptions exist: shared utilities, design system components, and config files naturally live in shared locations. Use judgment.

### Separation of Concerns

Keep these layers distinct:

- **UI** — What the user sees. Components, layouts, styles. No business logic.
- **State** — Application state management. How data flows and updates.
- **Data** — API calls, database queries, external services. How data enters and exits.
- **Logic** — Business rules, validation, transformations. Pure functions where possible.

When these blur together, bugs hide and refactoring becomes painful. A component that fetches data, transforms it, manages its own state, and renders UI is doing four jobs. Split it up.

### API Design

Whether REST or GraphQL, consistent API design prevents confusion downstream.

**Naming:** Use nouns for resources, verbs for actions. `/users/:id` not `/getUser`. Keep it predictable.

**Error responses:** Return structured errors with enough context to debug. Include an error code (machine-readable), a message (human-readable), and relevant field names for validation errors.

**Versioning:** Have a strategy before you need one. URL-based (`/v1/users`) is simplest. Header-based is cleaner but harder to test casually.

**Pagination:** Cursor-based pagination scales better than offset-based for large datasets. Offset is fine for small, static lists.

### Database Patterns

- **Migrations over manual changes.** Always. Even for "just this one column."
- **Index the queries you actually run.** Don't guess; look at slow query logs or explain plans.
- **Validate at the boundary.** Validate data when it enters your system (API handlers, form submissions), not deep inside business logic.
- **Soft delete when you might need the data.** Add a `deleted_at` timestamp; filter it in queries. Hard delete is permanent.

---

## Code Quality Patterns

These patterns prevent the most common classes of bugs and tech debt.

### Error Handling

Errors are not exceptional; they're expected. Handle them intentionally.

**Categorize errors by who can fix them:**
- **User errors** (400s) — Bad input, missing fields, invalid state. Show the user what's wrong and how to fix it.
- **System errors** (500s) — Database down, third-party API failed, OOM. Log everything, show the user a graceful fallback.
- **Programmer errors** — Type mismatches, null references, logic bugs. These should be caught by types and tests before production.

**Patterns:**
- Use typed error classes or result types instead of throwing raw strings
- Catch errors at the boundary (API handler, component error boundary), not in every function
- Log with context: what was the user doing, what were the inputs, what was the state?
- Never swallow errors silently. `catch (e) {}` is a bug waiting to happen.

**Frontend error boundaries:**
- Wrap route-level components in error boundaries
- Show useful fallback UI, not blank screens
- Include a retry mechanism where it makes sense
- Report errors to your monitoring service

### TypeScript Patterns

Types are documentation that the compiler enforces. Use them well.

**Practical type safety:**
- Type your API responses. Don't use `any` for data from external sources; define the shape and validate at the boundary.
- Use discriminated unions for state machines (loading | success | error, not three separate booleans).
- Prefer `unknown` over `any` when you genuinely don't know the type. It forces you to narrow before using.
- Use `as const` for literal types. Use `satisfies` to check a value against a type without widening.

**Types to avoid:**
- `any` — Almost never necessary. Use `unknown` and narrow.
- Overly complex generics — If a type is harder to read than the code it protects, simplify it.
- Premature type parameters — Don't make a function generic until you need it in two places with different types.

### Testing Strategy

Test the behavior, not the implementation. Focus testing effort where bugs are most costly.

**What to test, in priority order:**
1. **Critical paths** — Auth flows, payment processing, data mutations. If this breaks, the business suffers.
2. **Complex logic** — Functions with multiple branches, edge cases, transformations. Pure functions are easy to test.
3. **Integration points** — API calls, database queries, third-party services. Mock the boundary, test the integration.
4. **UI interactions** — User flows that involve multiple steps. Use integration tests over unit tests for components.

**What not to test:**
- Implementation details (did this function call that function?)
- Simple getters/setters with no logic
- Framework internals (does React render correctly?)
- Style properties (does this have the right color?)

**Test structure:**
```
describe('[what you are testing]', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange — set up the scenario
    // Act — perform the action
    // Assert — verify the result
  });
});
```

Name tests so that when they fail, you know what's broken without reading the test body.

---

## Debugging Workflow

Systematic diagnosis beats random changes every time. When something breaks:

### 1. Reproduce Reliably

Before fixing anything, get the bug to happen on demand. If you can't reproduce it, you can't verify the fix.

- Get the exact steps, inputs, and environment
- Check if it's consistent or intermittent
- Narrow the scope: does it happen in all browsers? All environments? With all data?

### 2. Isolate the Layer

Web apps have clear boundaries. Figure out which layer is broken:

| Symptom | Start looking at |
|---------|-----------------|
| Nothing renders | Console errors, component tree, hydration |
| Wrong data displayed | API response, state management, data transform |
| API returns error | Request payload, server logs, database query |
| Works locally, fails deployed | Environment variables, build config, runtime differences |
| Intermittent failures | Race conditions, caching, concurrent state mutations |
| Performance degradation | Network waterfall, re-renders, N+1 queries, missing indexes |

### 3. Read the Actual Error

This sounds obvious but most debugging time is wasted by not reading carefully.

- Read the full stack trace, not just the first line
- Check the error type (TypeError, ReferenceError, etc.) — it tells you the category of problem
- Look at the line numbers and file names in the trace
- Search for the exact error message if it's unfamiliar

### 4. Form a Hypothesis

Based on what you've isolated, form a specific theory: "The API is returning null for `user.email` because the OAuth provider doesn't include email in the default scope."

Then test the hypothesis with the smallest possible change. Don't fix three things at once.

### 5. Verify the Fix

- Confirm the original bug is gone
- Confirm you haven't broken anything adjacent
- Add a test if the bug was in a critical path
- If the fix was non-obvious, add a comment explaining why

### Common Debugging Tools

- **Browser DevTools** — Network tab (check requests/responses), Console (errors and logs), Elements (DOM state), Performance (bottlenecks), Application (storage, cookies)
- **Server logs** — Structured logging with request IDs lets you trace a request through the system
- **Database query logs** — Slow query log, explain/analyze for query plans
- **Git bisect** — When you know it worked before but not when it broke. Binary search through commits.
- **Minimal reproduction** — Strip everything away until the bug disappears, then add back until it returns. The last thing you added is the cause.

---

## Performance Patterns

Performance work is about measuring, then fixing. Never optimize without profiling first.

### Frontend Performance

**The critical rendering path:**
- Minimize blocking resources (CSS in head, JS deferred or async)
- Optimize Largest Contentful Paint (LCP): preload hero images, avoid layout shift
- Reduce Time to Interactive (TTI): code-split, lazy-load below the fold

**Common wins:**
- Image optimization (WebP/AVIF, responsive sizes, lazy loading)
- Code splitting by route
- Debounce expensive operations (search inputs, resize handlers)
- Memoize expensive computations (but profile first; unnecessary memoization adds complexity)
- Virtualize long lists (render only what's visible)

### Backend Performance

**Database is usually the bottleneck:**
- Use explain/analyze on slow queries
- Add indexes for frequent WHERE/JOIN/ORDER BY columns
- Avoid N+1 queries (fetch related data in bulk, not per-row)
- Cache expensive queries (but have an invalidation strategy)

**API response times:**
- Set and monitor latency budgets (p50, p95, p99)
- Use connection pooling for databases
- Paginate responses; never return unbounded lists
- Consider edge caching for read-heavy endpoints

---

## Security Essentials

These are non-negotiable. Every full-stack app needs them.

- **Validate all input.** Server-side validation is mandatory. Client-side validation is a UX convenience, not a security measure.
- **Parameterize all queries.** Never concatenate user input into SQL, shell commands, or template strings that get executed.
- **Escape output.** Use your framework's built-in escaping. If you're using `dangerouslySetInnerHTML` or equivalent, sanitize first.
- **Use HTTPS everywhere.** No exceptions.
- **Hash passwords with bcrypt/scrypt/argon2.** Never store plaintext. Never roll your own crypto.
- **Manage secrets properly.** Environment variables, not hardcoded. Different secrets per environment. Rotate periodically.
- **CORS and CSP.** Configure Content Security Policy and CORS headers. Don't use `*` in production.
- **Auth tokens.** Use short-lived JWTs or session tokens. Store in httpOnly cookies, not localStorage. Implement refresh token rotation.
- **Rate limiting.** On auth endpoints especially. On any public API generally.

---

## Deployment & DevOps

### Environment Management

Maintain clear separation between environments:
- **Development** — Local, hot reload, verbose logging, seed data
- **Staging** — Mirrors production config, real-ish data, used for final verification
- **Production** — Locked down, minimal logging, real data, monitoring active

**Environment variables:** Use `.env.example` (committed) as a template. Never commit `.env` files with real values. Validate required env vars at startup so the app fails fast if something's missing.

### CI/CD Principles

- Run tests on every PR. Block merge if tests fail.
- Lint and type-check in CI, not just locally.
- Keep the pipeline fast. Parallelize where possible. Cache dependencies.
- Deploy to staging automatically on merge to main. Deploy to production with a manual gate or after staging verification.
- Use preview deployments for PRs when available (Vercel, Netlify, Cloudflare Pages all support this).

### Monitoring

Ship with observability from day one:
- **Error tracking** — Catch and report unhandled exceptions (Sentry, Bugsnag, etc.)
- **Uptime monitoring** — Know when your app is down before users tell you
- **Performance monitoring** — Track response times, error rates, throughput
- **Logging** — Structured logs with request IDs for tracing

---

## Code Review Checklist

When reviewing code (your own or others'), check in this order:

1. **Does it work?** Does it solve the stated problem? Does it handle the edge cases?
2. **Is it safe?** SQL injection, XSS, auth bypass, secrets exposure?
3. **Is it correct?** Race conditions, off-by-one errors, null handling, error paths?
4. **Is it readable?** Could someone unfamiliar with this feature understand it? Are names descriptive?
5. **Is it maintainable?** If requirements change, how much needs to change? Is it DRY without being abstract for abstraction's sake?
6. **Is it tested?** Are the critical paths covered? Are the tests testing behavior, not implementation?

---

## Refactoring Guide

Refactor when the code is correct but hard to work with. Never refactor and change behavior in the same commit.

**When to refactor:**
- You need to add a feature and the current structure makes it hard
- You've fixed the same type of bug in the same area more than twice
- A new team member can't understand a module after a reasonable effort
- You're about to duplicate logic that already exists in a different form

**When not to refactor:**
- It works, it's readable, and you're not going to touch it again soon
- You're on a deadline and the refactor isn't blocking the feature
- The refactor is aesthetic preference, not a structural improvement

**Safe refactoring steps:**
1. Write tests that capture current behavior (if they don't exist)
2. Make the structural change
3. Verify tests still pass
4. Commit the refactor separately from feature work

---

## Working With External APIs

Third-party APIs fail. Plan for it.

- **Timeouts** — Set explicit timeouts on every external call. Default to 5-10 seconds.
- **Retries** — Retry on transient errors (5xx, network timeout) with exponential backoff. Don't retry on 4xx.
- **Circuit breaker** — If a service is consistently failing, stop calling it temporarily. Fall back to cached data or a degraded experience.
- **Response validation** — Don't trust external responses. Validate the shape before using it. APIs change without warning.
- **Logging** — Log request/response metadata (not sensitive data) for debugging. Include latency.

---

## Reference Files

For deeper dives on specific topics, check the references directory:

- `references/project-scaffolding.md` — Templates and checklists for starting new projects from scratch, including common config files, initial folder structure, and bootstrap commands for popular frameworks.
