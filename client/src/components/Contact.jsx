import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import resumeData from '../data/resumeData';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO GET YOUR ACCESS KEY (one-time, takes 30 seconds):
//   1. Go to https://web3forms.com
//   2. Enter your email: er.adityarajkhandal@gmail.com
//   3. Click "Create Access Key"
//   4. Check your email inbox for the access key
//   5. Paste it below replacing YOUR_ACCESS_KEY_HERE
// ─────────────────────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY = 'a560a0db-f984-40cf-ae1c-e8ff59d7d7fe';

export default function Contact() {
  const [sectionRef, isVisible] = useScrollReveal();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio Contact: ${formData.name}`,
          from_name: formData.name,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setSending(false);
      // Clear status after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section className="contact" id="contact">
      <div ref={sectionRef} className={`reveal ${isVisible ? 'visible' : ''}`}>
        <p className="contact-subtitle">What&apos;s Next?</p>
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-description">
          I'm currently looking for new opportunities and my inbox is always open.
          Whether you have a question, a project idea, or just want to say hi — I'll
          do my best to get back to you!
        </p>
      </div>

      <form
        className={`contact-form reveal ${isVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '0.2s' }}
        onSubmit={handleSubmit}
      >
        {/* Honeypot spam protection — hidden from real users */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

        <div className="form-group">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="What's on your mind?"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <div className="form-submit">
          <button type="submit" className="btn btn-filled" disabled={sending}>
            {sending ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </div>

        {status && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </form>

      <div
        className={`contact-direct reveal ${isVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '0.4s' }}
      >
        Or email me directly at{' '}
        <a href={`mailto:${resumeData.personal.email}`}>{resumeData.personal.email}</a>
      </div>
    </section>
  );
}
