import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageSquare, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }
    setSent(true);
    addToast('Message received! We will call you back shortly.', 'success');
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Visit Sajal Kirana or Get in Touch
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            We're located in the heart of the central grocery mandi. Walk in for retail shopping or call our wholesale dispatch desk for bulk deliveries.
          </p>
        </div>

        <div className="contact-grid">
          {/* Store Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Address */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Store Address</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Near Gas Agency, Damoh Road, Ahead of Ghantaghar, Gadhakota, Madhya Pradesh - 470229
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  <a
                    href="https://maps.google.com/?q=Gadhakota+Damoh+Road"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.88rem' }}
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Call & WhatsApp</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.92rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Sajal (Store Owner): </span>
                    <a href="tel:+917974981304" style={{ fontWeight: 700, color: 'var(--text-heading)' }}>+91 79749 81304</a>
                    <span style={{ margin: '0 0.4rem', color: '#cbd5e1' }}>|</span>
                    <a href="https://wa.me/917974981304" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#16a34a' }}>WhatsApp</a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Store Counter / Desk: </span>
                    <a href="tel:+918819939196" style={{ fontWeight: 700, color: 'var(--text-heading)' }}>+91 88199 39196</a>
                    <span style={{ margin: '0 0.4rem', color: '#cbd5e1' }}>|</span>
                    <a href="https://wa.me/918819939196" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#16a34a' }}>WhatsApp</a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                    <a href="mailto:orders@sajalkirana.com" style={{ fontWeight: 600, color: 'var(--primary-700)' }}>orders@sajalkirana.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Operating Hours</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  <strong>Monday – Sunday:</strong> 8:30 AM to 9:30 PM<br />
                  <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.85rem' }}>
                    Open all 7 days for store visits & home deliveries
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Send Us a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Have questions regarding delivery coverage, customized flour grinding, or specific spice varieties? Write to us.
            </p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Our store representative will get in touch with you shortly.
                </p>
                <button className="btn btn-outline" onClick={() => { setSent(false); setFormData({ name: '', phone: '', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Kumar"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 7974981304"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message or Inquiry</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
