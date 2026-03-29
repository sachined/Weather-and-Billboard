---
title: 'Fast and Patient'
date: '2026-03-18'
excerpt: "When one cache isn't enough. Why FinSurf needs disk persistence and in-memory speed, and why they solve different problems."
tags: ['FinSurf', 'Engineering']
series: "FinSurf"
series_position: 3
---

Early FinSurf had no caching. Every request meant hitting yfinance, Finnhub, EDGAR, pulling fresh data, running the Python pipeline, streaming results to the browser. It worked fine until it didn't.

I was testing with a handful of tickers. Then actual users started hitting it. Repeat queries for the same stock within minutes. Multiple users querying the same 10 stocks over the course of an hour. Suddenly the external APIs started rate-limiting, and the compute cost for redundant pipeline runs was climbing.

I needed caching. But one layer wasn't enough.

## The Problem With a Single Cache

The obvious fix: cache the final analysis results. Store the full pipeline output (research agent, dividend analysis, sentiment, signal) for 15 minutes. If the same ticker comes in again within that window, return the cached result.

This solves *one* problem: compute cost. But it doesn't solve the other: external API rate limits.

Here's the scenario: User searches AAPL. Pipeline hits yfinance, Finnhub, EDGAR. Results cached for 15 minutes. User searches MSFT. Different cache entry, different APIs called. Fine. But what if ten users search AAPL within the same minute? Each one misses the in-memory cache because they're different requests, different sessions. Ten calls to yfinance, ten calls to Finnhub, ten calls to EDGAR.

That's a rate-limit problem.

Conversely, if I only cached the external API calls themselves (market data, dividends, analyst ratings), I'd avoid the rate limit. But each request still runs the full Python analysis pipeline — even if the inputs are identical. That's expensive at scale.

Two different constraints. One cache wouldn't solve both.

## Two Caching Layers

**Layer 1: Disk Cache (API persistence)**

The backend maintains a JSON-backed cache keyed by ticker. When the data fetcher needs yfinance data for AAPL, it checks disk first. If the file exists and is less than 15 minutes old, use it. Otherwise, hit the API and write the response to disk.

```
data/
├── cache/
│   ├── aapl.json (created 10:15, expires 10:30)
│   ├── msft.json (created 10:22, expires 10:37)
```

Why disk?
- **Persistence across restarts** — If the server goes down and comes back up, the cache doesn't reset. Useful during deployments.
- **Survives the Python process** — Each request is a fresh Python execution. Disk is shared state.
- **Readable for debugging** — I can open `cache/aapl.json` and see exactly what yfinance returned at 10:15.
- **Simple TTL logic** — Check file mtime, compare to now. Straightforward.

Why 15 minutes? Market data doesn't move in ways that matter intraday. Earnings don't change every 5 minutes. Analyst ratings don't update twice an hour. 15 minutes is fresh enough for investment decisions, cheap enough to be practical.

![AAPL Research Analyst and Tax Strategist agent cards — the pipeline output the disk cache protects](/blog/images/finsurf-aapl-research-tax.png)
*The Research and Tax agents — disk-cached API data feeds both of these within a single request*

**Layer 2: In-Memory Cache (Pipeline speed)**

Separate cache layer: completed analysis results. When a request finishes the full pipeline (research, tax, dividend, sentiment, summary), store the entire output in an LRU cache in the Express server memory.

```javascript
const analysisCache = new LRU({
  max: 200,        // Max 200 tickers in memory
  maxAge: 15 * 60 * 1000  // 15 minutes
})
```

Why in-memory?
- **Speed** — Checking memory is microseconds. Disk is milliseconds.
- **Bounded memory** — LRU with a 200-entry max prevents unbounded growth. When the cache is full, evicting the least-recently-used entry keeps memory predictable.
- **Full pipeline cached** — The expensive part (running 5 agents, streaming results) is skipped entirely on a cache hit.

Why LRU?
- Real-world query pattern: most users research a small set of tickers (10-20 stocks they actually care about)
- 200 entries covers typical patterns with headroom
- When capacity is exceeded, evict the least-recently-used — not a loss, just a reset

## Why Two Layers Solve Two Problems

**Disk cache protects external services.**
If yfinance rate-limits me, it's because I'm hitting it too frequently. The disk cache prevents that. Ten simultaneous requests for AAPL hit yfinance once, then all read from disk.

**In-memory cache protects internal compute.**
If the Python pipeline is expensive (which it is — 5 agents, multiple LLM calls, math operations), the in-memory cache prevents redundant work. A user searches AAPL, waits for the full result. Ten seconds later, another user searches AAPL. The second request hits the in-memory cache, returns instantly.

Together:
- First AAPL request: Disk miss → API hit → disk write → pipeline runs → memory cache write → user sees result (10s)
- Second AAPL request (within 15 min, same server): Disk hit ✓ → pipeline runs (2s, faster because data is ready) → memory cache write → user sees result (2s)
- Third AAPL request (within 15 min, potentially different server): Disk hit ✓ → memory hit ✓ → return cached result (microseconds)

![Complete AAPL FinSurf report — the cached result served in microseconds on a cache hit](/blog/images/finsurf-aapl-report.png)
*The full pipeline output — on a cache hit, this reaches the user in microseconds instead of ten seconds*

## The Implementation Complexity

Sounds simple in theory. A few details matter:

**Cache invalidation.** Phil Karlton said there are only two hard things in computer science: cache invalidation and naming things. When yfinance data changes (a stock splits, dividend is announced), the cache doesn't know. The 15-minute TTL is my answer: wrong data expires automatically. For FinSurf's use case, stale is better than never-refreshed.

**Concurrent access.** Python's GIL handles the disk cache — only one process writes at a time, so file corruption isn't a concern. The in-memory LRU in Node is thread-safe enough for this use case (the operations are atomic relative to the event loop).

**Cache headers.** The in-memory cache is server-only. If I'm running multiple instances behind a load balancer, one server's memory cache doesn't help a user who gets routed to a different server. This is fine — the disk cache still helps, and the TTL is short enough that cache misses aren't a bottleneck.

## When One Cache Wasn't Enough

This pattern emerged from real constraints, not from premature optimization. I didn't architect two caching layers from day one. I built caching when I hit rate limits. Then I added a second layer when I realized compute was becoming the bottleneck.

The lesson: caching is a spectrum. It's not "cached or not." It's "where does the bottleneck live, and which layer do we cache at?"

---

**Keep Reading:**
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — How the data layer (and its caches) fit into the full pipeline
- [Not Everything Should Be a Prompt](./fin-surf-challenges-and-evolution) — The architectural evolution that led to needing this kind of optimization