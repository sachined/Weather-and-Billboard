---
title: 'FinSurf: The Evolution of an AI-Powered Stock Analyst'
date: '2026-03-09'
excerpt: 'Building FinSurf taught me that real-world AI applications require more than just LLM calls—they require robust state management and precise logic.'
---

Building [FinSurf](https://finsurf.net) has been one of my most rewarding technical challenges. What started as a simple idea—using AI to analyze stocks—quickly evolved into a complex orchestration of autonomous agents, Python-driven logic, and a modern frontend.

In this post, I want to share the key challenges I faced during its development and how the project has evolved over time.

## 1. The Arithmetic Challenge: Precision over "Guesses"

In the early versions of FinSurf, I relied heavily on LLMs (Large Language Models) to handle everything, including dividend projections and tax calculations. While the outputs *looked* professional, they were frequently wrong. LLMs are great at explaining concepts, but they are notoriously unreliable when it comes to precise financial arithmetic.

**The Solution:** I refactored the pipeline to follow a "Validate with Python, Explain with AI" pattern. Now, all calculations—holding periods, capital gains, and dividend projections—are handled by native Python logic. The AI agents are only responsible for interpreting those numbers and providing the narrative context. This shift from "stochastic guesses" to "deterministic math" was the single most important step in making FinSurf a tool users could trust.

## 2. Orchestration Shift: From CrewAI to LangGraph

When I first started building the multi-agent system, I used CrewAI. It was fantastic for getting a prototype up and running quickly. However, as the logic became more complex—specifically with conditional workflows where one agent’s output determines if another should even run—I hit a wall.

**The Evolution:** I migrated the entire backend to **LangGraph**. LangGraph’s directed graph structure allowed me to build a sophisticated state machine. For example, the "Dividend Specialist" agent now only fires if the "Research Agent" confirms the stock actually pays dividends. This granular control not only improved the reliability of the reports but also significantly reduced unnecessary API token usage.

## 3. The "Last Mile" of UX: Tailwind CSS 4 and PDFs

One of the most requested features was the ability to download reports as PDFs. Since FinSurf uses a modern stack (React 19 + Tailwind CSS 4), I ran into an unexpected hurdle: `html2canvas` and many PDF libraries do not yet fully support the `oklch` color space or CSS custom properties used in Tailwind 4.

**The Solution:** I had to build a custom color-resolution utility early in the process to ensure that the beautiful "Midnight Slate" and "Tropical" themes translated accurately to the printed page. This reinforced a lesson I've learned many times: the "Last Mile" of a project often involves solving the most obscure compatibility issues.

## 4. Looking Ahead: The Roadmap

FinSurf is far from finished. The evolution continues with several exciting phases on the horizon:

*   **Historical Profit Analyzer:** Bringing more deterministic Python logic to P&L and cost-basis analysis.
*   **Multi-Ticker Batching:** Allowing users to upload CSVs for sequential analysis.
*   **AI Chat:** A "conversational layer" on top of existing reports, allowing users to ask follow-up questions about their specific analysis.

FinSurf represents my commitment to the "Last Mile" of AI—not just making things work, but making them robust, accurate, and user-friendly.

Stay tuned for more updates, and feel free to check out the project at [finsurf.net](https://finsurf.net).
