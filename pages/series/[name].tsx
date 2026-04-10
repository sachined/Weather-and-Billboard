import Link from 'next/link';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import { getSeriesSummaries, SeriesSummary } from '@/lib/posts';
import { GetStaticProps, GetStaticPaths } from 'next';
import { SITE_URL, BASE_PATH } from '@/lib/constants';
import styles from '@/styles/Series.module.css';

export const getStaticPaths: GetStaticPaths = async () => {
  const series = getSeriesSummaries();
  return {
    paths: series.map((s) => ({ params: { name: s.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const series = getSeriesSummaries();
  const seriesData = series.find((s) => s.slug === (params?.name as string));
  if (!seriesData) return { notFound: true };
  return { props: { seriesData } };
};

export default function SeriesPage({ seriesData }: { seriesData: SeriesSummary }) {
  return (
    <Layout>
      <SEO
        title={seriesData.name}
        description={seriesData.description}
        path={`/series/${seriesData.slug}`}
        ogImage={`${SITE_URL}${BASE_PATH}/api/og?title=${encodeURIComponent(seriesData.name)}&series=${encodeURIComponent(seriesData.name)}`}
      />

      <div className={styles.backButton}>
        <Link href="/">← Back to Blog</Link>
      </div>

      <header className={styles.seriesHeader}>
        <div className={styles.seriesMeta}>
          <span className={styles.seriesEyebrow}>Series</span>
          <span className={styles.seriesPostCount}>
            {seriesData.postCount} {seriesData.postCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
        <h1 className={styles.seriesTitle}>{seriesData.name}</h1>
        <p className={styles.seriesDescription}>{seriesData.description}</p>
      </header>

      <div className={styles.postList}>
        {seriesData.posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.id}`} className={styles.postItem}>
            <div className={styles.postItemLeft}>
              {post.series_position !== undefined && (
                <span className={styles.postNumber}>{post.series_position}</span>
              )}
            </div>
            <div className={styles.postItemContent}>
              <div className={styles.postItemMeta}>
                <span className={styles.postItemDate}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className={styles.postItemTime}>{post.readingTime} min read</span>
                {index === 0 && (
                  <span className={styles.startHere}>Start here</span>
                )}
              </div>
              <h2 className={styles.postItemTitle}>{post.title}</h2>
              <p className={styles.postItemExcerpt}>{post.excerpt}</p>
              <span className={styles.readLink}>Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
