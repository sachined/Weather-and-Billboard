import Head from 'next/head';
import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';
import Link from 'next/link';
import Footer from './Footer';
import { SITE_NAME, SITE_TITLE, PROFILE_VERSION } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';
import Navbar from './Navbar';

const name = SITE_NAME;
export const siteTitle = SITE_TITLE;

interface LayoutProps {
  children: React.ReactNode;
  home?: boolean;
}

export default function Layout({ children, home }: LayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title="Sachin Nediyanchath" href="/blog/feed.xml" />
        <meta
          name="description"
          content={`Software engineer building AI tools and products. Explore FinSurf, investment strategy, and more.`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className={styles.header}>
        <div className={styles.themeToggleContainer}>
          <ThemeToggle />
        </div>
        {home ? (
          <>
            <img
              src={`/blog/images/profile.jpg?v=${PROFILE_VERSION}`}
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
              width={128}
              height={128}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <a href="https://finsurf.net/">
              <img
                src={`/blog/images/profile.jpg?v=${PROFILE_VERSION}`}
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
                width={96}
                height={96}
              />
            </a>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
        <Navbar />
      </header>
      <main id="main-content">{children}</main>
      
      <Footer />
    </div>
  );
}
