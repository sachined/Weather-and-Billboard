import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import { SITE_NAME, SITE_TITLE } from '../lib/constants';
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
        <meta
          name="description"
          content={`Weather and career growth tools by ${name}`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className={styles.header}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <ThemeToggle />
        </div>
        {home ? (
          <>
            <Image
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
              width={128}
              height={128}
              priority
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <Image
                src="/images/profile.jpg"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
                width={96}
                height={96}
              />
            </Link>
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
