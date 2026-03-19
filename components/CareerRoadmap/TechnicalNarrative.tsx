import React from 'react';
import Link from 'next/link';
import styles from './TechnicalNarrative.module.css';

interface MilestoneLink {
  label: string;
  href: string;
}

interface Book {
  title: string;
  author: string;
  takeaway: string;
}

interface Callout {
  audience: string;
  text: string;
  highlight?: boolean;
}

interface Quote {
  text: string;
  attribution: string;
}

interface Milestone {
  date: string;
  title: string;
  type?: 'education' | 'work' | 'project' | 'pause';
  role?: string;
  description?: string;
  tags?: string[];
  metric?: string;
  links?: MilestoneLink[];
  books?: Book[];
  quote?: Quote;
  closingQuote?: Quote;
  callout?: Callout[];
}

const LEGEND = [
  { label: 'Education', color: '#D97706' },
  { label: 'Work',      color: '#2563EB' },
  { label: 'Project',   color: 'var(--accent-primary)' },
  { label: 'Study',     color: '#9CA3AF' },
];

const MILESTONES: Milestone[] = [
  {
    date: '2017 – 2018',
    title: 'CS Foundations — De Anza College',
    type: 'education',
    description:
      'Built core computer science fundamentals through coursework and solo projects in C and C++. Covered data structures, file I/O, hashing, bitwise operators, and binary manipulation. Capstone group project (CIS29) introduced collaborative engineering under deadlines. Taken after graduating from UCLA (2014, Geography) — a deliberate return to technical study.',
    tags: ['C', 'C++', 'Data Structures', 'Algorithms', 'File I/O'],
  },
  {
    date: 'Jan – Jun 2020',
    title: 'Web Development — First Production App',
    type: 'project',
    description:
      'Earned freeCodeCamp\'s Responsive Web Design (Jan) and JavaScript Algorithms & Data Structures (Jun) certifications. Built first React apps and launched Weather-and-Billboard as a live TypeScript/Next.js project — the predecessor to this site.',
    tags: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML/CSS', 'Bootstrap'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/sachined/Weather-and-Billboard' },
    ],
  },
  {
    date: '2020 – 2024',
    title: 'Enterprise AI Deployment — eGain',
    type: 'work',
    role: 'Senior Solutions Engineer',
    description:
      'Specializing in the "Last Mile" of enterprise AI — the gap between a working demo and a workflow employees actually use. Owned the full deployment lifecycle for AI-powered Knowledge Management platforms at Fortune 500 clients including Worldpay and Fidelity Investments. Handled root cause analysis, custom reporting, and cross-functional coordination across Sales, Engineering, and CS.',
    tags: ['Enterprise AI', 'Knowledge Management', 'Python', 'SQL', 'REST APIs', 'Stakeholder Management'],
    metric: '5 concurrent Fortune 500 accounts · Zero escalations · 75% reporting time reduction',
  },
  {
    date: '2024 – 2025',
    title: 'Deliberate Pause — Reading & Perspective',
    type: 'pause',
    description:
      'After years of bringing attentiveness and patience to work that stopped growing, I stepped back. Not a crisis — an honest recognition that the role had given me everything it had to offer. I used the time to read deeply in areas I\'d always been drawn to: financial analysis and data skepticism. Every book below is a different version of the same idea: don\'t accept the frame you\'re given. Verify it yourself. That discipline became the mission behind FinSurf.',
    tags: ['Value Investing', 'Data Literacy', 'Financial History', 'Critical Thinking'],
    quote: {
      text: 'No wonder poets sometimes have to seem / So much more business-like than business men. / Their wares are so much harder to get rid of.',
      attribution: 'Robert Frost, New Hampshire',
    },
    books: [
      {
        title: 'The Intelligent Investor',
        author: 'Benjamin Graham',
        takeaway: 'The company has its own motivations. The small shareholder has theirs. Do your own analysis — the numbers don\'t lie the way narratives do.',
      },
      {
        title: 'Factfulness',
        author: 'Hans Rosling',
        takeaway: 'Data is easily shaped to serve whoever presents it. The headline statistic is almost never the whole picture.',
      },
      {
        title: 'One Up on Wall Street',
        author: 'Peter Lynch',
        takeaway: 'Markets are human-driven and therefore readable — if you pay attention to what\'s actually happening rather than what analysts say should be.',
      },
      {
        title: 'The Data Detective',
        author: 'Tim Harford',
        takeaway: 'Curiosity, patience, and good sense are a method. Slow down before you conclude. Still reading.',
      },
    ],
  },
  {
    date: 'Sep 2025',
    title: 'Formal AI Systems Study — Microsoft Curriculum',
    type: 'education',
    description:
      'Completed Microsoft\'s AI Agents for Beginners curriculum (12 lessons) — covering agentic design patterns, multi-tool orchestration, memory, planning, and responsible AI. First structured study of the patterns applied in WikiSurf and FinSurf.',
    tags: ['Agentic AI', 'LangChain', 'Tool Use', 'Multi-Agent Orchestration', 'Prompt Engineering'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/sachined/ai-agents-for-beginners' },
    ],
  },
  {
    date: 'Feb 17, 2026',
    title: 'WikiSurf — Autonomous Research Agent',
    type: 'project',
    description:
      'First personal AI project: an autonomous research agent that accepts a natural-language query, orchestrates Wikipedia and DuckDuckGo search in a Thought → Action → Observation loop (up to 10 iterations), and returns structured summaries with cited sources. Dual LLM support via a factory pattern — Claude or GPT-4o selectable at runtime. Output rendered in a rich terminal UI with timestamped file saves.',
    tags: ['Python', 'LangChain', 'Claude API', 'OpenAI', 'Pydantic', 'Rich Terminal UI'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/sachined/WikiSurf-AI_Agent' },
    ],
  },
  {
    date: 'Feb – Mar 2026',
    title: 'FinSurf — Multi-Agent Investment Research Platform',
    type: 'project',
    description:
      'Production AI platform for stock analysis. A LangGraph state machine coordinates 5 specialized agents — Guardrail, Research, Tax Strategist, Dividend Specialist, and Sentiment Analyst — running in parallel where possible. Python handles all arithmetic; the LLM handles narrative only. Integrated Stripe payments, SQLite telemetry, and deployed via Docker + Caddy with automatic HTTPS. 27 commits in under 30 days from initial scaffold to live product.',
    tags: ['Python', 'LangGraph', 'React', 'Vite', 'Express', 'Stripe', 'Docker', 'Caddy', 'SQLite'],
    metric: '27 commits · 5 agents in production · Live at finsurf.net',
    links: [
      { label: 'Live ↗', href: 'https://finsurf.net' },
      { label: 'GitHub ↗', href: 'https://github.com/sachined/FinSurf' },
    ],
  },
  {
    date: 'Mar 2026',
    title: 'This Site — Full-Stack Portfolio Rebuild',
    type: 'project',
    description:
      'Rebuilt the original 2020 weather app into a full-stack portfolio platform. Added a live stock portfolio tracker (Yahoo Finance API), MongoDB persistence with a raw driver, a custom blog engine with YAML frontmatter parsing, theme system with FOUC prevention, and this Career Roadmap. TypeScript throughout, fully responsive.',
    tags: ['Next.js', 'TypeScript', 'MongoDB', 'Chart.js', 'Yahoo Finance API', 'CSS Modules'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/sachined/Weather-and-Billboard' },
    ],
  },
  {
    date: 'Now',
    title: "Where I'm Headed",
    callout: [
      {
        audience: 'For hiring managers',
        text: "I'm currently exploring AI Solutions Engineer roles. If your team is deploying AI into production workflows and needs someone who has already closed the gap between demo and real-world adoption, I'd like to talk.",
        highlight: true,
      },
      {
        audience: 'For everyone else',
        text: "If you're thinking about financial literacy, AI deployment, or what it means to build tools that give people back their time — I'm always open to that conversation.",
      },
    ],
    links: [
      { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/nediyanchath/' },
      { label: 'Contact', href: '/contact' },
      { label: 'Email ↗', href: 'mailto:sachin.nediyanchath@gmail.com' },
    ],
    closingQuote: {
      text: 'Louis, I think this is the beginning of a beautiful friendship.',
      attribution: 'Humphrey Bogart, Casablanca (1942)',
    },
  },
];

