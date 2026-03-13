import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout';
import { SITE_NAME } from '@/lib/constants';
import { getSortedPostsData, PostData } from '@/lib/posts';
import utilStyles from '@/styles/utils.module.css';
import styles from '@/styles/Blog.module.css';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Blog({ allPostsData }: { allPostsData: PostData[] }) {
  return (
    <Layout>
      <Head>
        <title>{`Insights & Articles - ${SITE_NAME}`}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1 className={utilStyles.headingXl}>Insights & Articles</h1>
        <p className={styles.headerSubtitle}>
          Read my latest thoughts on AI Solutions, Technical Strategy, and the evolution of Enterprise Software.
        </p>
      </section>
      <section className={utilStyles.padding1px}>
        <div className={styles.blogGrid}>
          {allPostsData.map(({ id, date, title, excerpt }) => (
            <div className={styles.blogCard} key={id}>
              <small className={utilStyles.lightText}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </small>
              <h2 className={styles.postTitle}>
                <Link href={`/posts/${id}`} className={styles.postLink}>
                  {title}
                </Link>
              </h2>
              <p className={styles.postExcerpt}>{excerpt}</p>
              <Link href={`/posts/${id}`} className={styles.readMore}>
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}