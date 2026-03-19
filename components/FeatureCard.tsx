import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import styles from './FeatureCard.module.css';

export type CardCategory = 'ai' | 'cli' | 'finance' | 'writing' | 'connect';

const categoryLabels: Record<CardCategory, string> = {
  ai:      'AI Agent',
  cli:     'CLI Tool',
  finance: 'Investment',
  writing: 'Writing',
  connect: 'Connect',
};

interface FeatureCardProps {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  cta: string;
  Icon: LucideIcon;
  isFeatured?: boolean;
  category?: CardCategory;
  lineageTag?: string;
}

export default function FeatureCard({
  href, external, title, description, cta, Icon,
  isFeatured, category, lineageTag,
}: FeatureCardProps) {
  const CardContent = (
    <div className={`${styles.card} ${isFeatured ? styles.featured : ''} ${category ? styles[`cat_${category}`] : ''}`}>
      {isFeatured && <div className={styles.badge}>Featured Project</div>}

      <div className={isFeatured ? styles.featuredInner : styles.inner}>
        {/* Icon with tinted background */}
        <div className={`${styles.iconWrapper} ${isFeatured ? styles.iconWrapperFeatured : ''} ${category ? styles[`icon_${category}`] : ''}`}>
          <Icon size={isFeatured ? 52 : 36} strokeWidth={1.5} />
        </div>

        <div className={styles.content}>
          <h2 className={`${styles.title} ${isFeatured ? styles.titleFeatured : ''}`}>
            {title}
          </h2>

          {lineageTag && (
            <span className={styles.lineageTag}>{lineageTag}</span>
          )}

          <p className={styles.description}>{description}</p>

          <div className={styles.footer}>
            <div className={styles.cta}>
              {cta} <span className={styles.arrow}>→</span>
            </div>
            {category && !isFeatured && (
              <span className={`${styles.categoryChip} ${styles[`chip_${category}`]}`}>
                {categoryLabels[category]}
              </span>
            )}
          </div>
        </div>
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
