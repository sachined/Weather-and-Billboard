# FinSurf — Dev Log Source

> Export this file to your blog repo as source material for dev log entries.
> Last updated: March 29, 2026

---

FinSurf is a solo-built stock analysis tool that runs a multi-agent AI pipeline — research, tax, dividend, sentiment, and executive summary — and streams results to the browser as they complete. Built with React + TypeScript on the frontend, Python + LangGraph on the backend, deployed on a DigitalOcean droplet behind a Cloudflare Worker.

---

## Engineering Decisions

### 1. PDF generation from Tailwind CSS 4 requires a custom color resolver

`html2canvas` predates CSS custom properties and the `oklch` color space. Generating PDFs from a Tailwind CSS 4 app requires building a color-resolution utility early — before it becomes a last-minute blocker.

### 2. VITE_ environment variables are not secrets

Anything prefixed `VITE_` gets baked into the JavaScript bundle at build time — visible to anyone who opens DevTools. FinSurf originally used `VITE_APP_SECRET` to inject an `Authorization: Bearer` header on every API call, with the Cloudflare Worker validating it. The secret was readable in the bundle. Removing it entirely and relying on rate limiting (100 req/15-min per IP via Cloudflare KV) is more honest — and as a side effect, the build no longer generates a Vite-injected inline script, which eliminated a recurring CSP hash maintenance problem.

### 3. Stripe integration: CSP conflicts and testing without the live API

Stripe's `<Elements>` component injects unpredictable inline scripts for fraud detection that break hash-based CSP. For a static site without server-side nonce injection, `'unsafe-inline'` in `script-src` is the only maintainable solution — acceptable here because there's no user-generated content and the XSS surface is low.

For testing without hitting the live API: mock `@stripe/react-stripe-js` for unit tests to validate UI independently. For integration tests, use `stripe trigger payment_intent.succeeded` with the Stripe CLI — fires a fully signed webhook without charging. One gotcha: the CLI generates its own webhook signing secret (`whsec_...`) distinct from the Dashboard's, so swap back to the production secret before deploying.

### 4. Solo development: owning every layer

Building FinSurf solo means touching Python data pipelines, TypeScript components, Express routing, Docker configs, Cloudflare Workers, and CI/CD in the same week. The risk isn't capability — it's over-relying on AI to fill gaps rather than learning them. The goal is to make every meaningful decision deliberately: understand what the code does, why the architecture is structured that way, and what breaks if you change it. AI is useful for acceleration and catching errors; the understanding has to be yours. A good test: can you explain the production deployment pipeline, the auth model, and the caching strategy off the top of your head? If not, that's the next thing to learn.

### 5. Personal branding leaks into code more than you expect

When a project's intent shifts (personal → product), the code doesn't shift with it. I found personal branding in six places: the banner ("I build custom AI tools..."), modals ("Want your own tool?"), pricing copy ("Built by one person"), About page (entirely a bio), hardcoded email addresses, and even the domain (finsurf.ai vs finsurf.net). The audit had to be user-facing—navigating files by architecture missed copy that had been stale for months. The rule: every surface a user reads is a potential leak of the old intent.

### 6. Three tiers: signal detection, flag detection, narrative synthesis

The risk pipeline follows the pattern: Python detects, rules flag, the LLM translates. Example — the Blind Spot Detector:

- **Tier 1 — Raw signal:** `compute_signal()` reduces numeric data (P/E, beta, debt/equity, revenue growth) to a directional score and a bias label (Bullish / Neutral / Bearish). Zero tokens.

- **Tier 2 — Rule-based flags:** The Blind Spot Detector checks discrete structural conditions (debt/equity > 200%, consecutive EPS declines) and appends them to a `flags` list. Still zero tokens. Each flag is deterministic, auditable, and a 5-line Python change to extend.

- **Tier 3 — LLM synthesis:** `risk_agent` receives the signal inputs and flags list, and writes 2-3 sentences identifying the critical risks. Its only job is translation — turning structured data into readable prose. It does not decide what the risks are; Python already did.

The constraint: the LLM is never asked to *detect* risks—only to *describe* them. The synthesis is bounded and verifiable: if the LLM mentions a risk, there's a corresponding flag or signal input that produced it.

Groq runs this node (small prompt, capped output, parallel execution). Gemini is the fallback. The UI mirrors the computational order: Blind Spots section (flags) first, then Risk Synthesis (narrative) below.

"I made it by being tougher than the toughies and smarter than the smarties, and I made it square!"
— Scrooge McDuck