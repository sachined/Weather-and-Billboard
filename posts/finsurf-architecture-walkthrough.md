---
title: 'The Signal Is Not the Story'
date: '2026-03-25'
excerpt: 'A systems-level look at how FinSurf works — the multi-agent pipeline, the rules-based signal engine, and the small decisions that keep the stack honest.'
tags: ['FinSurf', 'AI', 'Architecture', 'Engineering']
---

Two decisions in FinSurf's design generate the most questions, and neither of them involves an LLM.

The first: the market signal — Bullish, Neutral, or Bearish — is produced entirely by a rules engine written in Python. No tokens consumed. The second: every agent card in the UI shows a freshness badge ("Just now", "2 minutes ago", amber warning past one hour) that auto-updates every minute. No extra API calls.

Both follow the same principle: use the right tool for the job. Where LLMs are unreliable or expensive, don't use them.

The rest of this post walks through the full architecture using the diagram below as a map.

![FinSurf Architecture Diagram](/blog/images/ArchDiagram.svg)

---

## The Stack

**Frontend:** React 19 + TypeScript, Tailwind CSS 4. Results stream to the browser as each agent completes — no waiting for the full pipeline to finish before anything appears.

**Backend:** Python + LangGraph, running on a DigitalOcean droplet. LangGraph handles agent orchestration, state management, and conditional routing.

**Edge:** A Cloudflare Worker sits in front of the droplet, handling routing, CORS, and rate limiting.

---

## The Pipeline

Five agents run per analysis request: Research, Tax, Dividend, Sentiment, and Executive Summary.

They don't all run unconditionally.

The Research Agent fires first and determines the shape of the rest of the run. If the stock doesn't pay dividends, the Dividend Specialist is skipped entirely — its node in the LangGraph graph simply doesn't execute. This is the core reason LangGraph was chosen over CrewAI: conditional routing based on one agent's output requires explicit state management. LangGraph's directed graph structure makes that straightforward. CrewAI gets you moving faster, but you hit its ceiling quickly once logic gets conditional.

The Executive Summary agent runs last and only sees the outputs of agents that actually ran. It summarizes what exists, not what was skipped.

---

## Python Handles the Numbers

Every calculation — P&L, capital gains, dividend yield, payout ratio, holding period — runs in Python. The agents handle interpretation and narrative. They do not touch arithmetic.

This was a forced correction. Early versions passed raw financial data to the LLM and asked it to calculate projections. The outputs looked right. They frequently weren't. LLMs reason probabilistically; financial calculations require exactness. The fix was architectural: Python produces the numbers, agents receive them as structured inputs and explain what they mean.

---

## The Signal Engine

The market signal is the most visible output on the results page. It's also the only output that requires zero LLM tokens to produce.

The signal is derived deterministically from four inputs: P/E ratio, beta, analyst price targets, and revenue growth. A threshold ruleset maps those values to Bullish, Neutral, or Bearish. The output is consistent — identical inputs always produce the same signal — and auditable. If a stock is flagged Bearish, the reason is a specific set of threshold violations, not a model judgment call.

The LLM's role: it receives the signal as a structured input and narrates it in context. It explains; it does not decide.

---

## Freshness Badges

Each agent card displays a timestamp badge showing how current the underlying data is. The backend sends a timestamp alongside every agent response. The frontend renders it as a human-readable label — "Just now", "2 minutes ago" — and refreshes the display every 60 seconds. Data older than one hour triggers an amber warning automatically.

No polling, no extra endpoints. The timestamp travels with the data it describes, and the badge component handles the rest client-side.

---

## PDF Export

~~Generating PDFs from a Tailwind CSS 4 app requires solving one non-obvious compatibility problem: `html2canvas` predates CSS custom properties and the `oklch` color space. Exporting directly produces broken output — colors resolve to nothing, or to garbage approximations.

The fix is a color-resolution utility that converts design tokens to explicit values before the export runs. It's a pre-processing step, not a rendering workaround. Without it, the PDF pipeline silently corrupts the output.~~

I moved to window.print() — the browser's native print-to-PDF while back. No html2canvas, no color resolution hacks needed. The entire theming concern is handled in pdf.css via @media print rules. 

---

## Current State

The five-agent pipeline is stable. Active development is on a conversational layer that operates on top of completed reports rather than triggering a fresh pipeline run.