export default function TechnicalNarrative() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Technical Journey</h2>
      <p className={styles.subtitle}>
        From first principles to production AI systems.
      </p>
      <div className={styles.legend}>
        {LEGEND.map(({ label, color }) => (
          <span key={label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
      <div className={styles.timeline}>
        {MILESTONES.map((m, i) => (
          <div
            key={i}
            data-type={m.type}
            className={`${styles.milestone} ${m.callout ? styles.milestoneCta : ''}`}
          >
            <span className={styles.date}>{m.date}</span>
            <h3 className={styles.milestoneTitle}>{m.title}</h3>
            {m.role && <span className={styles.role}>{m.role}</span>}
            {m.metric && <p className={styles.metric}>{m.metric}</p>}
            {m.description && <p className={styles.description}>{m.description}</p>}
            {m.tags && m.tags.length > 0 && (
              <div className={styles.tags}>
                {m.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
            {m.quote && (
              <figure className={styles.quote}>
                <blockquote className={styles.quoteText}>
                  &ldquo;{m.quote.text}&rdquo;
                </blockquote>
                <figcaption className={styles.quoteAttribution}>
                  — {m.quote.attribution}
                </figcaption>
              </figure>
            )}
            {m.callout && (
              <div className={styles.calloutList}>
                {m.callout.map((c) => (
                  <div
                    key={c.audience}
                    className={`${styles.calloutItem} ${c.highlight ? styles.calloutItemHighlight : ''}`}
                  >
                    <span className={styles.calloutAudience}>{c.audience}</span>
                    <p className={styles.calloutText}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            {m.books && (
              <div className={styles.bookList}>
                {m.books.map((book) => (
                  <div key={book.title} className={styles.bookItem}>
                    <span className={styles.bookTitle}>{book.title}</span>
                    <span className={styles.bookAuthor}> — {book.author}</span>
                    <p className={styles.bookTakeaway}>{book.takeaway}</p>
                  </div>
                ))}
              </div>
            )}
            {m.links && (
              <div className={styles.links}>
                {m.links.map((link) =>
                  link.href.startsWith('/') ? (
                    <Link key={link.label} href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            )}
            {m.closingQuote && (
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteText}>
                  &ldquo;{m.closingQuote.text}&rdquo;
                </blockquote>
                <figcaption className={styles.quoteAttribution}>
                  — {m.closingQuote.attribution}
                </figcaption>
              </figure>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
