---
title: 'What Not to Log'
date: '2026-03-27'
highlight: true
excerpt: 'I shipped the VIP pass system and Stripe integration without a real security review. Then I sat down with the OWASP Top 10 and matched each item against the code. Here is what I found.'
tags: ['FinSurf', 'Security', 'Engineering']
series: "OWASP Top 10 Audit"
series_position: 2
---

I shipped the VIP pass system and Stripe integration without thinking much about security beyond "it works." The pass codes were stored in plaintext. The admin panel had no lockout. There was a hardcoded default pass — `FINSURF_BETA_2026` — baked into the server as a fallback. None of that felt alarming at the time. It was a small app, one developer, one user at a time.

Then I sat down with the OWASP Top 10 and matched each item against the codebase.

What follows is not a tutorial. It's an honest account of what I found, what I changed, and what I learned — in order of impact.

## Hashing the Passes

The first thing I changed was how VIP codes are stored.

FinSurf's auth model is intentionally minimal: no user accounts, no sessions, no OAuth. On payment success, Stripe fires a webhook, the server generates a `FINSURF-XXXXXXXX` pass code (48 bits of random hex), emails it to the buyer via Resend, and stores it in an environment variable. The Express server validates an `X-FinSurf-Pass` header on every protected route. Simple, auditable, no user table.

The problem: I was storing the codes in plaintext. If the env var was ever read — misconfigured logging, a compromised deploy pipeline, anything — every active pass was exposed immediately.

The fix was SHA-256. One important nuance: these are *not* passwords, and that distinction matters for which algorithm you choose. A password is something a human picks — usually short, often a dictionary word, susceptible to brute force if you have the hash. A VIP code is 48 bits of random hex. Brute-forcing it from the hash is computationally irrelevant. bcrypt's cost factor exists to make password hashing slow; for random tokens, SHA-256 is the right tool and doesn't introduce unnecessary latency on every request.

Switching to hashing at rest had one consequence I hadn't thought through: once a code is hashed, you can never retrieve the plaintext. The admin panel had to change to accommodate that. It now shows the full code exactly once on generation — with an explicit "save this now" warning — and after that, only displays the first 16 characters of the hash as an identifier. The "show once" constraint is actually a cleaner design. It forces the admin interface to be explicit about a guarantee it's making: I generated this code, you have it, I no longer do.

## What Not to Log

This section is the one that taught me the most.

After hardening the pass storage, I added structured JSON logging to every auth event: admin login attempts, pass validations, failed lookups. Logging auth events is standard practice — you want a record of suspicious patterns, a way to correlate failed attempts with source IPs, something to grep when you notice an anomaly.

The key decision was what *not* to include.

The natural impulse when debugging auth failures is `console.log("invalid pass:", pass)`. It's the most direct way to confirm what the server received. The problem is that if you write that line and leave it there, your logs now contain credential values — potentially valid ones, definitely attempted ones. Anyone with log access has a list of codes people have tried. If a valid code ever fails for a transient reason (race condition, whitespace, network hiccup), the plaintext code is now in the logs.

The rule I settled on: log the IP, the timestamp, and the outcome. Never the credential.

```json
{"event":"auth","result":"pass_invalid","ip":"x.x.x.x","ts":1234567890}
{"event":"auth","result":"pass_ok","ip":"x.x.x.x","ts":1234567890}
{"event":"admin","result":"login_failed","ip":"x.x.x.x","ts":1234567890}
```

This format tells you everything useful for incident response — when, from where, success or failure — without ever recording what was submitted. It's also grep-friendly. If I see a spike in `pass_invalid` from a single IP, I can spot it immediately without parsing nested fields.

What not to log is as important as what to log. That's easy to say in principle and easy to forget at 2 AM when you're chasing a validation bug and you just want to see what's coming in. Writing the rule down, and encoding it in the log format itself, is how you make sure the debug habit doesn't become a production liability.

## The Admin Lockout

The admin panel had a separate problem from the pass validation flow: no rate limiting on failed login attempts. The Cloudflare Worker handles rate limiting at the edge (100 requests per 15-minute window per IP), which is the real enforcer for normal traffic. But rate limiting at the edge only protects you if requests go through the edge. If someone hits the origin server directly — bypassing the Worker — they had no limit at all.

The fix: a per-IP lockout on the admin endpoints, independent of the Cloudflare layer. Five failed auth attempts triggers a 15-minute cooldown, enforced in the Express middleware. This is a different kind of protection than the analysis endpoint limiter (`express-rate-limit` at 200 req/15min/IP). The analysis limiter is a backstop for high-volume scraping. The admin lockout is a targeted defense against credential stuffing on a privileged endpoint.

Layering is intentional. The edge handles normal traffic. The server-side limits are the fallback if the edge is bypassed. Relying entirely on Cloudflare means that anyone who knows your origin IP has a wide-open door.

## Fail Fast, Not Quietly

The last change was the one I'd been avoiding because it required admitting a mistake.

The server had a hardcoded default: if `VIP_PASSES` wasn't set in the environment, it fell back to `FINSURF_BETA_2026`. I'd added this early in development so the server would start without configuration and I could test other things. I'd never removed it.

The implication: a misconfigured production deploy — one where the env var failed to load — would silently accept any request with that code. The server would appear healthy. Auth would appear to be working. The bug would be invisible until someone noticed that access was wider than expected.

The fix is three lines:

```js
if (process.env.NODE_ENV === 'production' && !process.env.VIP_PASSES) {
  console.error('FATAL: VIP_PASSES not set in production');
  process.exit(1);
}
```

Same pattern for `CORS_ORIGIN` and the `HTTPS` flag — both now emit startup warnings if missing in production. A loud failure at deploy time is almost always better than a quiet misconfiguration in production. The crash is visible, immediate, and fixable. The misconfiguration can persist for days before anyone notices.

`process.exit(1)` felt aggressive the first time I wrote it. After thinking through what silent misconfiguration actually looks like in production, it felt exactly right.

---

The OWASP Top 10 is not a compliance checklist. It's a prompt. Each item is a question: does this apply to what I've built? For a solo project with one developer and a simple auth model, most of the list resolves quickly. A few don't.

The ones that didn't resolve quickly — pass storage, credential logging, admin lockout, startup validation — were all cases where the code worked, nothing was obviously broken, and the risk was invisible until I looked for it. That's the pattern worth watching for. Not the things that are wrong. The things that are wrong and working fine.

Those are the ones that cost you.
