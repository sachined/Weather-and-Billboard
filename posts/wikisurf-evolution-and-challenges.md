---
title: 'The Loop That Wasn't Enough'
date: '2026-03-07'
excerpt: 'Before FinSurf, there was WikiSurf—a project that taught me the intricacies of tool orchestration and structured LLM outputs.'
tags: ['AI', 'Engineering']
---

The goal seemed simple enough. Take a natural language topic, decide which tools to use, return a structured summary with cited sources. No database, no finance logic, no multi-agent orchestration — just a research assistant that could think for itself.

I called it WikiSurf. Building it broke almost every assumption I had about how autonomous agents actually work.

The first wall I hit was structured output. I wanted the LLM to return clean JSON I could parse. What I got was conversational filler, "helpful" explanations, and responses that looked right until they weren’t — Pydantic models blowing up on edge cases I hadn’t anticipated. The fix was a strict `<result>` tagging system enforced in the system prompt, plus a regex extractor in `main.py` to strip whatever preamble the model decided to add that day. It worked. But it made something clear: LLMs have opinions about how they want to respond, and those opinions are inconvenient when you need machine-readable output.

The second wall was the UI. Most LLM applications show a spinner and dump the answer. I wanted the user to feel the agent’s thought process — every tool call, every observation, rendered as it happened. I built a custom LangChain callback handler that hooked into the agent’s lifecycle and used the **Rich** library to color-code the terminal output in real time. It turned a black-box process into something you could actually watch think. That felt important.

The third wall was tool orchestration. The agent needed to know when Wikipedia was enough and when it needed to reach for DuckDuckGo. Hardcoding a sequence was the obvious solution, and it was wrong. What actually worked was the **ReAct** framework — giving the LLM clear tool descriptions in `tools.py` and letting it decide its own strategy. If Wikipedia returned a 404 or a disambiguation error, the agent pivoted to DuckDuckGo without intervention. That was the first time I felt like I’d built something genuinely autonomous.

WikiSurf worked. But it was a linear agent — one loop, one goal, one path to the answer. As I pushed it further, I kept running into the edges of that design. It couldn’t handle financial arithmetic reliably. It had no concept of conditional routing. Every run looked the same regardless of what it found.

That ceiling became the blueprint for [FinSurf](https://finsurf.net). The modular tool design, the callback-based UI, the Pydantic validation patterns — all of it carried forward. But the linearity didn’t. FinSurf needed a state machine, not a loop. Building WikiSurf was how I learned to know the difference.
