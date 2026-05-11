import Link from 'next/link';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import { SITE_URL, BASE_PATH } from '@/lib/constants';
import styles from '@/styles/Finsurf.module.css';

export default function FinSurf() {
  return (
    <Layout>
      <SEO
        title="FinSurf — AI-Powered Financial Research"
        description="FinSurf is an AI assistant for financial research and market analysis. Multi-agent LangGraph architecture, deterministic Python math, and PDF export."
        path="/finsurf"
        ogImage={`${SITE_URL}${BASE_PATH}/api/og?title=${encodeURIComponent('FinSurf — AI-Powered Financial Research')}`}
      />

      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Featured Project</p>
          <h1 className={styles.heroTitle}>FinSurf AI</h1>
          <p className={styles.heroTagline}>
            An AI-powered financial tool — multi-agent equity research, options strategy
            analysis, and deterministic Python math. The numbers are always right.
            The narrative always makes sense.
          </p>
          <a
            href="https://finsurf.net"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroCta}
          >
            Try FinSurf →
          </a>
        </section>

        {/* Credibility bar */}
        <div className={styles.metricsBar}>
          <span className={styles.metricItem}>5 agents</span>
          <span className={styles.metricDot}>·</span>
          <span className={styles.metricItem}>236 commits</span>
          <span className={styles.metricDot}>·</span>
          <span className={styles.metricItem}>Live since Mar 2026</span>
        </div>

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
                <p className={styles.stepTitle}>&ldquo;Validate with Python, Explain with AI&rdquo;</p>
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

          {/* Tech chips — inline, no heading */}
          <ul className={styles.techList}>
            {[
              'LangGraph',
              'Python',
              'React 19',
              'SQLite (WAL)',
              'Docker + Caddy',
            ].map((t) => (
              <li key={t} className={styles.techChip}>{t}</li>
            ))}
          </ul>
        </section>

        {/* Portfolio Tracker */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Portfolio Tracker</h2>
          <p className={styles.stepDesc}>
            A live investment dashboard built alongside FinSurf — real positions,
            layer-based allocations (Anchor, Growth, Asymmetric, Income), and
            5-year portfolio history with options P&amp;L baked in. Open options
            positions are tracked with strategy type, DTE, strikes, and net credit.
            Realized P&amp;L from closed, expired, and assigned contracts surfaces
            separately from equity value — so the two signals stay readable independently.
            Yahoo Finance provides live prices via a server-side proxy with 15-minute caching.
          </p>
          <ul className={styles.techList}>
            {['Next.js API Routes', 'Chart.js', 'Yahoo Finance', 'CSS Modules', 'React Hooks', 'Options Tracking'].map((t) => (
              <li key={t} className={styles.techChip}>{t}</li>
            ))}
          </ul>
          <Link href="/portfolio" className={styles.linkSecondary} style={{ display: 'inline-block', marginTop: '1rem' }}>
            View live portfolio →
          </Link>
        </section>

        {/* Footer CTA */}
        <div className={styles.footerCta}>
          <div className={styles.footerCtaButtons}>
            <a
              href="https://finsurf.net"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkPrimary}
            >
              Open FinSurf →
            </a>
            <Link href="/" className={styles.linkSecondary}>
              Read the build logs
            </Link>
          </div>
        </div>

        {/* Epigraph — page closer */}
        <figure className={styles.epigraph}>
          <blockquote className={styles.epigraphText}>
            &ldquo;The audience is always a little ahead of you.&rdquo;
          </blockquote>
          <figcaption className={styles.epigraphAttribution}>
            — Humphrey Bogart, quoted in <em>Bogart</em> by A.M. Sperber &amp; Eric Lax
          </figcaption>
        </figure>
      </div>
    </Layout>
  );
}
