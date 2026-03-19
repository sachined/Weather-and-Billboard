import Link from 'next/link';
import SocialLinks from './SocialLinks';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.cta}>
        Open to interesting problems.{' '}
        <Link href="/contact" className={styles.ctaLink}>Let&apos;s talk →</Link>
      </p>
      <SocialLinks />
      <p className={styles.meta}>© {new Date().getFullYear()} Sachin Nediyanchath · Next.js · TypeScript</p>
    </footer>
  );
}
