import Head from 'next/head';
import { CloudSun, TrendingUp, Bot, Briefcase, PenTool, Mail, Terminal } from 'lucide-react';
import Layout from '@/components/layout';
import FeatureCard from '@/components/FeatureCard';
import GlobalDashboard from '@/components/Dashboard/GlobalDashboard';
import ProjectLineage from '@/components/ProjectLineage';
import { SITE_NAME, SITE_TITLE } from '@/lib/constants';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Sachin Nediyanchath — Software Engineer & AI Builder</title>
        <meta name="description" content="Software engineer building AI-powered tools and products. Explore my projects, roadmap, and writing." />
        <meta name="og:title" content="Sachin Nediyanchath — Software Engineer & AI Builder" />
        <meta name="og:description" content="Software engineer building AI-powered tools and products." />
      </Head>

      <div className={styles.heroContainer}>
        {/* Hero */}
        <div className={styles.heroContent}>
          <p className={styles.heroRole}>Senior software engineer · AI systems · Enterprise background</p>
          <p className={styles.heroAccent}>Building at the edge of AI and enterprise software</p>
          <p className={styles.heroDescription}>
            From real-time weather tools to AI-powered financial analysis —
            I&apos;m a software engineer focused on turning complex systems into
            useful products. Explore my work below.
          </p>
        </div>

        {/* Origin story */}
        <section className={styles.originStory} aria-label="Origin story">
          <p className={styles.originQuote}>&ldquo;A little rigorous research goes a long way.&rdquo;</p>
          <p className={styles.originText}>
            My interest in markets started in senior year economics, where we paper-traded
            in the aftermath of the 2008 financial crisis. While others focused on the panic,
            I tracked Citi&apos;s fundamentals and recognized the stock was disconnected from the
            underlying business. That insight — that research beats noise — posted a strong
            paper return and stuck with me ever since.
            I didn&apos;t enter the real markets until January 2021, and everything in the portfolio
            tracker below reflects that journey. The same curiosity eventually led me to build
            FinSurf: bringing that same research discipline, now powered by AI.
          </p>
        </section>

        {/* Live dashboard */}
        <GlobalDashboard />

        {/* WikiSurf → FinSurf lineage */}
        <ProjectLineage />

        {/* Featured project — FinSurf */}
        <div className={styles.featuredSection}>
          <FeatureCard
            href="/finsurf"
            Icon={Bot}
            title="FinSurf AI"
            description="My flagship project: an AI assistant for financial research and market analysis. Live now."
            cta="Learn More"
            isFeatured
            category="ai"
            lineageTag="← Evolved from WikiSurf"
          />
        </div>

        {/* Section divider */}
        <div className={styles.sectionDivider}>
          <span className={styles.sectionLabel}>Explore more</span>
        </div>

        {/* Secondary cards */}
        <div className={styles.cardsGrid}>
          <FeatureCard
            href="/weather-seek"
            Icon={CloudSun}
            title="Weather Lookup"
            description="Live weather for any city in the world — conditions, wind, and forecasts at a glance."
            cta="Explore"
            category="cli"
          />

          <FeatureCard
            href="/job-gap"
            Icon={TrendingUp}
            title="Technical Growth"
            description="My path from enterprise software to AI — skills, pivots, and what I'm focused on next."
            cta="View Journey"
            category="writing"
          />

          <FeatureCard
            href="/portfolio"
            Icon={Briefcase}
            title="Growth Strategy"
            description="A long-horizon investment framework I've built and track publicly — 10 years, one strategy."
            cta="View Strategy"
            category="finance"
          />

          <FeatureCard
            href="/blog"
            Icon={PenTool}
            title="Insights & Articles"
            description="Writing on AI, enterprise software, and where the two are colliding."
            cta="Read Blog"
            category="writing"
          />

          <FeatureCard
            href="https://github.com/sachined/WikiSurf-AI_Agent"
            external
            Icon={Terminal}
            title="WikiSurf"
            description="A CLI research agent that autonomously searches Wikipedia and DuckDuckGo, then returns structured summaries in a rich terminal UI."
            cta="View on GitHub"
            category="cli"
            lineageTag="Foundation for FinSurf →"
          />

          <FeatureCard
            href="/contact"
            Icon={Mail}
            title="Connect & Inquire"
            description="Have a project in mind or want to talk shop? I'm always open to interesting conversations."
            cta="Contact Me"
            category="connect"
          />
        </div>
      </div>
    </Layout>
  );
}
