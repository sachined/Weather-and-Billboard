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
  return {
    props: {
      postData,
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
