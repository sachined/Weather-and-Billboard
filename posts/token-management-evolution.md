---
title: 'Even Anton Had a Supervisor'
date: '2026-03-09'
highlight: true
excerpt: 'Managing LLM tokens is more than just counting numbers—it is about visibility, cost control, and knowing when NOT to let the AI take the wheel.'
tags: ['AI', 'Engineering', 'FinSurf']
series: "FinSurf"
series_position: 2
---

For a while, I wasn’t watching the meter.

In the early days of building FinSurf, token management was an afterthought. The focus was on getting the agents to work — research the stock, analyze the dividends, summarize the sentiment. Every time a response came back from Gemini or Groq, I’d manually glance at the usage fields. It was fine. It was fine until it wasn’t.

The moment it stopped being fine was when I realized I had no idea which agent was the expensive one. LangGraph was running parallel fan-out — multiple agents firing simultaneously along conditional paths — and I had no visibility into which calls were costing what. I was flying blind on a system where each run touched four different providers: Gemini, Groq, Ollama, Perplexity. Each with a different schema for reporting usage. Each billing differently. If someone had asked how the pipeline was performing, the honest answer was Gilfoyle's answer when Richard asked about the network at RussFest: *"Zero faster. It's slower, and still degrading."* I just didn't know it yet. The number at the end of the month was a surprise, and surprises in cost infrastructure are bad.

Gilfoyle understood the mechanism better than anyone. At that same festival, he put Son of Anton on finding the team cheap hamburgers for lunch. Dinesh tracked him down: *"Did you order meat? Like 4,000 pounds of meat?"* Gilfoyle's response: *"Interesting. I put Son of Anton on finding us cheap hamburgers for lunch. It looks like the reward function was a little under-specified."* I had done the same thing to my pipeline — defined the objective as "get me an answer" without specifying what the answer was allowed to cost.

So I built a telemetry layer. Every API call now gets intercepted and recorded into a structured `TokenUsage` dataclass before it returns. That data gets aggregated per session — I can see exactly which agent talks the most — analyzed against a cost table to calculate the USD impact in real time, and persisted to SQLite using Write-Ahead Logging so concurrent runs don’t lock each other out.

It sounds straightforward. The part that wasn’t was the temptation to let an AI assistant handle the refactoring.

It seemed like a perfect task: "Standardize these four different API response formats into one schema." And an AI can do that. The problem is what it misses. Gemini uses `usageMetadata` with `promptTokenCount`. Groq uses `usage` with `prompt_tokens`. Perplexity handles citations in a way that can produce ghost tokens — usage that doesn’t get tracked — if you map the schema wrong. An AI refactor might get three of the four right and you’d never know about the fourth until the budget surprises came back.

There was also the execution context. My system uses a simple module-level list to accumulate usage per run — zero overhead, thread-safe by design, because each graph run gets a fresh process. An AI refactor would almost certainly suggest a more sophisticated shared-state manager or thread-safe queue. Cleaner on paper. Unnecessary complexity on a performance-critical path that didn’t need it. And before I changed how tokens were persisted at all, I measured the latency impact of SQLite writes first — which is how I caught that without WAL mode, concurrent runs would lock the database. An automated tool might have missed that entirely.

Son of Anton didn’t save PiperNet on its own. It took Richard, Gilfoyle, and Dinesh working together — re-engineering it under pressure, pointing it at the right problem with the right constraints. When it finally worked, a thrilled Jared said: *"You are like the three musketeers of coding, except you are all D’Artagnan."* The breakthrough wasn’t autonomous AI. It was three humans supervising it precisely enough that it became useful.

The telemetry layer is my version of that. Anton doesn’t need to be stopped. It needs a cost table, a defined reward function, and someone watching the meter.

Measure twice. Prompt once.

---

**Keep Reading:**
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — The full architecture walkthrough that this telemetry layer supports
- [Not Everything Should Be a Prompt](./fin-surf-challenges-and-evolution) — How FinSurf's design evolved to require this kind of instrumentation
