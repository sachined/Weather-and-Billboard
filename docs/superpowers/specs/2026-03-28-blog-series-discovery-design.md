# Blog Series Discovery & Post Tone — Design Spec

**Date:** 2026-03-28
**Status:** Approved

---

## Context

The blog currently presents posts in reverse-chronological order with tag filtering. There are 4 active series (FinSurf, OWASP Top 10 Audit, Investing, Career Reflections), but no way for a reader to quickly understand the shape of the blog — what series exist, what each covers, or how to start reading one from the beginning. The goal is to surface that structure without disrupting the existing chronological feed. A secondary goal is to loosen the tone of post section openers, which currently read more like documentation than a working journal.

---

## Scope

1. **Series config** — `lib/series.ts` as the source of truth for series metadata
2. **Series landing pages** — `/series/[name]` per-series pages
3. **Index teaser** — "Ongoing Series" section on the blog index
4. **Post fixes** — structural bug fix in one post + tone rewrites across all published posts

---

## Section 1: Data Layer

### `lib/series.ts`

A new config file that exports an array of series metadata. This is the only place series descriptions are authored — not in frontmatter (descriptions are too long for frontmatter and are about the series as a whole, not any individual post).

```ts
export interface SeriesConfig {
  slug: string;       // URL-safe identifier, e.g. "finsurf"
  name: string;       // Display name, must match frontmatter `series` exactly
  description: string; // 1-2 sentences shown on the index teaser and series page
}

export const SERIES: SeriesConfig[] = [
  {
    slug: 'finsurf',
    name: 'FinSurf',
    description: 'Building a personal finance and market research tool from scratch — architecture decisions, incidents, and what shipping actually looks like.',
  },
  {
    slug: 'owasp-top-10-audit',
    name: 'OWASP Top 10 Audit',
    description: 'Auditing my own projects against the OWASP Top 10. What "it\'s just a blog" and "I built this myself" look like when you actually check.',
  },
  {
    slug: 'investing',
    name: 'Investing',
    description: 'Personal portfolio decisions, options trades, and the gap between knowing the rules and following them.',
  },
  {
    slug: 'career-reflections',
    name: 'Career Reflections',
    description: 'Essays on engineering and growth — what changed, what didn\'t, and what I\'d tell myself earlier.',
  },
];
```

### `lib/posts.ts` — new function

Add `getSeriesSummaries()` that:
1. Calls `getSortedPostsData()` to get all published posts
2. Groups them by `series` field
3. Merges in descriptions from `SERIES` config
4. Sorts posts within each series by `series_position`
5. Returns `SeriesSummary[]`:

```ts
export interface SeriesSummary {
  slug: string;
  name: string;
  description: string;
  postCount: number;
  posts: Array<{ id: string; title: string; series_position?: number; date: string; excerpt: string; readingTime: number }>;
}
```

No changes to existing `getSortedPostsData()`, `getAllPostIds()`, or `getPostData()`.

**Data integrity note:** One post uses `series: 'FinSurf'` (single quotes in YAML). Normalize to `series: "FinSurf"` during post fixes. The `name` field in `SERIES` config must match the frontmatter string exactly.

---

## Section 2: Series Landing Pages

### `pages/series/[name].tsx`

- `getStaticPaths`: call `getSeriesSummaries()` and generate one path per returned series slug — only series with at least one published post get a page. Series defined in config but with no published posts are skipped.
- `getStaticProps`: call `getSeriesSummaries()`, find the matching series by slug, return it as props. Return `{ notFound: true }` if slug doesn't match any result (handles stale links).

**Page layout (single column):**

```
← Back to Blog

[Series Name]                          [post count] posts
[Series description — 1-2 sentences]

─────────────────────────────────────

1.  [Post Title]                        [date] · [N] min read
    [Excerpt]
    Read →                              ← "Start here" badge on first post only

2.  [Post Title]
    ...
```

- Posts sorted by `series_position` ascending; posts without a `series_position` sort to the end
- First post gets a subtle "Start here" indicator (badge or label)
- Each post row is a link to `/posts/[id]`
- No grid — single column, linear reading order
- OG meta: `og:title` = series name, `og:description` = series description

### CSS

New `styles/Series.module.css` for the series page. Reuse existing design tokens (colors, spacing, font sizes) from the blog styles — no new design language.

---

## Section 3: Index Teaser

### `pages/index.tsx` changes

- Add `getSeriesSummaries()` call inside `getStaticProps`, pass result as `seriesSummaries` prop
- Insert a "Ongoing Series" section **between the featured card and the post grid**

**Teaser layout:**

```
Ongoing Series

[FinSurf card]  [OWASP card]  [Investing card]  [Career Reflections card]
```

Each card:
- Series name (bold)
- One-line description (truncated with ellipsis if needed)
- Post count ("4 posts")
- "Explore →" link to `/series/[slug]`

Cards are a horizontal flex row with `flex-wrap` so they stack on mobile. The section only renders if `seriesSummaries.length > 0`.

### CSS additions

New `.seriesTeaser`, `.seriesTeaserHeading`, `.seriesCards`, `.seriesCard` classes added to `styles/Blog.module.css`.

---

## Section 4: Post Fixes

### Structural bug fix

`posts/owasp-hardening-the-blog.md` has its "Keep Reading" section and `---` separator placed in the middle of the file (after the first section, line ~34), before the remaining code examples and body content. Move the "Keep Reading" block to the actual end of the file.

### Tone rewrites

**Target register:** "Patience Is the Position" (`rklb-options-monetizing-patience.md`) — candid, first-person, talks through the work rather than filing a report on it.

**Scope:** Rewrite section openers and transitions in all published posts where the prose reads as documentation ("Here is what it found, and what the assumption behind each one actually was."). Do not touch: core arguments, code examples, specific numbers, the RKLB post (already at the right register).

**Posts to rewrite:**
- `owasp-hardening-the-blog.md` — several formal transitions, esp. section intro sentences
- `owasp-hardening-solo-project.md` — check for same pattern
- `finsurf-architecture-walkthrough.md` — likely documentation-register openers
- `fin-surf-challenges-and-evolution.md` — check
- Remaining posts: audit each opener, rewrite only where stiff

**Rule:** If a sentence tells the reader what they're about to read instead of just saying it, rewrite it to say it.

---

## Verification

- [ ] `/series/finsurf`, `/series/owasp-top-10-audit`, `/series/investing`, `/series/career-reflections` all render with correct posts in order
- [ ] Index page shows "Ongoing Series" section with 4 cards, each linking correctly
- [ ] Series cards stack on mobile (flex-wrap)
- [ ] `owasp-hardening-the-blog.md` "Keep Reading" appears at the end of the rendered post, not the middle
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] OG tags on series pages render series name + description
