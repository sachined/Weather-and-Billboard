import Head from 'next/head';
import { CloudSun, TrendingUp, Bot, Briefcase, PenTool, Mail } from 'lucide-react';
import Layout from '@/components/layout';
import FeatureCard from '@/components/FeatureCard';
import GlobalDashboard from '@/components/Dashboard/GlobalDashboard';
import { SITE_NAME, SITE_TITLE } from '@/lib/constants';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{`${SITE_TITLE} - ${SITE_NAME}`}</title>
        <meta name="description" content="Explore weather and career growth tools" />
      </Head>
      
      <div className={styles.heroContainer}>
        {/* Hero Section - Text already handled by Layout, but we can add more if needed */}
        <div className={styles.heroContent}>
          <p className={styles.heroAccent}>
          </p>
          <p className={styles.heroDescription}>
            Discover tools for weather insights and career growth. Explore our new fresh theme or toggle between Midnight and Minimalist modes easily in the top navigation.
          </p>
        </div>

        {/* New Dashboard Snapshot */}
        <GlobalDashboard />

        {/* Cards Grid */}
        <div className={styles.cardsGrid}>
          <FeatureCard
            href="/weather-seek"
            Icon={CloudSun}
            title="Weather Lookup"
            description="Check real-time weather conditions for any location worldwide"
            cta="Explore"
          />

          <FeatureCard 
            href="/job-gap"
            Icon={TrendingUp}
            title="Technical Growth"
            description="A roadmap of my technical evolution, core expertise, and strategic pivot into AI-driven solutions."
            cta="View Roadmap"
          />

          <FeatureCard 
            href="https://finsurf.net"
            external
            Icon={Bot}
            title="Finsurf AI"
            description="Explore my latest AI-powered project for financial insights and automated analysis."
            cta="Visit Website"
            isFeatured
          />

          <FeatureCard 
            href="/portfolio"
            Icon={Briefcase}
            title="Growth Strategy"
            description="Track my 10-year consolidated growth and income investment strategy with real-time analytics."
            cta="View Strategy"
          />

          <FeatureCard
            href="/blog"
            Icon={PenTool}
            title="Insights & Articles"
            description="Read my latest thoughts on AI Solutions, Technical Strategy, and the evolution of Enterprise Software."
            cta="Read Blog"
          />

          <FeatureCard 
            href="/contact"
            Icon={Mail}
            title="Connect & Inquire"
            description="Interested in collaborating or discussing technical strategy? Let's connect through a reliable channel."
            cta="Contact Me"
          />
        </div>
      </div>
    </Layout>
  );
}
