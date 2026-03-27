# FinSurf — Dev Log Source

> Export this file to your blog repo as source material for dev log entries.
> Last updated: March 26, 2026

---

FinSurf is a solo-built stock analysis tool that runs a multi-agent AI pipeline — research, tax, dividend, sentiment, and executive summary — and streams results to the browser as they complete. Built with React + TypeScript on the frontend, Python + LangGraph on the backend, deployed on a DigitalOcean droplet behind a Cloudflare Worker.

---

## Engineering Decisions

### 1. Python for arithmetic, LLMs for explanation

Early versions asked the LLM to calculate dividend projections. Outputs looked plausible but were frequently wrong in compounding ways. Fix: Python handles all arithmetic (P&L, yield, payout ratio, holding period); the LLM handles explanation only. This pattern applies anywhere financial precision matters.

### 2. LangGraph over CrewAI for conditional workflows

For workflows where one agent's output determines whether another runs at all (e.g., skip dividend analysis for non-dividend stocks), LangGraph's explicit state management is worth the steeper learning curve. CrewAI is faster to start; LangGraph gives the routing control you need when logic gets complex.

### 3. Rules-based signal engine (zero tokens)

The market signal (Bullish / Neutral / Bearish) is derived deterministically from P/E, beta, analyst targets, and revenue growth — no LLM involved. This keeps output consistent, auditable, and free. The LLM narrates the signal; it does not produce it.

### 4. PDF generation from Tailwind CSS 4 requires a custom color resolver

`html2canvas` predates CSS custom properties and the `oklch` color space. Generating PDFs from a Tailwind CSS 4 app requires building a color-resolution utility early — before it becomes a last-minute blocker.

### 5. Timestamp badges build trust without backend complexity

Each agent card shows data freshness ("Just now", "2 minutes ago", amber warning for data older than 1 hour). The backend sends a timestamp with every response; the frontend renders it via a badge component that auto-updates every minute. Zero extra API calls.

### 6. Two caching layers serve different problems

The data layer uses a Python disk cache (JSON-backed, 15-min TTL per ticker) to avoid re-hitting yfinance and Finnhub on repeat queries. The Express server adds an in-memory LRU cache (200-entry max, 15-min TTL) for full analysis results — so a second search for the same ticker within the window skips the entire Python pipeline. Two different layers, two different problems: the disk cache protects external API rate limits; the LRU protects compute cost.

### 7. VIP pass auth without a user database

Rather than building auth infrastructure (accounts, passwords, JWTs), FinSurf uses single-use pass codes (`FINSURF-XXXXXXXX`) generated on payment success. The server holds passes in memory (plus a flat file for persistence across restarts), validates via an `X-FinSurf-Pass` header, and emails the code via Resend on Stripe webhook. No user table, no sessions, no OAuth flow. The tradeoff: passes can't be revoked without a server restart unless you use the admin API — acceptable for a one-time-payment product.

### 8. VITE_ environment variables are not secrets

Anything prefixed `VITE_` gets baked into the JavaScript bundle at build time — visible to anyone who opens DevTools. FinSurf originally used `VITE_APP_SECRET` to inject an `Authorization: Bearer` header on every API call, with the Cloudflare Worker validating it. The secret was readable in the bundle. Removing it entirely and relying on rate limiting (100 req/15-min per IP via Cloudflare KV) is more honest — and as a side effect, the build no longer generates a Vite-injected inline script, which eliminated a recurring CSP hash maintenance problem.

### 9. Stripe Elements and Content Security Policy don't play nicely

Adding `https://js.stripe.com` to `script-src` isn't enough. Stripe's library injects inline scripts for fraud detection when the payment form mounts — scripts you can't predict or hash because Stripe changes them. The hash-based approach (which worked for Vite's inline bootstrap script) breaks every time Stripe updates. For a static site without server-side nonce injection, `'unsafe-inline'` in `script-src` is the only maintainable solution. The tradeoff is accepted because the page has no user-generated content and the XSS surface is low.

### 10. Rules-based financial risk flags (Blind Spot Detector)

