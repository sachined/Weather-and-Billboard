import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout';
import { getSortedPostsData, PostData } from '../lib/posts';
import utilStyles from '../styles/utils.module.css';
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
        <title>Insights & Articles - Sachin Nediyanchath</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1 className={utilStyles.headingXl}>Insights & Articles</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Read my latest thoughts on AI Solutions, Technical Strategy, and the evolution of Enterprise Software.
        </p>
      </section>
      <section className={utilStyles.padding1px}>
        <div className="blog-grid">
          {allPostsData.map(({ id, date, title, excerpt }) => (
            <div className="blog-card" key={id}>
              <small className={utilStyles.lightText}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </small>
              <h2 style={{ margin: '0.5rem 0' }}>
                <Link href={`/posts/${id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  {title}
                </Link>
              </h2>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: 'var(--text-main)', flexGrow: 1 }}>{excerpt}</p>
              <Link href={`/posts/${id}`} className="read-more">
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        .blog-card {
          padding: 1.5rem;
          background: var(--bg-surface);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
          border-color: var(--accent-primary);
        }
        .read-more {
          margin-top: 1.5rem;
          font-weight: bold;
          color: var(--accent-primary);
          text-decoration: none;
          font-size: 0.9rem;
        }
        .read-more:hover {
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  );
}