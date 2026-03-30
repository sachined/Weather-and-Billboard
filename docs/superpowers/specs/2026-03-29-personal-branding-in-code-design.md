# Blog Post Design: "Intent Doesn't Update Itself"

**Date:** March 29, 2026
**Type:** Standalone blog post
**Audience:** Solo builders, developers transitioning projects, people shipping personal projects
**Target Length:** ~1000-1200 words

---

## Overview

A post about how shifting a project's purpose (personal passion project → product) leaves old intent baked throughout the codebase—invisible until forced to surface by external pressure, and unfixable by simply navigating code structure.

**Core Thesis:** When your intent changes, the code doesn't change with it. Every user-facing surface is a potential leak of the old intent.

---

## Narrative Arc

### 1. Hook (2-3 sentences)

Set the premise: when you build something for yourself, the code reflects that. The banner, the copy, the About page—they all say "this is my passion project." When the purpose shifts to a real product, the code is now *wrong* even though nothing broke.

**Key sentiment:** Honest about the original intent, but this honesty becomes a liability once the purpose changes.

---

### 2. The Domain Story: Discovery and Decision (250-300 words)

**Lead with the realization:** You built FinSurf under finsurf.ai, but you didn't own that domain. It only surfaced as a problem when converting from personal project to product—suddenly the domain *mattered*.

**The stakes:** Someone else owned finsurf.ai. You had to decide: fight for the domain, or pivot to finsurf.net. You chose to pivot.

**The insight moment:** The domain is the most fundamental identity. If the domain leaked old intent, what else did?

**Execution:** You changed the brand to finsurf.net, updated the header, footer, PDF export headers. But the process surfaced something: the rebranding didn't feel like a small fix. It felt like finding a thread that, when pulled, revealed how much old intent was woven into the product.

**Connection to thesis:** The domain discrepancy was invisible—it didn't cause a bug, it didn't break anything. It only surfaced when something external forced a comparison (the linter auto-correcting the og:url from finsurf.ai to finsurf.net).

---

### 3. The Audit: Three Supporting Examples (400-500 words total)

After the domain pivot, you ran a systematic audit of every user-facing surface. Not the component architecture, not the API layer—just the text and CTAs.

#### Example 1: The About Page

The entire About page was a bio. This made sense when FinSurf was your passion project—the product was inseparable from the person building it. But once it became a product (not a consulting inquiry), the About page signaled the wrong thing. It wasn't selling FinSurf; it was selling you.

**Outcome:** Removed the bio, refocused the page on what FinSurf does.

#### Example 2: The Banner

"I build custom AI tools for teams and founders." This banner appeared on the landing page. It was honest at the time—you didn't fully see what FinSurf could become. You were building a passion project, positioning yourself as a consultant. But once the intent shifted to shipping a real product, the banner looked like you didn't believe in what you'd built.

**Insight:** This was the most revealing example. Not because it was wrong technically, but because it reflected a mindset mismatch. You were underselling the tool because you didn't see its own value yet.

**Outcome:** Reframed the banner to emphasize what FinSurf does, not what the builder does.

#### Example 3: The Pricing Copy

The pricing card said "Built and maintained by one person." This framing emerged naturally from the project's origin—a solo build is a feature when you're positioning yourself. But for a product, it signals limitations, not capability. "One person" reads as "this might not scale" rather than "this is lean and intentional."

**Outcome:** Removed the personal framing, emphasized the product's actual value.

---

### 4. How You Found Them: The Audit Method (150-200 words)

The key: **navigating files by architecture doesn't surface intent leaks.**

You didn't find these examples by opening `SearchForm.tsx` or `UpgradePage.tsx` in an IDE. You found them by treating the codebase like a user would experience it—reading every surface a user can see, every CTA, every sentence of copy. User-facing, not developer-facing.

This is why the audit had to be deliberate and **user-centric**. File-by-file exploration would have missed copy that had been stale for months. You had to ask: "What does a user read when they land here?" not "Where does this code live?"

---

### 5. Takeaway (100-150 words)

**The rule:** When the intent of a project changes, the code hasn't changed with it. Every surface a user can read or click is a potential leak of the old intent.

The implication: this audit isn't optional. If you're shipping a personal project as a product, or pivoting a project's purpose, the code is full of evidence from the old intent. The fixes are usually copy changes and prop removals—no architectural work. But finding them requires deliberately stepping outside the code and into the user's shoes.

**Closing sentiment:** Building-in-public means the old intent doesn't disappear; it just gets baked into the codebase. Recognizing it, and fixing it, is part of the transition.

---

## Tone & Voice

- **Candid:** Admit you didn't see FinSurf's real value initially; the banner was honest evidence of that
- **Pragmatic:** These weren't big architectural problems, just pervasive copy misalignment
- **Building-in-public:** The old intent didn't disappear; it was embedded in the code and required deliberate excavation
- **Peer-to-peer:** Written for solo builders who've been through (or are about to go through) this transition

---

## Related Posts (Keep Reading section)

To be determined during implementation. Consider linking to:
- Posts that show the evolution of FinSurf (architectural posts, shipping stories)
- Posts about product decisions or pivots
- User will specify exact "Keep Reading" links during writing phase

---

## Front Matter

```yaml
---
title: "Intent Doesn't Update Itself"
date: '2026-03-29'
excerpt: "When a project shifts from personal passion project to product, the code doesn't change with it. Here's how intent leaks through every user-facing surface—and why finding it requires stepping outside the codebase."
tags: ['Building', 'Product']
highlight: false
---
```

---

## Notes

- **No series assignment** — This is a standalone post; can be discovered independently
- **Technical depth:** Minimal code examples; the post is about surfaces and intent, not implementation
- **Success criteria:** Reader (solo builder with a personal project) finishes and thinks: "I should audit my surfaces for old intent before shipping"

---

**Keep Reading:**
- [Conviction Is Not the Same as Durability](./portfolio-reclassification-march2026) — On why RKLB sits in the asymmetric layer and not the anchor, and what that distinction actually means for how I hold it
- [Patience Is the Position](./rklb-options-monetizing-patience) - How holding RKLB for the long-term helped improve my options strategies, and how codifying the strategies makes it stick.