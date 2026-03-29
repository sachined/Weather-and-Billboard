# Blog Series Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-series landing pages and an "Ongoing Series" teaser on the blog index so readers can understand the full shape of the blog at a glance, plus targeted tone rewrites for posts with overly formal transitions.

**Architecture:** A `lib/series.ts` config file holds series metadata (slug, display name, description). A new `getSeriesSummaries()` function in `lib/posts.ts` groups published posts by series and merges in descriptions. `pages/series/[name].tsx` renders per-series landing pages using static generation. The blog index gets a compact series teaser section consuming the same data.

**Tech Stack:** Next.js 13+ (App/Pages Router — using Pages Router), TypeScript, CSS Modules, gray-matter (already in use)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `lib/series.ts` | Series config — slugs, names, descriptions |
| Modify | `lib/posts.ts` | Add `SeriesSummary` interface + `getSeriesSummaries()` |
| Create | `pages/series/[name].tsx` | Per-series landing page |
| Create | `styles/Series.module.css` | Styles for series landing page |
| Modify | `styles/Blog.module.css` | Add series teaser CSS classes |
| Modify | `pages/index.tsx` | Render series teaser between featured card and post grid |
| Modify | `posts/owasp-hardening-the-blog.md` | Fix structural bug + tone rewrite |
| Modify | `posts/owasp-hardening-solo-project.md` | Minor tone rewrite |
| Modify | `posts/starting-my-ai-journey.md` | Remove meta-commentary opener |
| Modify | `posts/finsurf-architecture-walkthrough.md` | Remove "rest of this post" sentence |
| Modify | `posts/finsurf-two-caching-layers.md` | Normalize frontmatter quote style |

---

## Task 1: Create `lib/series.ts`

**Files:**
- Create: `lib/series.ts`

- [ ] **Step 1: Create the file**

```ts
export interface SeriesConfig {
  slug: string;       // URL-safe, e.g. "finsurf" → /series/finsurf
  name: string;       // Must match frontmatter `series` field exactly
  description: string;
}

export const SERIES: SeriesConfig[] = [
  {
    slug: 'finsurf',
    name: 'FinSurf',
    description:
      'Building a personal finance and market research tool from scratch — architecture decisions, incidents, and what shipping actually looks like.',
  },
  {
    slug: 'owasp-top-10-audit',
    name: 'OWASP Top 10 Audit',
    description:
      "Auditing my own projects against the OWASP Top 10. What \"it's just a blog\" and \"I built this myself\" look like when you actually check.",
  },
  {
    slug: 'investing',
    name: 'Investing',
    description:
      'Personal portfolio decisions, options trades, and the gap between knowing the rules and following them.',
  },
  {
    slug: 'career-reflections',
    name: 'Career Reflections',
    description:
      "Essays on engineering and growth — what changed, what didn't, and what I'd tell myself earlier.",
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors referencing `lib/series.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/series.ts
git commit -m "feat: add series config (lib/series.ts)"
```

---

## Task 2: Add `getSeriesSummaries()` to `lib/posts.ts`

**Files:**
- Modify: `lib/posts.ts`

- [ ] **Step 1: Add import at the top of `lib/posts.ts`**

After the existing imports, add:

```ts
import { SERIES } from './series';
```

- [ ] **Step 2: Add `SeriesSummary` interface after the existing `PostData` interface**

```ts
export interface SeriesSummary {
  slug: string;
  name: string;
  description: string;
  postCount: number;
  posts: Array<{
    id: string;
    title: string;
    series_position?: number;
    date: string;
    excerpt: string;
    readingTime: number;
  }>;
}
```

- [ ] **Step 3: Add `getSeriesSummaries()` at the end of `lib/posts.ts`**

```ts
export function getSeriesSummaries(): SeriesSummary[] {
  const allPosts = getSortedPostsData();
  return SERIES.map((config) => {
    const posts = allPosts
      .filter((p) => p.series === config.name)
      .sort(
        (a, b) =>
          (a.series_position ?? Infinity) - (b.series_position ?? Infinity)
      )
      .map((p) => ({
        id: p.id,
        title: p.title,
        series_position: p.series_position,
        date: p.date,
        excerpt: p.excerpt,
        readingTime: p.readingTime,
      }));
    return {
      slug: config.slug,
      name: config.name,
      description: config.description,
      postCount: posts.length,
      posts,
    };
  }).filter((s) => s.postCount > 0);
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add lib/posts.ts
git commit -m "feat: add getSeriesSummaries() to lib/posts"
```

---

## Task 3: Create `styles/Series.module.css`

**Files:**
- Create: `styles/Series.module.css`

- [ ] **Step 1: Create the file**

```css
/* ── Back button ── */
.backButton {
  margin-bottom: 1.5rem;
}

.backButton a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.15s;
}

