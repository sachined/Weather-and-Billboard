import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './layout.module.css';
import {useTheme} from "../hooks/useTheme";

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
  const theme = useTheme();
  const isMinimalist = theme === 'light';
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <li key={link.href} className={styles.navItem}>
              <Link href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                style={isMinimalist && isActive ? { borderBottom: 'none', color: 'var(--accent-primary)' } : {}}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isMinimalist && isActive && (
                    <span style={
                      {
                        position: 'absolute',
                        bottom: '2px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)'
                      }
                    } />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
