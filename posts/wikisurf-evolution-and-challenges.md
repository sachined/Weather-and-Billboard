---
title: 'WikiSurf: The Foundation of My Autonomous Research Agent'
date: '2026-03-09'
excerpt: 'Before FinSurf, there was WikiSurf—a project that taught me the intricacies of tool orchestration and structured LLM outputs.'
---

Every complex project has its predecessor, a "proof of concept" that lays the groundwork for future innovation. For my recent work on [FinSurf](https://finsurf.net), that foundation was **WikiSurf**. 

WikiSurf was my first deep dive into the world of **autonomous agents**, and while it may look simpler than the multi-agent systems I build today, it presented a unique set of challenges that fundamentally changed how I approach AI engineering.

## The Objective
The goal was straightforward: Build a research assistant that could take a natural language topic, decide which tools to use (Wikipedia or DuckDuckGo), and provide a structured summary with cited sources—all within a rich, interactive terminal UI.

## Engineering Challenges

### 1. The "Structured Output" Struggle
One of the biggest hurdles was getting the LLM (whether Claude or GPT) to consistently return data in a format that my code could reliably parse. I initially struggled with the LLM adding conversational filler or "helpful" explanations that broke my Pydantic models.

**The Solution:** I implemented a strict tagging system using `<result>` tags and reinforced the system prompt with precise JSON instructions. I also built a robust regex-based extractor in `main.py` to strip away any "pre-amble" or "post-amble" the LLM might generate.

### 2. Real-Time UI Synchronization
I wanted the user to feel the agent's "thought process." Most LLM applications show a spinner and then dump the final answer. I wanted more.

**The Solution:** I leveraged LangChain’s callback system to hook into the agent's lifecycle. By building a custom handler in `ui.py`, I was able to render every tool call and observation in real-time using the **Rich** library. This transformed a black-box process into a transparent, color-coded terminal experience.

### 3. Tool Orchestration & Logic
The agent needed to know when Wikipedia was enough and when it needed to "surf" the wider web via DuckDuckGo. 

**The Solution:** Instead of hardcoding a search sequence, I used the **ReAct (Reasoning and Acting)** framework. By defining clear tool descriptions in `tools.py`, I allowed the LLM to autonomously decide its strategy. If Wikipedia yielded a 404 or a disambiguation error, the agent would "pivot" to DuckDuckGo without human intervention.

## The Evolution to FinSurf
WikiSurf was a success, but it was a "linear" agent. It operated in a single loop until it reached its goal. As I pushed the limits of what this agent could do, I realized it needed more specialized knowledge—specifically in the financial and mathematical domains.

This realization led directly to the birth of **FinSurf**. I took the modular factory patterns and the rich UI logic from WikiSurf and evolved them into a more complex, multi-agent architecture. While WikiSurf focused on general research, FinSurf introduced deterministic calculations and multi-step orchestration.

## Final Thoughts
WikiSurf wasn't just a research tool; it was an engineering playground where I mastered **Pydantic validation**, **callback-based UI design**, and **agentic reasoning**. It remains a core part of my portfolio and a reminder that robust foundations are the key to building high-impact AI solutions.

---
*Check out the live evolution of these concepts at [FinSurf.net](https://finsurf.net).*
