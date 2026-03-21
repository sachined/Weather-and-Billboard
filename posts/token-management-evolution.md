---
title: 'The "Arithmetic" of AI: Navigating the Evolution of Token Management'
date: '2026-03-09'
excerpt: 'Managing LLM tokens is more than just counting numbers—it is about visibility, cost control, and knowing when NOT to let the AI take the wheel.'
tags: ['AI', 'Engineering', 'FinSurf']
---

In the early days of building **FinSurf**, token management was an afterthought. We were focused on the "magic" of the agents—getting them to research stocks, analyze tax implications, and summarize sentiment. But as the project evolved from a prototype into a multi-agent system, the "magic" started to get expensive.

We realized that without a robust way to track every single token, we were flying blind. This led to a significant evolution in how FinSurf handles telemetry, and more importantly, taught us a vital lesson about the limits of automated refactoring.

## The Evolution: From Logging to Telemetry

Our journey began with simple print statements. We’d see a response from Gemini or Groq and manually check the usage fields. But as we moved to a **LangGraph** orchestration, where multiple agents run in parallel and conditional paths skip entire nodes to save costs, manual checks became impossible.

We transitioned to a centralized **Telemetry System**. Today, every call across four different providers (Gemini, Groq, Ollama, and Perplexity) is intercepted and recorded into a structured `TokenUsage` dataclass. This data is then:
1.  **Aggregated per session**: We can see exactly which agent is the most "talkative."
2.  **Analyzed for cost**: Using a real-time (but manually maintained) cost table, we calculate the USD impact of every query.
3.  **Persisted to SQLite**: We use a high-performance Write-Ahead Logging (WAL) database to track performance over time without slowing down the user experience.

## The AI Trap: Why We Don’t "Auto-Refactor" Tokens

During this transition, there was a temptation to let an AI assistant handle the refactoring of our token management logic. It seems like a perfect task for an LLM: "Standardize these four different API responses into one format."

However, we quickly learned that **completely relying on AI to manage token logic is a risky proposition.** Here is why:

### 1. The "Schema Quirk" Problem
Each provider has a different way of reporting usage. Gemini uses `usageMetadata` with fields like `promptTokenCount`, while OpenAI-compatible providers (like Groq) use `usage` with `prompt_tokens`. An AI might successfully map these once, but if it misses a subtle difference—like how Perplexity handles citations in the response—you end up with "ghost" tokens that aren't being tracked, leading to budget surprises.

### 2. The Execution Context
Our current system uses a simple module-level list to accumulate usages. We chose this because, in our deployment model, a fresh process is spawned for each graph run. It’s zero-overhead and thread-safe by design. An AI refactor might suggest a "more advanced" thread-safe queue or a shared-state manager. While "cleaner" on paper, it would add unnecessary complexity and potential locking issues to a performance-critical path.

### 3. The Need for Measurement
The most important lesson we’ve learned is to **take measured steps.** Before we changed how tokens were persisted, we measured the latency impact of SQLite writes. We found that without WAL mode, concurrent runs could lock the database. An automated tool might have implemented the "Save to DB" logic perfectly but missed the "Database is Locked" error that only appears under real-world conditions.

## Conclusion: Measure Twice, Cut Once

As we continue to scale FinSurf, our approach to token management remains deliberate. We treat our telemetry code with the same respect as our financial logic. We don't make major changes without first establishing a baseline, and we never let an AI "blindly" refactor the pipes that measure our costs.

In the "Last Mile" of AI, knowing your numbers is just as important as knowing your code.

*Interested in seeing how we manage these agents? Check out the [Career Roadmap](/blog/job-gap) to see how we’ve mapped out the technical journey of building FinSurf.*
