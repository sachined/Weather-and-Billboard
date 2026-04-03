import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './layout.module.css';
import { useTheme } from '../hooks/useTheme';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { href: 'https://finsurf.net/', label: 'FinSurf App', external: true },
  { href: '/', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/journey', label: 'Journey' },
  { href: '/finsurf', label: 'FinSurf Product'}
];

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMinimalist = theme === 'light';
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  return (
    <nav className={styles.navbar}>
      <button
        className={styles.hamburger}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineTop : ''}`} />
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineMid : ''}`} />
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineBot : ''}`} />
      </button>

      <ul className={`${styles.navList} ${isOpen ? styles.navOpen : ''}`}>
        {navLinks.map((link) => {
          if (link.external) {
            return (
              <li key={link.href} className={styles.navItem}>
                <a
                  href={link.href}
                  className={styles.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            );
          }
          const isActive = router.pathname === link.href;
          return (
            <li key={link.href} className={styles.navItem}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''} ${isMinimalist && isActive ? styles.minimalistActiveNavLink : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                {isMinimalist && isActive && <span className={styles.minimalistDot} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
