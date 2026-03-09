import Head from 'next/head';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticProps, GetStaticPaths } from 'next';

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

export default function Post({ postData }: { postData: { title: string; date: string; contentHtml: string } }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} - Sachin Nediyanchath</title>
      </Head>
      <article className="post-container">
        <header className="post-header">
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
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
      </article>

      <style jsx>{`
        .post-container {
          max-width: 800px;
          margin: 2rem auto;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 1.25rem;
          padding: 3rem 2.5rem;
          box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }
        .post-header {
          border-bottom: 2px solid var(--border-subtle);
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
        }
        @media (max-width: 600px) {
          .post-container {
            padding: 2rem 1.5rem;
            margin: 1rem 0;
            border-radius: 0.75rem;
          }
        }
      `}</style>
      <style jsx global>{`
        .post-content {
          line-height: 1.8;
          font-size: 1.1rem;
          color: var(--text-main);
        }
        .post-content h2 {
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: var(--accent-primary);
          font-size: 1.75rem;
          font-weight: 700;
        }
        .post-content p {
          margin-bottom: 1.5rem;
          opacity: 0.95;
        }
        .post-content a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }
        .post-content a:hover {
          text-decoration: underline;
        }
        .post-content ul, .post-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .post-content li {
          margin-bottom: 0.75rem;
        }
        .post-content code {
          background: var(--bg-surface-hover);
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          border: 1px solid var(--border-subtle);
        }
        .post-content blockquote {
          border-left: 4px solid var(--accent-primary);
          padding-left: 1.5rem;
          font-style: italic;
          color: var(--text-muted);
          margin: 2.5rem 0;
          font-size: 1.2rem;
        }
        .post-content strong {
          color: var(--accent-primary);
        }
      `}</style>
    </Layout>
  );
}