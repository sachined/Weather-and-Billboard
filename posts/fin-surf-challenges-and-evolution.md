---
title: 'Stochastic to Deterministic'
date: '2026-03-08'
excerpt: 'WikiSurf taught me what a linear agent can and cannot do. FinSurf is what I built when I hit that ceiling — deterministic math, honest orchestration, and a PDF export that actually works.'
tags: ['FinSurf', 'AI', 'Engineering']
series: "FinSurf"
series_position: 1
---

The goal seemed simple enough. Take a natural language topic, decide which tools to use, return a structured summary with cited sources. No database, no finance logic, no multi-agent orchestration — just a research assistant that could think for itself.

I called it WikiSurf. Building it broke almost every assumption I had about how autonomous agents actually work.

The first wall I hit was structured output. I wanted the LLM to return clean JSON I could parse. What I got was conversational filler, "helpful" explanations, and responses that looked right until they weren't — Pydantic models blowing up on edge cases I hadn't anticipated. The fix was a strict `<result>` tagging system enforced in the system prompt, plus a regex extractor in `main.py` to strip whatever preamble the model decided to add that day. It worked. But it made something clear: LLMs have opinions about how they want to respond, and those opinions are inconvenient when you need machine-readable output.

The second wall was the UI. Most LLM applications show a spinner and dump the answer. I wanted the user to feel the agent's thought process — every tool call, every observation, rendered as it happened. I built a custom LangChain callback handler that hooked into the agent's lifecycle and used the **Rich** library to color-code the terminal output in real time. It turned a black-box process into something you could actually watch think. That felt important.

The third wall was tool orchestration. The agent needed to know when Wikipedia was enough and when it needed to reach for DuckDuckGo. Hardcoding a sequence was the obvious solution, and it was wrong. What actually worked was the **ReAct** framework — giving the LLM clear tool descriptions in `tools.py` and letting it decide its own strategy. If Wikipedia returned a 404 or a disambiguation error, the agent pivoted to DuckDuckGo without intervention. That was the first time I felt like I'd built something genuinely autonomous.

![WikiSurf agent callback handler with Rich terminal output](/blog/images/wikisurf-agent-callback.png)
*The callback handler in action: Rich library coloring agent decisions in real time*

WikiSurf worked. But it was a linear agent — one loop, one goal, one path to the answer. As I pushed it further, I kept running into the edges of that design. It couldn't handle financial arithmetic reliably. It had no concept of conditional routing. Every run looked the same regardless of what it found.

That ceiling became the blueprint for [FinSurf](https://finsurf.net).

![FinSurf early development state — February 21, landing page in progress](/blog/images/finsurf-dev-feb21.png)
*Early FinSurf — before the architecture matured* The modular tool design, the callback-based UI, the Pydantic validation patterns — all of it carried forward. But the linearity didn't. FinSurf needed a state machine, not a loop. Building WikiSurf was how I learned to know the difference.

---

The first version of FinSurf's dividend calculator was wrong.

Not obviously wrong — the outputs looked professional. Clean formatting, confident language, reasonable-sounding numbers. But when I checked the math by hand, the figures didn't hold up. The LLM was estimating. It was reasoning about numbers the way it reasons about everything else: probabilistically, plausibly, without guarantee.

That was the moment I stopped treating LLMs as calculation engines. The refactor that followed was the most important architectural decision I've made on this project: validate with Python, explain with AI. All the arithmetic — holding periods, capital gains, dividend projections — moved to native Python logic. The agents kept their job, which is interpreting those numbers and providing narrative context. But the numbers themselves became deterministic. If you run the same inputs twice, you get the same outputs. That's not a small thing when people are making financial decisions based on what your tool tells them.

The second shift happened when the orchestration stopped keeping up with the logic. I'd started with CrewAI, which was excellent for getting a prototype moving quickly. But as the workflows got more conditional — the Dividend Specialist agent should only fire if the Research Agent confirms the stock actually pays dividends — CrewAI's model started feeling like the wrong fit. I was bending the framework to do something it wasn't designed for.

Migrating to **LangGraph** was the right call. The directed graph structure let me build a proper state machine: conditional routing, parallel fan-out, nodes that only execute when their preconditions are met. The Dividend Specialist now sits dormant unless it's needed. That change alone cut unnecessary API token usage significantly — not because I was optimizing for cost, but because the logic was finally honest about what each run actually required.

The last wall was the one I didn't see coming. FinSurf uses React 19 with Tailwind CSS 4, and one of the most-requested features was downloadable PDF reports. When I implemented it, I hit an obscure compatibility gap: `html2canvas` and most PDF libraries don't fully support the `oklch` color space or CSS custom properties that Tailwind 4 uses. The Midnight Slate theme translated to the printed page as something close to garbage.

![FinSurf PDF report with greyed-out sections — color resolution failure before the fix](/blog/images/finsurf-jnj-pdf-report-greyed.png)
*What the Midnight Slate theme exported to before the color-resolution utility — colors resolve to nothing*

The fix was a custom color-resolution utility that converts design tokens to values the PDF renderer can handle before the export runs. It's one of those solutions that sounds trivial until you're two hours into it. The last mile is always an obscure compatibility issue you didn't anticipate.

![Browser print dialog with FinSurf AVGO report ready to export](/blog/images/finsurf-avgo-print-dialog.png)
*The PDF export working correctly — all colors render, spacing holds, the full report captures*

FinSurf keeps evolving — historical P&L analysis, multi-ticker batching, a conversational layer on top of existing reports. But the foundation is right now in a way it wasn't at the start: deterministic math, honest orchestration, and a PDF export that actually works.

---

**Keep Reading:**
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — The current state of the architecture this post traces the evolution toward
- [Even Anton Had a Supervisor](./token-management-evolution) — How token management evolved within this deterministic system
- [From Monolith to Midnight](./finsurf-monolith-to-midnight) — A shipping day that proved the deterministic approach works at scale