.backButton a:hover {
  color: var(--accent-primary);
}

/* ── Series header ── */
.seriesHeader {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
}

.seriesMeta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.seriesEyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.seriesPostCount {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.seriesTitle {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--text-heading);
  margin: 0 0 0.75rem;
  line-height: 1.25;
}

.seriesDescription {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
  max-width: 680px;
}

/* ── Post list ── */
.postList {
  display: flex;
  flex-direction: column;
}

.postItem {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-subtle);
  text-decoration: none;
}

.postItem:hover .postItemTitle {
  color: var(--accent-primary);
}

.postItemLeft {
  flex-shrink: 0;
  width: 2rem;
  padding-top: 0.25rem;
}

.postNumber {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
}

.postItemContent {
  flex: 1;
  min-width: 0;
}

.postItemMeta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.postItemDate,
.postItemTime {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.startHere {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent-primary);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 4px;
  padding: 0.1rem 0.45rem;
}

.postItemTitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 0.4rem;
  line-height: 1.35;
  transition: color 0.15s;
}

.postItemExcerpt {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0 0 0.5rem;
}

.readLink {
  font-size: 0.83rem;
  font-weight: 700;
  color: var(--accent-primary);
}
```

- [ ] **Step 2: Commit**

```bash
git add styles/Series.module.css
git commit -m "feat: add Series.module.css"
```

---

## Task 4: Create `pages/series/[name].tsx`

**Files:**
- Create: `pages/series/[name].tsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p pages/series
```

- [ ] **Step 2: Create `pages/series/[name].tsx`**

```tsx
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout';
import { getSeriesSummaries, SeriesSummary } from '@/lib/posts';
import { GetStaticProps, GetStaticPaths } from 'next';
import { SITE_NAME } from '@/lib/constants';
import styles from '@/styles/Series.module.css';

