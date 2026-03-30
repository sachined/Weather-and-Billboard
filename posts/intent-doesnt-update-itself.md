---
title: "Intent Doesn't Update Itself"
date: '2026-03-29'
excerpt: "When a project shifts from personal passion project to product, the code doesn't change with it. Here's how intent leaks through every user-facing surface—and why finding it requires stepping outside the codebase."
tags: ['Building', 'Product']
highlight: false
---

## The Problem With Intent

When you build something for yourself, the code reflects that. The banner announces what *you* do. The About page is your bio. The pricing is framed around your hourly rate. The copy is honest about your passion project. Then the intent changes—suddenly you're shipping a product, not maintaining a personal tool. The code is now *wrong*, even though nothing broke. Intent doesn't update itself.

## The Domain Story

FinSurf started as finsurf.ai. I didn't own that domain—I just used it. In the early days, when this was my passion project, it didn't matter. The domain was a placeholder, part of the personal-project scaffolding.

Then the intent shifted. FinSurf wasn't just something I'd built for myself anymore. It was becoming a product. And suddenly, the domain mattered.

I discovered someone else owned finsurf.ai. I had to make a choice: fight for the domain, or pivot. Fighting would have been expensive and uncertain. Pivoting meant rebranding the entire product.

I chose to pivot to finsurf.net.

This sounds like a straightforward migration—update the domain in DNS, change the header, update the footer, fix the PDF export headers. But that rebranding forced a realization: if the domain—the most fundamental, most visible identity—had been baked with old intent, what else had?

The answer was unsettling. The domain discrepancy was invisible. It hadn't caused a bug. It hadn't broken anything. It only surfaced when something external forced a comparison—the linter auto-correcting the og:url from finsurf.ai to finsurf.net when I added Open Graph meta tags.

That moment changed how I thought about intent. It wasn't something you fix once and move on. It was something that quietly persisted in every surface a user could see, waiting to be discovered by something external. And once you found one leak, you realized there were more.

## Three Places Where Intent Persisted

After the domain pivot, I ran a systematic audit of every user-facing surface. Not the component architecture, not the API layer—just the text. Every banner, modal, pricing card, and sentence a user could read.

I found intent leaks everywhere.

### The About Page

The entire About page was a bio. When FinSurf was my passion project, this made sense. The product was inseparable from the person building it. The About page told the story of who I was, what I'd learned, what I cared about.

But once the intent shifted to shipping a real product, the About page was wrong. It wasn't selling FinSurf. It was selling me. A visitor arriving to evaluate the product would read about my background, my interests, my journey—and leave confused about what the product actually does.

I removed the bio and refocused the page on FinSurf itself.

### The Banner

The landing page had a banner: "I build custom AI tools for teams and founders."

This was honest. At the time, I didn't fully see what FinSurf could become. I was building a passion project. The banner reflected that—I was positioning myself as a consultant, not a product. The banner was evidence that I didn't see my own tool's value yet.

But shipping it as the public face of the product meant I was signaling the same doubt to everyone else. A user arriving to see what FinSurf could do would read "I build tools for other people" and get the impression this tool might not be ready, or that the builder didn't believe in it.

I reframed the banner to emphasize what FinSurf does, not what I do.

### The Pricing Copy

The pricing card said "Built and maintained by one person."

This framing came naturally from the project's origin. A solo build is genuinely interesting when you're positioning yourself as a consultant—it signals independence and lean operations. But for a product, "one person" carries different weight. It reads as a limitation, not a capability. "This might not scale. This might not be reliable."

I removed that framing. The fact that FinSurf is solo-built is interesting, but it belongs in the story, not in the pricing card. The card should sell the value, not the constraints.

## How to Find Intent Leaks

The key: **navigating files by architecture doesn't surface intent leaks.**

I didn't find these examples by opening `SearchForm.tsx` or `UpgradePage.tsx` in an IDE. I found them by treating the codebase like a user would—reading every surface a user can see, every call-to-action, every sentence of copy.

File-by-file exploration would have missed this. Opening `AboutPage.tsx`, I'd see the component structure, the imports, the data flow. I wouldn't read the bio itself with fresh eyes. But visiting the About page as a user, reading the bio as prose instead of code, I'd immediately feel the misalignment.

That's the difference. The audit had to be user-centric, not developer-centric.

This is why the search had to be deliberate. Intent leaks are invisible to code navigation. They hide in copy that's been stale for months, in CTAs that reflected the old purpose, in framing that made sense at the time but doesn't anymore.

If you're transitioning a personal project to a product, don't trust your IDE to find these. Step outside the code. Walk through the product as a user. Read every surface. Ask: "Does this still fit the new intent?"

## The Takeaway

When the intent of a project changes, the code doesn't change with it. Every user-facing surface is a potential leak of the old intent.

The fixes are usually small—copy changes, prop removals, rephrasing CTAs. No architectural work. But finding them requires stepping outside the codebase and into the user's shoes.

This is part of building in public. The old intent doesn't disappear when you shift purpose. It gets baked into the code. It persists in the domain you didn't own, the About page that tells your story instead of selling the product, the banner that undermines your own work.

Recognizing it, and fixing it, is how you move from "I built this for myself" to "I'm shipping this for others."

---

**Keep Reading:**
- [Not Everything Should Be a Prompt](./fin-surf-challenges-and-evolution) — How FinSurf evolved from WikiSurf, and why architecture had to shift as intent changed
- [From Monolith to Midnight](./finsurf-monolith-to-midnight) — A shipping day that shows what changed when the product hardened (security, admin, VIP system)
- [The Signal Is Not the Story](./finsurf-architecture-walkthrough) — The current architecture that emerged after all the intent shifts and decisions
