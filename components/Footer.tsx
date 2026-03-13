import SocialLinks from './SocialLinks';
import styles from './Footer.module.css';

interface FooterProps {
  color?: string;
  borderColor?: string;
  opacity?: number;
}

export default function Footer({ color, borderColor = 'var(--border-subtle)', opacity = 0.8 }: FooterProps) {
  const customStyles = {
    '--footer-border-color': borderColor,
    '--footer-color': color
  } as React.CSSProperties;

  return (
    <footer className={styles.footer} style={customStyles}>
      <SocialLinks color={color} opacity={opacity} />
      <p>© {new Date().getFullYear()} Sachin Nediyanchath • Next.js • TypeScript</p>
    </footer>
  );
}