export const getStaticPaths: GetStaticPaths = async () => {
  const series = getSeriesSummaries();
  return {
    paths: series.map((s) => ({ params: { name: s.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const series = getSeriesSummaries();
  const seriesData = series.find((s) => s.slug === (params?.name as string));
  if (!seriesData) return { notFound: true };
  return { props: { seriesData } };
};

export default function SeriesPage({ seriesData }: { seriesData: SeriesSummary }) {
  return (
    <Layout>
      <Head>
        <title>{`${seriesData.name} — ${SITE_NAME}`}</title>
        <meta property="og:title" content={seriesData.name} />
        <meta property="og:description" content={seriesData.description} />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://finsurf.net/blog/series/${seriesData.slug}`}
        />
      </Head>

      <div className={styles.backButton}>
        <Link href="/">← Back to Blog</Link>
      </div>

      <header className={styles.seriesHeader}>
        <div className={styles.seriesMeta}>
          <span className={styles.seriesEyebrow}>Series</span>
          <span className={styles.seriesPostCount}>
            {seriesData.postCount} {seriesData.postCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
        <h1 className={styles.seriesTitle}>{seriesData.name}</h1>
        <p className={styles.seriesDescription}>{seriesData.description}</p>
      </header>

      <div className={styles.postList}>
        {seriesData.posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.id}`} className={styles.postItem}>
            <div className={styles.postItemLeft}>
              {post.series_position !== undefined && (
                <span className={styles.postNumber}>{post.series_position}</span>
              )}
            </div>
            <div className={styles.postItemContent}>
              <div className={styles.postItemMeta}>
                <span className={styles.postItemDate}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className={styles.postItemTime}>{post.readingTime} min read</span>
                {index === 0 && (
                  <span className={styles.startHere}>Start here</span>
                )}
              </div>
              <h2 className={styles.postItemTitle}>{post.title}</h2>
              <p className={styles.postItemExcerpt}>{post.excerpt}</p>
              <span className={styles.readLink}>Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
```

- [ ] **Step 3: Run build to verify the page generates correctly**

Run: `npm run build`
Expected: Build succeeds. Output should include lines like:
```
├ /series/finsurf
├ /series/owasp-top-10-audit
├ /series/investing
├ /series/career-reflections
```

- [ ] **Step 4: Commit**

```bash
git add pages/series/[name].tsx
git commit -m "feat: add per-series landing pages (/series/[name])"
```

---

## Task 5: Add series teaser to blog index

**Files:**
- Modify: `styles/Blog.module.css`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Append series teaser classes to `styles/Blog.module.css`**

At the end of the file, add:

```css
/* ── Ongoing Series teaser ── */
.seriesTeaser {
  margin-bottom: 2rem;
}

.seriesTeaserHeading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 1rem;
}

.seriesCards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.seriesCard {
  flex: 1 1 200px;
  padding: 1.25rem;
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.seriesCard:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.seriesCardName {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-heading);
}

.seriesCardDesc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.seriesCardFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.seriesCardCount {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.seriesCardCta {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-primary);
}
```

- [ ] **Step 2: Update `pages/index.tsx` imports**

Replace the existing import line:
```ts
import { getSortedPostsData, PostData } from '@/lib/posts';
```
With:
```ts
import { getSortedPostsData, PostData, getSeriesSummaries, SeriesSummary } from '@/lib/posts';
```

- [ ] **Step 3: Update `getStaticProps` in `pages/index.tsx`**

Replace:
```ts
export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
```
With:
```ts
export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const seriesSummaries = getSeriesSummaries();
  return {
    props: {
      allPostsData,
      seriesSummaries,
    },
  };
};
```

- [ ] **Step 4: Update the component signature in `pages/index.tsx`**

Replace:
```tsx
export default function Blog({ allPostsData }: { allPostsData: PostData[] }) {
```
With:
```tsx
export default function Blog({ allPostsData, seriesSummaries }: { allPostsData: PostData[]; seriesSummaries: SeriesSummary[] }) {
```

- [ ] **Step 5: Add the series teaser JSX in `pages/index.tsx`**

Find the JSX block that starts with `{featured && (` and insert the series teaser **after the closing `)}` of the featured card block and before `{rest.length > 0 && (`**:

The section to find (between featured card and rest grid):
```tsx
          )}

          {rest.length > 0 && (
```

Replace with:
```tsx
          )}

          {seriesSummaries.length > 0 && (
            <div className={styles.seriesTeaser}>
              <p className={styles.seriesTeaserHeading}>Ongoing Series</p>
              <div className={styles.seriesCards}>
                {seriesSummaries.map((s) => (
                  <Link key={s.slug} href={`/series/${s.slug}`} className={styles.seriesCard}>
                    <span className={styles.seriesCardName}>{s.name}</span>
                    <span className={styles.seriesCardDesc}>{s.description}</span>
                    <div className={styles.seriesCardFooter}>
                      <span className={styles.seriesCardCount}>
                        {s.postCount} {s.postCount === 1 ? 'post' : 'posts'}
                      </span>
                      <span className={styles.seriesCardCta}>Explore →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
```

- [ ] **Step 6: Run build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 7: Commit**

```bash
git add styles/Blog.module.css pages/index.tsx
git commit -m "feat: add Ongoing Series teaser to blog index"
```

---

## Task 6: Fix `owasp-hardening-the-blog.md` — structural bug + tone

**Files:**
- Modify: `posts/owasp-hardening-the-blog.md`

**Background:** The "Keep Reading" cross-link block was accidentally placed after the first section, in the middle of the post, before the remaining three sections and their code blocks. There is a correct "Keep Reading" block at the actual end of the file. Additionally, the sentence "Here is what it found, and what the assumption behind each one actually was." is meta-commentary that should be removed.

- [ ] **Step 1: Remove the misplaced "Keep Reading" block from the middle of the file**

Find and delete these lines (they appear after the prose of "Static sites don't have secrets" and before the first code block):

```
---

**Keep Reading:**
- [What Not to Log](./owasp-hardening-solo-project) — The companion OWASP audit, this time on FinSurf's auth infrastructure

```

After deletion, the section should flow directly from:

```
The fix is a server-side proxy route. The client now calls `/api/weather/current`, a Next.js API route that holds the key in `process.env.OPENWEATHER_API_KEY` — a server-only variable that never ships to the browser:
```

Into the code block:

```
```ts
// pages/api/weather/current.ts
```

- [ ] **Step 2: Remove the meta-commentary sentence from the intro**

Find:
```
Here is what it found, and what the assumption behind each one actually was.
```

Delete the entire line (and any blank line immediately above it that was padding it).

- [ ] **Step 3: Verify the post reads correctly from top to bottom**

Open `posts/owasp-hardening-the-blog.md` and confirm:
- Intro flows directly into `## "Static sites don't have secrets"`
- The code block for the API proxy appears immediately after the prose that introduces it
- `## "I wrote these files"`, `## "There's nothing to validate"`, `## "Modern frameworks handle this"` all appear in sequence
- The `---` + `**Keep Reading:**` block appears once, at the very end

- [ ] **Step 4: Commit**

```bash
git add posts/owasp-hardening-the-blog.md
git commit -m "fix: move misplaced Keep Reading section to end of owasp-blog post"
```

---

## Task 7: Tone rewrites — targeted post edits

**Files:**
- Modify: `posts/owasp-hardening-solo-project.md`
- Modify: `posts/starting-my-ai-journey.md`
- Modify: `posts/finsurf-architecture-walkthrough.md`
- Modify: `posts/finsurf-two-caching-layers.md` (frontmatter normalization)

**Rule:** If a sentence tells the reader what they're about to read instead of just saying it, remove it. The RKLB post ("Patience Is the Position") is the target register.

### `posts/owasp-hardening-solo-project.md`

- [ ] **Step 1: Remove meta-commentary sentence**

Find (in the intro, after "Then I sat down with the OWASP Top 10 and matched each item against the codebase."):
```
What follows is not a tutorial. It's an honest account of what I found, what I changed, and what I learned — in order of impact.
```

Replace with nothing (delete both sentences). The intro now ends at:
```
Then I sat down with the OWASP Top 10 and matched each item against the codebase.
```

And flows directly into `## Hashing the Passes`.

### `posts/starting-my-ai-journey.md`

- [ ] **Step 2: Remove meta-commentary opener**

Find the very first line of body content:
```
Enterprise AI deployments fail not because the models are weak, but because the surrounding workflow doesn't work. Here's where I learned that.
```

Replace with:
```
Enterprise AI deployments fail not because the models are weak, but because the surrounding workflow doesn't work.
```

(Drop "Here's where I learned that." — the next paragraph is the story; no need to announce it.)

### `posts/finsurf-architecture-walkthrough.md`

- [ ] **Step 3: Remove "rest of this post" sentence**

Find:
```
The rest of this post walks through the full architecture using the diagram below as a map.
```

Delete the entire line (and any blank line immediately above it). The architecture diagram `![FinSurf Architecture Diagram]` follows directly.

### `posts/finsurf-two-caching-layers.md`

- [ ] **Step 4: Normalize frontmatter quote style**

Find in frontmatter:
```yaml
series: 'FinSurf'
```

Replace with:
```yaml
series: "FinSurf"
```

(Consistency with all other posts; both parse identically but the string equality check in `getSeriesSummaries()` requires an exact match.)

- [ ] **Step 5: Commit all post edits**

```bash
git add posts/owasp-hardening-solo-project.md posts/starting-my-ai-journey.md posts/finsurf-architecture-walkthrough.md posts/finsurf-two-caching-layers.md
git commit -m "fix: tone rewrites and frontmatter normalization across posts"
```

---

## Task 8: Final verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds. Check that the build output includes all 4 series pages:
```
├ /series/career-reflections
├ /series/finsurf
├ /series/investing
├ /series/owasp-top-10-audit
```

- [ ] **Step 2: Run dev server and verify manually**

Run: `npm run dev`

Check each of the following:
- `http://localhost:3000` — "Ongoing Series" section appears between featured post and post grid, 4 cards visible
- `http://localhost:3000/series/finsurf` — renders with correct posts in order, "Start here" badge on post 1
- `http://localhost:3000/series/owasp-top-10-audit` — 2 posts, correct order
- `http://localhost:3000/series/investing` — 2 posts (including the new RKLB post), correct order
- `http://localhost:3000/series/career-reflections` — posts in order
- `http://localhost:3000/posts/owasp-hardening-the-blog` — "Keep Reading" appears at the bottom only, not in the middle of the post

- [ ] **Step 3: Check series card mobile layout**

Resize browser to 375px width. Confirm series cards stack vertically (flex-wrap working).

- [ ] **Step 4: Commit any cleanup, then push**

```bash
git add -p   # stage any final tweaks
git commit -m "chore: final cleanup" # only if there are changes
```
