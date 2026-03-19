import React, { useState } from 'react';
import type { SubmitEventHandler } from "react";
import { Send } from 'lucide-react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (response.ok) {
        setStatus('SUCCESS');
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again later.');
        setStatus('ERROR');
      }
    } catch (error) {
      setErrorMessage('A network error occurred. Please try again.');
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <h2 className={styles.successTitle}>Message Sent!</h2>
        <p className={styles.successMessage}>Thank you for reaching out. I'll get back to you as soon as possible.</p>
        <button
          onClick={() => setStatus('IDLE')}
          className={styles.anotherButton}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <input type="text" name="_gotcha" className={styles.gotcha} />
        <label htmlFor="full-name" className={styles.label}>Full Name</label>
        <input
          type="text"
          name="name"
          id="full-name"
          required
          placeholder="John Doe"
          autoComplete="name"
          className={styles.input}
        />
      </div>

      <div>
        <label htmlFor="email" className={styles.label}>Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="john@example.com"
          autoComplete="email"
          className={styles.input}
        />
      </div>

      <div>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          name="message"
          id="message"
          required
          rows={5}
          placeholder="Tell me about your project..."
          className={`${styles.input} ${styles.textarea}`}
        ></textarea>
      </div>

      {status === 'ERROR' && (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'SUBMITTING'}
        className={styles.submitButton}
      >
        {status === 'SUBMITTING' ? (
          'Sending...'
        ) : (
          <>
            <Send size={18} style={{ marginRight: '8px' }} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
