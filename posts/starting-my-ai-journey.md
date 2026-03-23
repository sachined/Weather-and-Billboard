---
title: 'The Last Mile Is Always Harder Than the Model'
date: '2026-03-10'
excerpt: "Deploying AI in enterprise environments requires more than good code. It requires understanding where the real friction lives — and it's rarely in the model."
tags: ['AI', 'Enterprise']
---

There's a conversation I had repeatedly at eGain that I didn't fully appreciate at the time.

A Fortune 500 client would come in excited about AI. They had the budget, the executive sponsorship, the vendor pitch deck. What they didn't have was a clear path from the demo to the desk. The model worked. The integration didn't. The UX confused the agents who were supposed to use it. Six months of procurement led to something that sat mostly unused because it didn't slot into how people actually worked.

That gap — between a technically successful AI system and one that employees actually use — is what I started calling the Last Mile.

### Why the Last Mile is harder than the model

The AI field has a bias toward the hard, glamorous problems: accuracy, latency, hallucination rates. These matter. But in enterprise environments, I watched projects fail for much more mundane reasons. A chatbot that required agents to switch between five windows. A reporting tool that produced correct outputs in a format nobody had time to parse. An AI assistant that was faster than the old system but required a login process that added 90 seconds to every use.

These aren't engineering failures in the traditional sense. They're integration failures. The model did its job. Everything around it didn't.

My role as an Implementation Engineer meant I lived in this gap. I managed five concurrent enterprise accounts — clients like Worldpay and Fidelity Investments — with zero escalations. That record wasn't built by having the cleanest API integrations. It was built by sitting with the actual end users, watching where they got stuck, and fixing the friction before it became a ticket.

### What actually works

**Integration first, features second.** Every enterprise has legacy infrastructure that wasn't built for real-time AI inference. Trying to retrofit a modern AI system on top of siloed data structures without a clear integration plan is how you get six-month pilots that go nowhere. The first question I ask is never "what can the AI do?" — it's "what does the existing system produce, and where does it flow?"

**The UX is part of the product.** This sounds obvious until you've watched a technically excellent AI tool lose adoption because the interface required three extra clicks per interaction. At scale, three clicks times a thousand agents times fifty interactions a day is a real number. I learned to treat the frontend as a first-class engineering concern, not a finishing step.

**ROI has to be visible and fast.** Enterprise buyers have short patience for investments that take two years to show returns. The wins that drove renewal weren't the ones with the most impressive benchmarks — they were the ones where I could point to a workflow that now takes fifteen minutes instead of an hour. At eGain, I built AI-generated reporting scripts that cut a weekly process from 60 minutes to 15. That 75% reduction was something a VP could put in a slide. The underlying technology was interesting. The time saved was what got the contract renewed.

### Where I'm taking this

I left enterprise implementation to build things instead of configure them. FinSurf is the clearest expression of that shift: an AI assistant for financial research that's trying to close its own version of the Last Mile. The hard part isn't connecting to a data source or prompting a language model. It's making the output feel like something a real investor would actually use — structured, specific, and honest about what it doesn't know.

The Last Mile problem doesn't go away when you're the one building the product. If anything, it gets harder. You can't blame the integration team.

But that's what makes it interesting.

---
*The technical side of this — how I structured the multi-agent architecture in FinSurf — is covered in a separate post. The short version: LangGraph, parallel fan-out, and a deterministic Python math layer so the numbers are always right even when the narrative isn't.*
