import { TrendingUp, Bot, Briefcase, PenTool } from 'lucide-react';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import FeatureCard from '@/components/FeatureCard';
import GlobalDashboard from '@/components/Dashboard/GlobalDashboard';
import { SITE_NAME, SITE_URL, BASE_PATH, SOCIAL_LINKS } from '@/lib/constants';
import styles from '@/styles/Home.module.css';

export default function About() {
  return (
    <Layout>
      <SEO
        title="About"
        description="Software engineer building AI-powered tools and products. Explore my projects, roadmap, and writing."
        path="/about"
        ogImage={`${SITE_URL}${BASE_PATH}/api/og?title=${encodeURIComponent('Sachin Nediyanchath — Software Engineer & AI Builder')}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE_NAME,
          url: `${SITE_URL}${BASE_PATH}/about`,
          jobTitle: 'Software Engineer',
          sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
        }}
      />

      <div className={styles.heroContainer}>
        {/* Hero */}
        <div className={styles.heroContent}>
          <p className={styles.heroAccent}>Building at the edge of AI and enterprise software</p>
          <p className={styles.heroDescription}>
            From enterprise AI to production-grade personal tools —
            I&apos;m a software engineer focused on turning complex systems into
            useful products. Explore my work below.
          </p>
        </div>

        {/* Origin story */}
        <section className={styles.originStory} aria-label="Origin story">
          <p className={styles.originQuote}>&ldquo;A little rigorous research goes a long way.&rdquo;</p>
        </section>

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

        {/* Technical Growth — recruiter CTA */}
        <div className={styles.recruiterSection}>
          <p className={styles.recruiterEyebrow}>For recruiters &amp; hiring teams</p>
          <FeatureCard
            href="/journey"
            Icon={TrendingUp}
            title="Technical Growth"
            description="My path from enterprise software to AI — skills, pivots, and what I'm focused on next."
            cta="View Journey"
            category="career"
          />
        </div>

        {/* Section divider */}
        <div className={styles.sectionDivider}>
          <span className={styles.sectionLabel}>Explore more</span>
        </div>

        {/* Secondary cards */}
        <div className={styles.cardsGrid}>
          <FeatureCard
            href="/portfolio"
            Icon={Briefcase}
            title="Growth Strategy"
            description="A long-horizon investment framework I've built and track publicly — 10 years, one strategy."
            cta="View Strategy"
            category="finance"
          />

          <FeatureCard
            href="/"
            Icon={PenTool}
            title="Insights & Articles"
            description="Writing on AI, enterprise software, and where the two are colliding."
            cta="Read Blog"
            category="writing"
          />
        </div>

        {/* Live dashboard — sits behind the cards above */}
        <div className={styles.dashboardWrapper}>
          <GlobalDashboard />
        </div>

      </div>
    </Layout>
  );
}