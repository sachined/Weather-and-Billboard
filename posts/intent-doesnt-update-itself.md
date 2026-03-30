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

[Three examples - 400-500 words]

## How to Find Intent Leaks

[Audit method - 150-200 words]

## The Takeaway

[Takeaway - 100-150 words]

---

**Keep Reading:**

[To be determined - will add cross-references]
