import Head from 'next/head';
import Layout from '../components/layout';
import FeatureCard from '../components/FeatureCard';
import GlobalDashboard from '../components/Dashboard/GlobalDashboard';
import { CloudSun, TrendingUp, Bot, Briefcase, PenTool, Mail } from 'lucide-react';
import { SITE_NAME, SITE_TITLE } from '../lib/constants';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{`${SITE_TITLE} - ${SITE_NAME}`}</title>
        <meta name="description" content="Explore weather and career growth tools" />
      </Head>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem'
      }}>
        {/* Hero Section - Text already handled by Layout, but we can add more if needed */}
        <div style={{
          textAlign: 'center',
          color: 'var(--text-main)',
          marginBottom: '3rem',
          maxWidth: '600px'
        }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            marginBottom: '0.5rem'
          }}>
          </p>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.85,
            lineHeight: '1.6',
            color: 'var(--text-muted)'
          }}>
            Discover tools for weather insights and career growth. Explore our new fresh theme or toggle between Midnight and Minimalist modes easily in the top navigation.
          </p>
        </div>

        {/* New Dashboard Snapshot */}
        <GlobalDashboard />

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          width: '100%',
          alignItems: 'stretch'
        }}>

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
