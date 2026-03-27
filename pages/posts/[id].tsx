import Head from 'next/head';
import Layout from '@/components/layout';
import { getAllPostIds, getPostData } from '@/lib/posts';
import utilStyles from '@/styles/utils.module.css';
import styles from '@/styles/Post.module.css';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);

  // Get all posts to find others in the same series
  let seriesPosts: Array<{ id: string; title: string; series_position?: number }> | null = null;
  if (postData.series) {
    const allPosts = getAllPostIds().map(p => p.params.id);
    const allPostsData = await Promise.all(
      allPosts.map(id => getPostData(id).catch(() => null))
    );

    const filteredPosts = allPostsData
      .filter(p => p && p.series === postData.series)
      .sort((a, b) => (a?.series_position ?? 0) - (b?.series_position ?? 0))
      .map(p => ({
        id: p?.id || '',
        title: p?.title || '',
        series_position: p?.series_position,
      }))
      .filter(p => p.id);

    seriesPosts = filteredPosts.length > 0 ? filteredPosts : null;
  }

  return {
    props: {
      postData: {
        ...postData,
        seriesPosts,
      },
    },
  };
};

export interface PostProps {
  postData: {
    id: string;
    title: string;
    date: string;
    contentHtml: string;
    prevPost?: { id: string; title: string } | null;
    nextPost?: { id: string; title: string } | null;
    series?: string;
    series_position?: number;
    seriesPosts: Array<{ id: string; title: string; series_position?: number }> | null;
  };
}

export default function Post({ postData }: PostProps) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} - {SITE_NAME}</title>
      </Head>
      
      <div className={styles.backButton}>
        <Link href="/">← Back to Blog</Link>
      </div>

      <article className={styles.postContainer}>
        <header className={styles.postHeader}>
          {postData.series && (
            <div className={styles.seriesBreadcrumb}>
              <span className={styles.seriesLabel}>{postData.series}</span>
              {postData.series_position && (
                <span className={styles.seriesPosition}>Part {postData.series_position}</span>
              )}
            </div>
          )}
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div className={utilStyles.lightText}>
            {new Date(postData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        {postData.seriesPosts && Array.isArray(postData.seriesPosts) && postData.seriesPosts.length > 1 && (
          <div className={styles.seriesSection}>
            <h3 className={styles.seriesSectionTitle}>Reading this series</h3>
            <nav className={styles.seriesList}>
              {postData.seriesPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className={`${styles.seriesItem} ${post.id === postData.id ? styles.seriesItemActive : ''}`}
                >
                  {post.series_position && (
                    <span className={styles.seriesItemNumber}>
                      {post.series_position}.
                    </span>
                  )}
                  <span className={styles.seriesItemTitle}>{post.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </article>

      <nav className={styles.postNavigation}>
        <div>
          {postData.prevPost && (
            <Link href={`/posts/${postData.prevPost.id}`} className={styles.navLink}>
              <small className={styles.navLabel}>Previous Article</small>
              <div className={styles.navTitle}>
                ← {postData.prevPost.title}
              </div>
            </Link>
          )}
        </div>
        <div className={styles.navNext}>
          {postData.nextPost && (
            <Link href={`/posts/${postData.nextPost.id}`} className={styles.navLink}>
              <small className={styles.navLabel}>Next Article</small>
              <div className={styles.navTitle}>
                {postData.nextPost.title} →
              </div>
            </Link>
          )}
        </div>
      </nav>
    </Layout>
  );
}
