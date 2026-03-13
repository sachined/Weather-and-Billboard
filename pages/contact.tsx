import Head from 'next/head';
import Layout from '@/components/layout';
import ContactForm from '@/components/Contact/ContactForm';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants';
import styles from '@/styles/Contact.module.css';

export default function Contact() {
  const email = CONTACT_EMAIL;

  return (
    <Layout>
      <Head>
        <title>{`Contact - ${SITE_NAME}`}</title>
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Have a question or a proposal? Use the form below or reach out via direct channels.
          </p>

          <ContactForm />

          <div className={styles.otherWays}>
            <h3 className={styles.otherWaysTitle}>Other Ways to Connect</h3>
            <div className={styles.linksContainer}>
              <div className={styles.linksInner}>
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.emailLink}
                >
                  Open in Gmail
                </a>
                <a 
                  href={`https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.emailLink}
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
