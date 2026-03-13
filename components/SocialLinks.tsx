import { Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  color?: string;
  fontSize?: string;
  opacity?: number;
}

export default function SocialLinks({ color, fontSize = '1.5rem', opacity = 1 }: SocialLinksProps) {
  const customStyles = { 
    '--icon-color': color, 
    '--icon-size': fontSize, 
    '--icon-opacity': opacity 
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <a 
        href={SOCIAL_LINKS.linkedin} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={customStyles} 
        className={styles.iconLink}
        title="LinkedIn" 
        aria-label="LinkedIn profile"
      >
        <Linkedin size={fontSize} />
      </a>
      <a 
        href={SOCIAL_LINKS.github} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={customStyles} 
        className={styles.iconLink}
        title="GitHub" 
        aria-label="GitHub profile"
      >
        <Github size={fontSize} />
      </a>
      <Link href="/contact" style={customStyles} className={styles.iconLink} title="Contact Form" aria-label="Contact form">
        <Mail size={fontSize} />
      </Link>
    </div>
  );
}
