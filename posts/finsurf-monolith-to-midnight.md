---
title: 'From Monolith to Midnight'
date: '2026-03-20'
highlight: true
excerpt: 'A single day that spanned a 48-file backend overhaul, a Cloudflare Worker battle at 11 PM, and a feature lock at midnight. This is what shipping actually looks like.'
tags: ['FinSurf', 'Engineering']
series: "FinSurf"
series_position: 4
---

March 20th was a ship day. Not the kind you plan on a roadmap with neat milestones — the kind where you start the morning decomposing a monolith and end the night committing a feature lock at midnight. Forty-eight files changed. 4,300+ lines touched. Backend architecture, security infrastructure, admin tooling — all in one push.

This is the story of that day.

## Breaking the Monolith

FinSurf's backend had grown organically, as backends do. The centerpiece was `data_fetcher.py` — a 1,000-line monolith that handled everything: YFinance calls, Finnhub data, SEC/EDGAR filings, social sentiment. It worked, but it was becoming unmaintainable.

The refactor decomposed it into focused modules under `backend/data/`:

- `yfinance_fetcher.py` — market data
- `finnhub.py` — analyst ratings and news
- `edgar.py` — SEC filings
- `social.py` — sentiment analysis

![Early FinSurf UI with source links cut off — a symptom of the convoluted monolith](/blog/images/finsurf-source-links-cut-off.png)
*A visible symptom of the monolith: source attribution truncated, the kind of bug that hides in tightly-coupled code*

Each module got its own formatter and cache layer (`_formatters.py`, `_cache.py`). The separation wasn't just cosmetic — it meant each data source could fail, cache, and retry independently. A Finnhub rate limit no longer blocked EDGAR lookups.

On the frontend side, I created `src/utils/apiFetch.ts` — a centralized fetch wrapper so every API call flows through one place for auth headers and error handling. Small utility, big payoff. And as part of production hardening, I cut the Reddit API dependency entirely. It wasn't pulling its weight relative to its cost.

Testing got real, too. I expanded `test_data_fetcher.py` from a handful of cases to 477+ lines, added `vitest` and `jest-axe` accessibility tests (174 lines in `accessibility.test.tsx`), and wrote new telemetry tests. If I was going to break apart the engine, I needed to know when something fell out of place.

## The Cloudflare Worker Battle

This section isn't a clean tutorial. It's what real deployment looks like.

At 10 PM, I deployed a brand-new Cloudflare Worker — 64 lines of TypeScript in `worker/index.ts` — as an edge proxy in front of the origin server. The Worker handles three things:

1. **Bearer token auth** on all `/api/` routes
2. **IP-based rate limiting** via Cloudflare KV (100 requests per 15-minute window)
3. **Passthrough** for `/health` (Docker healthcheck)

The architecture: **User → Cloudflare Worker (auth + rate limit) → Caddy (reverse proxy + TLS) → Express/Node → FastAPI/Python**

Simple on paper. Not simple in practice.

![Cloudflare KV dashboard showing FINSURF_KV namespace with 8 reads and 5 writes](/blog/images/cloudflare-finsurf-kv-dashboard.png)
*The KV store powers the rate limiter — every request gets checked against this state*

**10:13 PM – 10:45 PM:** Three rapid-fire partial fixes to `wrangler.toml`. The Worker kept breaking in deployment — route config wrong, origin URL wrong, environment bindings missing. Each fix required a redeploy, a test, and another fix.

**11:04 PM:** The origin redirect loop. The Worker was proxying requests back to itself. I had to fix the Caddyfile reverse proxy config alongside the Worker routes to break the cycle. Debugging redirect loops at 11 PM is a special kind of patience exercise.

**11:17 PM:** Cloudflare Insights broke. The Worker changed the response headers, which invalidated the Content Security Policy hash. Had to update the CSP in `server.ts` to restore analytics.

Four commits in one hour. Each one a small fire extinguished. This is the part of engineering that never makes it into architecture diagrams.

## The Admin Panel

With the backend restructured and the edge layer in place, I built the admin panel — `routes/adminRouter.ts`, 216 lines of dashboard functionality:

- **Stats endpoint** — system health at a glance
- **VIP pass management** — generate and manage VIP access codes
- **Manual agent runs** — trigger analysis pipelines on demand
- **Bearer token auth middleware** (`requireAdmin`)

The VIP code generation was the feature I was most excited about. Being able to spin up access codes through a clean admin interface — just hit the endpoint, get a code, hand it to someone — felt like a real product moment. It came together cleanly, and that's rare enough to be worth celebrating.

But shipping it wasn't without friction. In production, I hit a 401 bug because the admin HTML shell was sitting behind the auth middleware. The fix: serve the HTML without auth and load all data client-side via authenticated API calls. Separation of concerns, again.

Then there was `prompt()`. I'd originally used the browser's built-in `prompt()` dialog for the admin login. Some browsers block it. Modern security policies are increasingly hostile to `prompt()` and `alert()`. Replaced it with an inline login form — better UX, no browser interference.

## The Containerization Gotcha

One bug deserves its own section because it's a classic.

The timezone handling worked locally. Worked in Ubuntu-based Docker. Broke silently on Alpine Linux. `America/New_York` failed because Alpine is so minimal it doesn't ship `tzdata` by default. The fix was one line in the Dockerfile:

```
RUN apk add --no-cache tzdata
```

One line. But finding it meant tracing a silent failure through container logs, realizing the timestamps were wrong, and then remembering that Alpine's minimalism is both its strength and its trap.

![RKLB stock report with timezone error in both Research Analyst and Tax Strategist cards](/blog/images/finsurf-rklb-timezone-error.png)
*The Alpine tzdata failure manifested here — agents couldn't initialize because the timezone library was missing*

## Locking the Gate

At midnight, I committed the feature lock in `server.ts`. The commit message tells the story:

> *"This is to lock new features. NO MORE PUBLIC FEATURES to be released as of 3-20-26"*

The day started with architecture and ended with closing the gate. A full arc — from building to shipping to saying "enough." That discipline, knowing when to stop adding and start hardening, might be the most important engineering skill that nobody talks about.

---

Ship days aren't glamorous. They're messy, iterative, and full of 11 PM redirect loops. But when you look back at the commit history and see the trajectory — monolith to modules, no auth to edge security, no admin to VIP code generation — that's when it hits you.

You built something real.

---

**Keep Reading:**
- [What Not to Log](./owasp-hardening-solo-project) — The security audit that covered the VIP code system I shipped in this session
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — The full product architecture this shipping day contributed to