# Project Scaffolding Reference

Checklists and patterns for starting new projects. Use this when the user asks to scaffold, bootstrap, or set up a new project from scratch.

## Universal Setup Checklist

Regardless of framework, every new project should have:

- [ ] Version control initialized (git init, .gitignore)
- [ ] README.md with: what it is, how to run it, how to deploy it
- [ ] .env.example with all required environment variables documented
- [ ] Linting configured and enforced (ESLint, Prettier, Biome, or equivalent)
- [ ] Type checking configured (TypeScript, mypy, or equivalent)
- [ ] A single command to start development (`npm run dev`, `make dev`, etc.)
- [ ] A single command to run tests (`npm test`, `make test`, etc.)
- [ ] CI pipeline that runs lint + types + tests on every PR
- [ ] Error handling strategy decided (error boundaries, global handler, etc.)
- [ ] Logging configured (structured, with levels)

## Common .gitignore Entries

```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.next/
.turbo/
.vercel/
*.log
.DS_Store
coverage/
.cache/
```

## Package.json Scripts Convention

Keep scripts predictable. Anyone on the team should be able to guess the command.

```json
{
  "scripts": {
    "dev": "starts local development server",
    "build": "creates production build",
    "start": "runs production build",
    "test": "runs test suite",
    "test:watch": "runs tests in watch mode",
    "lint": "runs linter",
    "lint:fix": "runs linter with auto-fix",
    "typecheck": "runs type checker",
    "db:migrate": "runs database migrations",
    "db:seed": "seeds the database",
    "db:reset": "resets database and re-seeds"
  }
}
```

## TypeScript Configuration Baseline

Start with strict mode. Loosening later is easier than tightening.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

Extend with framework-specific settings (Next.js, Remix, etc. each have their own tsconfig recommendations).

## Environment Variables Pattern

```bash
# .env.example — committed to repo, documents all vars

# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp_dev
SESSION_SECRET=generate-a-random-string-here

# Optional (with defaults)
PORT=3000
LOG_LEVEL=debug

# Third-party services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

Validate env vars at startup:

```typescript
// env.ts — import this, not process.env directly
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  SESSION_SECRET: requireEnv('SESSION_SECRET'),
  PORT: process.env.PORT ?? '3000',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
} as const;
```

## Monorepo vs Single Repo Decision

**Use a single repo when:**
- One deployable unit (a web app with an API)
- Small team (1-5 people)
- Shared deployment pipeline
- Getting started (don't pre-optimize)

**Consider a monorepo when:**
- Multiple deployable units that share code (web + mobile + API)
- Shared component library across apps
- Team is large enough that separate repos would cause coordination overhead

**Tools if you go monorepo:** Turborepo (simple, fast), Nx (full-featured, more config), pnpm workspaces (lightweight).

## Database Setup Patterns

### SQL (PostgreSQL, MySQL, SQLite)

Pick an ORM/query builder based on preference:
- **Prisma** — Great DX, schema-first, good for rapid development
- **Drizzle** — TypeScript-native, closer to SQL, lighter weight
- **Kysely** — Type-safe query builder, no schema DSL
- **Raw SQL** — For simple apps or when you need full control

Always use migrations. Always.

### Document stores (MongoDB, DynamoDB)

- Design your access patterns first, then design your schema
- Denormalize intentionally (reads over writes)
- Plan for data growth from day one

## Auth Patterns

Don't roll your own auth unless you have a specific reason. Use a provider:

- **Auth.js (NextAuth)** — Good for Next.js; supports many providers
- **Clerk** — Hosted auth; fast to integrate, good UI components
- **Supabase Auth** — If you're already using Supabase
- **Lucia** — Lightweight, flexible, you own the session store
- **Firebase Auth** — If you're in the Firebase ecosystem

If you must build auth:
1. Use bcrypt/scrypt/argon2 for password hashing
2. Store sessions server-side with httpOnly cookies
3. Implement CSRF protection
4. Add rate limiting on login/register endpoints
5. Support MFA from the start (easier than adding later)

## Deployment Quick Reference

| Platform | Best for | Deploy command | Notes |
|----------|----------|---------------|-------|
| Vercel | Next.js, frontend | `vercel` or git push | Edge functions, preview deploys |
| Cloudflare Workers | Edge-first, low latency | `wrangler deploy` | V8 isolates, not Node |
| Railway | Full-stack, databases | git push | Easy DB provisioning |
| Fly.io | Docker-based, global | `fly deploy` | Good for long-running processes |
| AWS (ECS/Lambda) | Enterprise, complex infra | varies | Most flexible, most config |
| Render | Simple full-stack | git push | Good free tier, straightforward |

## Starter Checklist by Project Type

### API Service
- [ ] Framework chosen and initialized
- [ ] Route structure planned
- [ ] Database and ORM set up
- [ ] Auth middleware configured
- [ ] Error handling middleware
- [ ] Request validation (zod, joi, etc.)
- [ ] CORS configured
- [ ] Rate limiting on sensitive endpoints
- [ ] Health check endpoint (`/health`)
- [ ] Structured logging
- [ ] API documentation approach chosen (OpenAPI, tRPC, etc.)

### Web Application (Full-Stack)
- [ ] Everything from API Service above
- [ ] UI framework and component library chosen
- [ ] Layout and routing structure planned
- [ ] Auth flow (login, register, forgot password) built or integrated
- [ ] Error boundaries at route level
- [ ] Loading states and skeletons
- [ ] SEO basics (meta tags, OpenGraph, sitemap)
- [ ] Analytics integrated
- [ ] Responsive design verified on mobile

### Static Site / Marketing Page
- [ ] Framework chosen (Astro, Next.js static, Hugo, etc.)
- [ ] Content strategy (CMS, MDX, hardcoded)
- [ ] SEO optimized (meta, OG, structured data, sitemap)
- [ ] Performance budget set
- [ ] Forms connected (contact, newsletter)
- [ ] Analytics integrated
- [ ] Deployed with CDN
