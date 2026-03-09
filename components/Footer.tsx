import SocialLinks from './SocialLinks';

interface FooterProps {
  color?: string;
  borderColor?: string;
  opacity?: number;
}

export default function Footer({ color, borderColor = 'var(--border-subtle)', opacity = 0.8 }: FooterProps) {
  return (
    <footer style={{
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: `1px solid ${borderColor}`,
      textAlign: 'center',
      color: color || 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <SocialLinks color={color} opacity={opacity} />
      <p>© {new Date().getFullYear()} Sachin Nediyanchath • Next.js • TypeScript</p>
    </footer>
  );
}
