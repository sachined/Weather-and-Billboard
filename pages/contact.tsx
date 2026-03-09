import Head from 'next/head';
import Layout from '../components/layout';
import ContactForm from '../components/Contact/ContactForm';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/constants';

export default function Contact() {
  const email = CONTACT_EMAIL;

  return (
    <Layout>
      <Head>
        <title>{`Contact - ${SITE_NAME}`}</title>
      </Head>

      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h1 style={{ color: 'var(--text-main)', marginTop: 0, fontSize: '2.5rem', fontWeight: '800' }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Have a question or a proposal? Use the form below or reach out via direct channels.
          </p>

          <ContactForm />

          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2.5rem' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '700' }}>Other Ways to Connect</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--bg-surface-hover)',
                    color: 'var(--accent-primary)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.2s'
                  }}
                >
                  Open in Gmail
                </a>
                <a 
                  href={`https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--bg-surface-hover)',
                    color: 'var(--accent-primary)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.2s'
                  }}
                >
                  Outlook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
