import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  cta: string;
  Icon: LucideIcon;
  emoji?: string;
  emojiLabel?: string;
  isFeatured?: boolean;
}

export default function FeatureCard({ href, external, title, description, cta, Icon, isFeatured }: FeatureCardProps) {
  const CardContent = (
    <div className={`${styles.card} ${isFeatured ? styles.featured : ''}`}>
      {isFeatured && <div className={styles.badge}>Trending</div>}
      <div>
        <div className={styles.iconWrapper}>
            <Icon size={40} strokeWidth={1.5}  />
        </div>
        <h2 className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>
          {description}
        </p>
      </div>
      <div className={styles.cta}>
        {cta} <span className={styles.arrow}>→</span>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} className={styles.cardLink}>
      {CardContent}
    </Link>
  );
}
