import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { SOCIAL_LINKS } from '../lib/constants';

interface SocialLinksProps {
  color?: string;
  fontSize?: string;
  opacity?: number;
}

export default function SocialLinks({ color, fontSize = '1.5rem', opacity = 1 }: SocialLinksProps) {
  const iconStyle = { color, fontSize, opacity };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
      <a 
        href={SOCIAL_LINKS.linkedin} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={iconStyle} 
        title="LinkedIn" 
        aria-label="LinkedIn profile"
      >
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
      <a 
        href={SOCIAL_LINKS.github} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={iconStyle} 
        title="GitHub" 
        aria-label="GitHub profile"
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <Link href="/contact" style={iconStyle} title="Contact Form" aria-label="Contact form">
        <FontAwesomeIcon icon={faEnvelope} />
      </Link>
    </div>
  );
}
