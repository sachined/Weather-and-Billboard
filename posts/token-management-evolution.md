---
title: 'Even Anton Had a Supervisor'
date: '2026-03-09'
excerpt: 'Managing LLM tokens is more than just counting numbers—it is about visibility, cost control, and knowing when NOT to let the AI take the wheel.'
tags: ['AI', 'Engineering', 'FinSurf']
---

For a while, I wasn’t watching the meter.

In the early days of building FinSurf, token management was an afterthought. The focus was on getting the agents to work — research the stock, analyze the dividends, summarize the sentiment. Every time a response came back from Gemini or Groq, I’d manually glance at the usage fields. It was fine. It was fine until it wasn’t.

The moment it stopped being fine was when I realized I had no idea which agent was the expensive one. LangGraph was running parallel fan-out — multiple agents firing simultaneously along conditional paths — and I had no visibility into which calls were costing what. I was flying blind on a system where each run touched four different providers: Gemini, Groq, Ollama, Perplexity. Each with a different schema for reporting usage. Each billing differently. The number at the end of the month was a surprise, and surprises in cost infrastructure are bad.

So I built a telemetry layer. Every API call now gets intercepted and recorded into a structured `TokenUsage` dataclass before it returns. That data gets aggregated per session — I can see exactly which agent talks the most — analyzed against a cost table to calculate the USD impact in real time, and persisted to SQLite using Write-Ahead Logging so concurrent runs don’t lock each other out.

It sounds straightforward. The part that wasn’t was the temptation to let an AI assistant handle the refactoring.

It seemed like a perfect task: "Standardize these four different API response formats into one schema." And an AI can do that. The problem is what it misses. Gemini uses `usageMetadata` with `promptTokenCount`. Groq uses `usage` with `prompt_tokens`. Perplexity handles citations in a way that can produce ghost tokens — usage that doesn’t get tracked — if you map the schema wrong. An AI refactor might get three of the four right and you’d never know about the fourth until the budget surprises came back.

There was also the execution context. My system uses a simple module-level list to accumulate usage per run — zero overhead, thread-safe by design, because each graph run gets a fresh process. An AI refactor would almost certainly suggest a more sophisticated shared-state manager or thread-safe queue. Cleaner on paper. Unnecessary complexity on a performance-critical path that didn’t need it. And before I changed how tokens were persisted at all, I measured the latency impact of SQLite writes first — which is how I caught that without WAL mode, concurrent runs would lock the database. An automated tool might have missed that entirely.

Anton 2.0 eventually made things better in Gilfoyle’s world too. But somebody still had to watch what it was doing.

Measure twice. Prompt once.
