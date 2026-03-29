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
