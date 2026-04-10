import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/Contact/ContactForm';
import { CONTACT_EMAIL, SITE_NAME, SOCIAL_LINKS } from '@/lib/constants';
import styles from '@/styles/Contact.module.css';

export default function Contact() {
  const email = CONTACT_EMAIL;

  return (
    <Layout>
      <SEO
        title="Contact"
        description="Get in touch — open to AI Solutions Engineer roles and conversations about FinSurf, AI deployment, and financial literacy."
        path="/contact"
      />

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Let&apos;s talk.</h1>
          <p className={styles.subtitle}>
            I&apos;m actively exploring AI Solutions Engineer roles and always open to conversations about FinSurf, AI deployment, and financial literacy. Use the form or reach out directly.
          </p>

          <ContactForm />

          <div className={styles.otherWays}>
            <h3 className={styles.otherWaysTitle}>Other Ways to Connect</h3>
            <div className={styles.links}>
              <a
                href={`mailto:${email}`}
                className={styles.emailLink}
              >
                Email ↗
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emailLink}
              >
                LinkedIn ↗
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emailLink}
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
