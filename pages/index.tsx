import Link from 'next/link';
import { useState, useMemo } from 'react';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import { SITE_NAME, SITE_URL, BASE_PATH } from '@/lib/constants';
import { getSortedPostsData, PostData, getSeriesSummaries, SeriesSummary } from '@/lib/posts';
import styles from '@/styles/Blog.module.css';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const seriesSummaries = getSeriesSummaries();
  return {
    props: {
      allPostsData,
      seriesSummaries,
    },
  };
};

export default function Blog({ allPostsData, seriesSummaries }: { allPostsData: PostData[]; seriesSummaries: SeriesSummary[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    allPostsData.forEach(({ tags }) => tags?.forEach((t) => { tagCount[t] = (tagCount[t] ?? 0) + 1; }));
    return Object.keys(tagCount).filter((t) => tagCount[t] > 1).sort();
  }, [allPostsData]);

  const filtered = activeTag
    ? allPostsData.filter(({ tags }) => tags?.includes(activeTag))
    : allPostsData;

  const featured = !activeTag && filtered.length > 0 ? filtered[0] : null;
  const rest = !activeTag ? filtered.slice(1) : filtered;

  return (
    <Layout>
      <SEO
        title="Insights & Articles"
        description="Notes on AI, engineering, and the markets. Technical writing on FinSurf, security, and building in public."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: SITE_NAME,
          description: 'Notes on AI, engineering, and the markets.',
          url: `${SITE_URL}${BASE_PATH}/`,
          author: { '@type': 'Person', name: SITE_NAME },
        }}
      />

      <header className={styles.header}>
        <p className={styles.pageEyebrow}>Insights &amp; Articles</p>
        <h1 className={styles.heroStatement}>Notes on AI, engineering,<br />and the markets.</h1>
      </header>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterPill} ${activeTag === null ? styles.filterPillActive : ''}`}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`${styles.filterPill} ${activeTag === tag ? styles.filterPillActive : ''}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.emptyState}>No posts found.</p>
      ) : (
        <>
          {featured && (
            <article className={styles.featuredCard}>
              <div className={styles.featuredMeta}>
                <div className={styles.featuredEyebrowGroup}>
                  <span className={styles.featuredEyebrow}>Latest</span>
                  {featured.series && (
                    <span className={styles.cardSeries}>{featured.series}</span>
                  )}
                </div>
                <span className={styles.readingTime}>{featured.readingTime} min read</span>
              </div>
              <h2 className={styles.featuredTitle}>
                <Link href={`/posts/${featured.id}`}>{featured.title}</Link>
              </h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <div className={styles.featuredFooter}>
                <div className={styles.tagList}>
                  {featured.tags?.map((tag) => (
                    <button
                      key={tag}
                      className={`${styles.tagBadge} ${activeTag === tag ? styles.tagBadgeActive : ''}`}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <Link href={`/posts/${featured.id}`} className={styles.featuredCta}>
                  Read Article →
                </Link>
              </div>
            </article>
          )}

          {seriesSummaries.length > 0 && (
            <div className={styles.seriesTeaser}>
              <p className={styles.seriesTeaserHeading}>Ongoing Series</p>
              <div className={styles.seriesCards}>
                {seriesSummaries.map((s) => (
                  <Link key={s.slug} href={`/series/${s.slug}`} className={styles.seriesCard}>
                    <span className={styles.seriesCardName}>{s.name}</span>
                    <span className={styles.seriesCardDesc}>{s.description}</span>
                    <div className={styles.seriesCardFooter}>
                      <span className={styles.seriesCardCount}>
                        {s.postCount} {s.postCount === 1 ? 'post' : 'posts'}
                      </span>
                      <span className={styles.seriesCardCta}>Explore →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className={styles.blogGrid}>
              {rest.map(({ id, date, title, excerpt, tags, readingTime, highlight, series }) => (
                <article className={`${styles.blogCard} ${highlight ? styles.blogCardHighlight : ''}`} key={id}>
                  <div className={styles.cardMeta}>
                    <small className={styles.cardDate}>
                      {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </small>
                    <small className={styles.readingTime}>{readingTime} min read</small>
                  </div>
                  {series && <span className={styles.cardSeries}>{series}</span>}
                  <h2 className={styles.postTitle}>
                    <Link href={`/posts/${id}`} className={styles.postLink}>
                      {title}
                    </Link>
                  </h2>
                  <p className={styles.postExcerpt}>{excerpt}</p>
                  {tags?.length > 0 && (
                    <div className={styles.tagList}>
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          className={`${styles.tagBadge} ${activeTag === tag ? styles.tagBadgeActive : ''}`}
                          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                  <Link href={`/posts/${id}`} className={styles.readMore}>
                    Read →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}