Same philosophy as the signal engine (#3): Python computes, LLM narrates. The Blind Spot Detector runs debt-to-equity (>200% = severe, >100% = elevated) and consecutive quarterly EPS decline checks in `compute_signal()` and returns a separate `flags` list alongside the signal rationale. The frontend renders flags in a distinct orange "Blind Spots" section only when present. Adding a new flag is a 5-line Python change — no prompt engineering, no token cost.

### 11. Testing a Stripe-integrated frontend without hitting the live API

Stripe's `<Elements>` component requires a `clientSecret` from a real payment intent to render. For unit tests, mock the entire `@stripe/react-stripe-js` module and test the surrounding UI (error states, step transitions, pass code validation) independently. For integration testing, use `stripe trigger payment_intent.succeeded` with the Stripe CLI and test keys — it fires a fully signed webhook event without charging anyone. The two layers test different things: unit tests catch UI regressions; the CLI trigger verifies the server-side webhook handler, pass generation, and email flow end-to-end.

### 12. Solo development: owning every layer

Building FinSurf solo means touching Python data pipelines, TypeScript components, Express routing, Docker configs, Cloudflare Workers, and CI/CD in the same week. The risk isn't capability — it's over-relying on AI to fill gaps rather than learning them. The goal is to make every meaningful decision deliberately: understand what the code does, why the architecture is structured that way, and what breaks if you change it. AI is useful for acceleration and catching errors; the understanding has to be yours. A good test: can you explain the production deployment pipeline, the auth model, and the caching strategy off the top of your head? If not, that's the next thing to learn.

### 13. Learning security by doing it: OWASP hardening on a solo project

I'd shipped the VIP pass system and Stripe integration without thinking much about security beyond "it works." The pass codes were stored in plaintext, the admin panel had no lockout, and there was a hardcoded default pass (`FINSURF_BETA_2026`) baked into the server as a fallback. None of that felt alarming at the time — it was a small app, one developer, one user at a time. Then I actually sat down with the OWASP Top 10 and matched each item against the codebase.

The first thing I changed was pass hashing. I'd stored VIP codes as plaintext in an env var — if someone ever read that env var, they had all the passes. SHA-256 is the right call here, and importantly, it's *not* the same situation as passwords: these codes are 48 bits of random hex, not dictionary words, so the brute-force concern that makes bcrypt necessary for passwords doesn't apply. The tricky UX consequence was that once you hash at rest, you can never show the plaintext again — so the admin panel had to change. It now shows the plain code exactly once on generation with a "save this" warning, then only ever shows the first 16 characters of the hash. That "show once" constraint forced a cleaner design.

The part that taught me the most was auth logging. I added structured JSON logging to every auth event — admin login attempts, pass validations, failed lookups. The key decision was what *not* to log: I deliberately omit the pass value from the log line even on failures. It seems obvious in retrospect, but it's easy to write `console.log("invalid pass:", pass)` when you're debugging and leave it there. If a pass validation attempt ever shows up in logs, I want to know the IP, the timestamp, and the outcome — not the credential. The logs now look like `{"event":"auth","result":"pass_invalid","ip":"x.x.x.x","ts":1234567890}`. That format is also grep-friendly if I'm ever scanning for a spike in failures.

The admin panel got a separate per-IP lockout: 5 failed auth attempts triggers a 15-minute cooldown. This is distinct from the rate limiter on the analysis endpoints. The analysis limiter (`express-rate-limit` at 200 req/15min/IP) is a backstop — Cloudflare is the real enforcer at the edge, but if someone hits the origin server directly, bypassing the Worker, they'd have had no limit. Layering is deliberate: the edge handles normal traffic, the server-side limit is the fallback.

One cleanup that felt overdue: removing the hardcoded default pass. The server used to fall back to `FINSURF_BETA_2026` if `VIP_PASSES` wasn't set. That means a misconfigured production deploy would silently accept any request with that code. Now it fails fast — `process.exit(1)` on startup if production is running without `VIP_PASSES` configured. Same for `CORS_ORIGIN` and `HTTPS`: both now emit startup warnings in production if missing. I'd rather see a loud failure at deploy time than a quiet misconfiguration in production.

### 14. The CI break that worked fine locally: wrangler's assets.directory

This one cost me more time than it deserved. Cloudflare's `wrangler` 4.77.0 changed to require `assets.directory` to be explicitly set in `wrangler.jsonc`. Local builds had been working because running `npm run build` generates a `dist/wrangler.json` that includes `"directory": "."` — the build artifact contains its own config. CI runs from the repo root, uses `wrangler.jsonc` directly, and that file had no `directory` set. The deploy passed locally every time and failed in CI every time. Fix was one line: `"directory": "dist"` in `wrangler.jsonc`. The lesson is less about Wrangler specifically and more about the gap between a build-artifact config and a source-controlled config — if your local flow generates config at build time, make sure CI is using the same effective config.
