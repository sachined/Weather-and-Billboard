import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout';
import styles from '@/styles/Finsurf.module.css';

export default function FinSurf() {
  return (
    <Layout>
      <Head>
        <title>FinSurf — AI-Powered Financial Research</title>
        <meta
          name="description"
          content="FinSurf is an AI assistant for financial research and market analysis. Multi-agent LangGraph architecture, deterministic Python math, and PDF export."
        />
      </Head>

      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Featured Project</p>
          <h1 className={styles.heroTitle}>FinSurf AI</h1>
          <p className={styles.heroTagline}>
            An AI-powered financial research tool that combines multi-agent analysis
            with deterministic Python math — so the numbers are always right, and the
            narrative always makes sense.
          </p>
          <a
            href="https://finsurf.net"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroCta}
          >
            Visit Live Site →
          </a>
        </section>

        {/* What it does */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What it does</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>Multi-Agent Analysis</h3>
              <p className={styles.featureDesc}>
                Autonomous AI agents coordinate to research a stock end-to-end —
                covering fundamentals, dividends, capital gains, and analyst sentiment.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧮</div>
              <h3 className={styles.featureTitle}>Deterministic Math</h3>
              <p className={styles.featureDesc}>
                All financial calculations — holding periods, capital gains, dividend
                projections — run through native Python logic. AI explains the numbers;
                it never guesses them.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3 className={styles.featureTitle}>PDF Export</h3>
              <p className={styles.featureDesc}>
                Download full research reports as themed PDFs. Built with a custom
                color-resolution utility to support modern CSS (Tailwind 4 / oklch).
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <ol className={styles.stepList}>
            <li className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>LangGraph state machine</p>
                <p className={styles.stepDesc}>
                  A directed graph orchestrates the agent workflow. Each node only fires
                  when its preconditions are met — e.g., the Dividend Specialist only
                  runs if the Research Agent confirms the stock pays dividends. This
                  eliminates wasted API calls and improves reliability.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>"Validate with Python, Explain with AI"</p>
                <p className={styles.stepDesc}>
                  Financial arithmetic is handled entirely in Python. The LLM receives
                  verified numbers and is responsible only for interpretation and
                  narrative — the pattern that turned FinSurf from plausible-sounding
                  to actually trustworthy.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>Token cost tracking</p>
                <p className={styles.stepDesc}>
                  Every inference call is logged to SQLite (WAL mode) with token counts
                  and cost estimates across Gemini, Groq, Ollama, and Perplexity.
                  Production AI needs cost visibility.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Tech stack */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech stack</h2>
          <ul className={styles.techList}>
            {[
              'LangGraph',
              'Python',
              'React 19',
              'Tailwind CSS 4',
              'SQLite (WAL)',
              'Gemini',
              'Groq',
              'Perplexity',
              'Ollama',
              'html2canvas',
            ].map((t) => (
              <li key={t} className={styles.techChip}>{t}</li>
            ))}
          </ul>
        </section>

        {/* Roadmap */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What's next</h2>
          <ul className={styles.roadmapList}>
            <li className={styles.roadmapItem}>
              <span>
                <span className={styles.roadmapLabel}>Historical Profit Analyzer</span>
                {' '}— deterministic P&L and cost-basis analysis across positions.
              </span>
            </li>
            <li className={styles.roadmapItem}>
              <span>
                <span className={styles.roadmapLabel}>Multi-Ticker Batching</span>
                {' '}— upload a CSV, run sequential analysis across a full portfolio.
              </span>
            </li>
            <li className={styles.roadmapItem}>
              <span>
                <span className={styles.roadmapLabel}>AI Chat Layer</span>
                {' '}— ask follow-up questions directly against an existing report.
              </span>
            </li>
          </ul>
        </section>

        {/* Footer CTA */}
        <div className={styles.footerCta}>
          <p className={styles.footerCtaText}>
            Live and actively evolving.
          </p>
          <a
            href="https://finsurf.net"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkPrimary}
          >
            Open FinSurf →
          </a>
          <Link href="/blog" className={styles.linkSecondary}>
            Read the build logs
          </Link>
        </div>
      </div>
    </Layout>
  );
}
