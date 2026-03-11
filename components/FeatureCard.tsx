import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  cta: string;
  Icon: LucideIcon;
  emoji?: string;
  emojiLabel?: string;
}

export default function FeatureCard({ href, external, title, description, cta, Icon }: FeatureCardProps) {
  const CardContent = (
    <div 
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        padding: '1.5rem 1.25rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-primary)'}}>
            <Icon size={40} strokeWidth={1.5}  />
        </div>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: '700' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>
          {description}
        </p>
      </div>
      <div style={{
        marginTop: '2rem',
        color: 'var(--accent-primary)',
        fontWeight: '700',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {cta} <span style={{ transition: 'transform 0.2s' }}>→</span>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {CardContent}
    </Link>
  );
}
