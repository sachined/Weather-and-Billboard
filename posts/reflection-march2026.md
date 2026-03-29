---
title: "You Can't Delegate the node_modules"
date: '2026-03-12'
excerpt: 'A reflection on my professional background from Apple and eGain to building autonomous AI solutions, and why I find fulfillment in sharing technical knowledge.'
tags: ['AI', 'Enterprise']
series: "Career Reflections"
series_position: 2
---

A few weeks ago I was moving fast. Pushing code changes late at night, skipping the dev server tests, hitting deploy with a bit too much confidence.

Vercel exploded.

A wall of TypeScript errors stared back at me because I’d buried my `node_modules` in the wrong directory. The fix was straightforward once I found it. But for a few minutes I sat there looking at a build failure that had nothing to do with architecture or strategy or LLM orchestration. Just a misplaced folder.

That’s the part of this work that humbles you. And it’s also the part, I’ve come to believe, that matters most.

I spent three years as an Implementation Engineer managing enterprise AI deployments. The work taught me something: the gap between a working system and one people actually use is wider than the gap between a broken system and a working one. I wrote about that [here](./starting-my-ai-journey). The short version is that I left to go build things myself instead of configuring them for other people.

FinSurf is the clearest expression of that shift. LangGraph state machines with conditional routing. Parallel fan-out so market sentiment and dividend analysis run simultaneously. A deterministic Python math layer so the numbers are always right even when the narrative isn’t. Zero-SDK integrations with Gemini and OpenAI because bloat is what kills enterprise performance, and I’ve watched it happen enough times to be disciplined about it. At eGain, I built AI-generated reporting scripts that cut a weekly workflow from 60 minutes to 15. That 75% reduction was what got the contract renewed. The underlying technology was interesting. The time saved was what mattered.

The posts on this site are the same thing — problems worked through in public, not polished case studies. The interesting part is rarely the conclusion. It’s the night where a broken build made you realize you’d been overconfident, and what you did about it.

If you’re looking for someone who can talk architecture but isn’t afraid of the `node_modules`, you’re in the right place.

![img.png](/blog/images/img.png)
---

**Keep Reading:**
- [The Model Was the Easy Part](./starting-my-ai-journey) — The first reflection in this series, on enterprise AI deployment failures