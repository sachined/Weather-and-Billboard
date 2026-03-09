import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './layout.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/job-gap', label: 'Roadmap' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/weather-seek', label: 'Weather' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <li key={link.href} className={styles.navItem}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
