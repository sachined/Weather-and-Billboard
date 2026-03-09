import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FORMSPREE_ID } from '../../lib/constants';

export default function ContactForm() {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('SUCCESS');
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div style={successContainerStyle}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }} role="img" aria-label="Success checkmark">✅</div>
        <h2 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Message Sent!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. I'll get back to you as soon as possible.</p>
        <button 
          onClick={() => setStatus('IDLE')}
          style={anotherButtonStyle}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label htmlFor="full-name" style={labelStyle}>Full Name</label>
        <input
          type="text"
          name="name"
          id="full-name"
          required
          placeholder="John Doe"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="email" style={labelStyle}>Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="john@example.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message</label>
        <textarea
          name="message"
          id="message"
          required
          rows={5}
          placeholder="Tell me about your project..."
          style={{ ...inputStyle, resize: 'vertical' }}
        ></textarea>
      </div>

      {status === 'ERROR' && (
        <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>
          Something went wrong. Please try again or use direct email.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'SUBMITTING'}
        style={submitButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-secondary)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
      >
        {status === 'SUBMITTING' ? (
          'Sending...'
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}

const successContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2.5rem',
  backgroundColor: 'var(--bg-surface-hover)',
  borderRadius: '16px',
  border: '1px solid var(--border-subtle)'
};

const anotherButtonStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  backgroundColor: 'var(--accent-primary)',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '700',
  color: 'var(--text-main)',
  fontSize: '0.95rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--border-main)',
  fontSize: '1rem',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-main)',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-primary)',
  color: 'white',
  border: 'none',
  padding: '1.2rem',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: '800',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.5rem'
};
