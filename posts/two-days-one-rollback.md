---
title: 'Two Days, One Rollback, and a Cleaner Product'
date: '2026-03-23'
excerpt: 'A Finnhub endpoint that worked locally, a 502 in production, 224 lines deleted, and a Groq→Gemini relay I actually care about.'
tags: ['FinSurf']
series: "FinSurf"
series_position: 5
---

Yesterday I was on a roll. Wired up the TickerSummaryBar with analyst targets, earnings dates, dividend yield, live AI insights. Got the waitlist form actually posting to Formspree instead of just silently dumping to localStorage (yeah, that was embarrassing). Dropped a new endpoint to pull exchange market status and holidays from Finnhub — open/closed, next holiday, the whole thing. It looked great in local.

Deployed it. Got a 502.

Not intermittent. Consistent. The Finnhub market status endpoint was just... dead in production. Worked fine locally because of course it did.

I spent some time poking at it. Then I made the call: rip it out.

224 lines deleted. The ExchangeWidget component — gone. The `/api/exchange-info` route — gone. The backend fetcher, the agent mode, the API service call — all of it. The feature had literally been live for less than 24 hours before I pulled the plug. Some people would call that sunk cost. I call it shipping discipline.

Here's the thing — when a feature relies on an external API that's unreliable in production, you have two choices: build retry logic, fallback states, error handling, and shimming... or just remove it. For a solo indie project, the second option is usually the right call. The product is cleaner without it.

While all that was happening, I also shipped something I'm genuinely proud of: a Groq→Gemini relay for the research agent. The problem was Groq would sometimes truncate mid-sentence under load — not fail, just stop. It wasn't a crash. It was a silent halt. The response would just... end, mid-thought, with no error code to signal that something had broken.

For a financial research tool, that's catastrophic. Incomplete analysis isn't a degradation — it's worse than no analysis. A user gets a report that says "RKLB has strong fundamentals in..." and then nothing. That's not a performance issue. That's a trust issue.

Early versions of FinSurf tried to optimize for cost — Groq is significantly cheaper than Gemini per token. But the truncation pattern was consistent enough that I realized the math was backwards. A few extra dollars per session to guarantee complete output is worth infinitely more than a penny saved on a truncated response that damaged credibility.

So I built a relay. When Groq finishes its response, the system detects the exact cutoff point (measuring output length and token count), then sends the partial output to Gemini with context: "Here's what we have so far. Continue from where this left off and complete the analysis." If the combined output still has fewer than 5 sentences, a second corrective Gemini call fires to fill gaps — a final pass to ensure the reasoning is complete. Two levels of self-correction, totally transparent to the user.

It's more expensive than Groq alone. But truncated research advice is how you lose trust, and trust is the only thing that actually matters for a financial tool.

Also added sentiment color coding in the mini agent cards — Bullish is green, Bearish is red, Neutral is amber. Tiny thing, but it makes the output scannable in a way it wasn't before.

![TSMC report showing Tax, Dividend, and Sentiment agent cards with color-coded sentiment badge](/blog/images/finsurf-tsmc-sentiment-agents.png)
*Sentiment color coding at work — the green dot signals Bullish at a glance*

Ended the day with UI polish: uniform column layout in the summary bar, colored the Analyst Target card, tightened up the search bar and feature bar states. Plus Cloudflare Worker config and deployment scripts — the plumbing that nobody sees but matters.

Two days of building, one rollback, and the product is tighter than when I started. I'll take it.

---

**Keep Reading:**
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — How the Groq→Gemini relay fits into the larger research pipeline
- [Stochastic to Deterministic](./fin-surf-challenges-and-evolution) — Why the decision to ship and immediately rollback matters to FinSurf's evolution
