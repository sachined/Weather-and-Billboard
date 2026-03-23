---
title: 'Stochastic to Deterministic'
date: '2026-03-08'
excerpt: 'Building FinSurf taught me that real-world AI applications require more than just LLM calls—they require robust state management and precise logic.'
tags: ['FinSurf', 'AI', 'Engineering']
---

The first version of [FinSurf](https://finsurf.net)’s dividend calculator was wrong.

Not obviously wrong — the outputs looked professional. Clean formatting, confident language, reasonable-sounding numbers. But when I checked the math by hand, the figures didn’t hold up. The LLM was estimating. It was reasoning about numbers the way it reasons about everything else: probabilistically, plausibly, without guarantee.

That was the moment I stopped treating LLMs as calculation engines. The refactor that followed was the most important architectural decision I’ve made on this project: validate with Python, explain with AI. All the arithmetic — holding periods, capital gains, dividend projections — moved to native Python logic. The agents kept their job, which is interpreting those numbers and providing narrative context. But the numbers themselves became deterministic. If you run the same inputs twice, you get the same outputs. That’s not a small thing when people are making financial decisions based on what your tool tells them.

The second shift happened when the orchestration stopped keeping up with the logic. I’d started with CrewAI, which was excellent for getting a prototype moving quickly. But as the workflows got more conditional — the Dividend Specialist agent should only fire if the Research Agent confirms the stock actually pays dividends — CrewAI’s model started feeling like the wrong fit. I was bending the framework to do something it wasn’t designed for.

Migrating to **LangGraph** was the right call. The directed graph structure let me build a proper state machine: conditional routing, parallel fan-out, nodes that only execute when their preconditions are met. The Dividend Specialist now sits dormant unless it’s needed. That change alone cut unnecessary API token usage significantly — not because I was optimizing for cost, but because the logic was finally honest about what each run actually required.

The last wall was the one I didn’t see coming. FinSurf uses React 19 with Tailwind CSS 4, and one of the most-requested features was downloadable PDF reports. When I implemented it, I hit an obscure compatibility gap: `html2canvas` and most PDF libraries don’t fully support the `oklch` color space or CSS custom properties that Tailwind 4 uses. The Midnight Slate theme translated to the printed page as something close to garbage.

The fix was a custom color-resolution utility that converts design tokens to values the PDF renderer can handle before the export runs. It’s one of those solutions that sounds trivial until you’re two hours into it. The last mile is always an obscure compatibility issue you didn’t anticipate.

FinSurf keeps evolving — historical P&L analysis, multi-ticker batching, a conversational layer on top of existing reports. But the foundation is right now in a way it wasn’t at the start: deterministic math, honest orchestration, and a PDF export that actually works.
