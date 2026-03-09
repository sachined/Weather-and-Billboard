import Layout from '../components/layout';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        margin: '2rem auto'
      }}>
          <h1 style={{ fontSize: '4rem', margin: 0, color: '#e11d48' }}>404</h1>
          <h2 style={{ color: '#1e293b', marginTop: '1rem' }}>Page Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link href="/" style={{
            backgroundColor: 'var(--brand-blue)',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Go back home
          </Link>
        </div>
    </Layout>
  );
}
