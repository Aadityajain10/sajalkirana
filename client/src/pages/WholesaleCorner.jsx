import React, { useState } from 'react';
import { Sparkles, Building2, Truck, FileText, CheckCircle2, MessageCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function WholesaleCorner() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    businessType: 'restaurant', // 'restaurant', 'caterer', 'retailer', 'canteen', 'other'
    itemsNeeded: '',
    estimatedBudget: '',
    deliveryLocation: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.phone || !formData.itemsNeeded) {
      addToast('Please fill in required fields (Name, Phone, Requirements)', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer_name: `${formData.contactName} (${formData.businessName || formData.businessType.toUpperCase()})`,
        customer_phone: formData.phone,
        customer_email: formData.email,
        customer_type: 'wholesale',
        notes: `Business Type: ${formData.businessType}. Location: ${formData.deliveryLocation}. Requirement: ${formData.itemsNeeded}. Est Budget: ${formData.estimatedBudget || 'N/A'}`
      };

      const res = await api.createInquiry(payload);
      setSubmitted(true);
      addToast('Wholesale inquiry submitted successfully!', 'success');

      // WhatsApp redirection
      const phone = '917974981304';
      const msg = `🏢 *B2B Wholesale Inquiry - Sajal Kirana*
*Business Name:* ${formData.businessName || 'N/A'}
*Contact Person:* ${formData.contactName}
*Phone:* ${formData.phone}
*Business Type:* ${formData.businessType.toUpperCase()}
*Location:* ${formData.deliveryLocation || 'Gadhakota'}
*Requirements:* ${formData.itemsNeeded}
*Estimated Budget/Quantity:* ${formData.estimatedBudget || 'Regular Wholesale'}

Please provide current mandi wholesale rates and delivery schedule.`;

      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Error submitting wholesale inquiry', err);
      addToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Hero Section */}
        <div className="wholesale-hero-card" style={{ marginBottom: '3rem' }}>
          <div style={{ maxWidth: '780px' }}>
            <span className="hero-badge" style={{ background: '#f97316' }}>
              <Sparkles size={14} /> Sajal Kirana B2B Wholesale Mandi
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Commercial Grocery Supplies at Mill & Mandi Rates
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '2rem' }}>
              We supply high-grade Chakki Atta sacks, Basmati rice (25kg & 50kg), 15L oil tins, pure cow ghee, sugar bags, and whole spices directly to restaurants, sweet shops, catering companies, dhabas, and retail shops.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#inquiry-form" className="btn btn-accent btn-lg">
                <span>Request Wholesale Quotation</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/917974981304?text=Hello%20Sajal%20Kirana,%20I%20am%20a%20commercial%20bulk%20buyer%20requesting%20rates."
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="wholesale-features-grid">
          <div className="wholesale-feature-box">
            <div className="feature-icon-wrap">
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mandi Direct Pricing</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Avoid multiple middlemen margins. Get bulk commodity pricing updated daily according to grain mandi benchmarks.
            </p>
          </div>

          <div className="wholesale-feature-box">
            <div className="feature-icon-wrap">
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>GST Invoicing</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              100% compliant tax invoices for your business account. Claim full input tax credit on your purchases.
            </p>
          </div>

          <div className="wholesale-feature-box">
            <div className="feature-icon-wrap">
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Scheduled Tempo Delivery</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Doorstep commercial logistics with careful unloading at your kitchen, warehouse, or retail shopfront.
            </p>
          </div>

          <div className="wholesale-feature-box">
            <div className="feature-icon-wrap">
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Consistency</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Uniform grain size, verified weight, and no batch-to-batch variation in your recipes or cooking quality.
            </p>
          </div>
        </div>

        {/* Wholesale Inquiry Form Card */}
        <div id="inquiry-form" style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', padding: '2.5rem', maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Instant Commercial Quote
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.25rem' }}>
              Request Wholesale Rates & Bulk Order
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.5rem' }}>
              Submit your required quantities below. Our mandi desk will respond within 30 minutes with an itemized quotation.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Wholesale Inquiry Received!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                Thank you, <strong>{formData.contactName}</strong>. Our wholesale desk has received your specifications and your message has been pre-formatted for WhatsApp.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    businessName: '',
                    contactName: '',
                    phone: '',
                    email: '',
                    businessType: 'restaurant',
                    itemsNeeded: '',
                    estimatedBudget: '',
                    deliveryLocation: ''
                  });
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Firm / Business Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Royal Sweets & Dhaba"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Category</label>
                  <select
                    className="form-select"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  >
                    <option value="restaurant">Restaurant / Dhaba</option>
                    <option value="caterer">Marriage & Party Caterer</option>
                    <option value="sweet_shop">Halwai / Sweet Shop</option>
                    <option value="retailer">Local Kirana Store / Reseller</option>
                    <option value="canteen">Hostel / Corporate Canteen</option>
                    <option value="other">Household Bulk Buyer</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Contact Person Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rajesh Sharma"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 7974981304"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Delivery Location / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Govind Nagar / Civil Lines, Kanpur"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expected Monthly Volume / Budget</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 50 Sacks / ₹50,000"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Products & Quantities *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Example:&#10;1. Aashirvaad Atta (10kg) - 10 bags&#10;2. Fortune Mustard Oil 15L - 2 tins&#10;3. India Gate Basmati 25kg - 3 sacks&#10;4. Kaju W240 10kg box - 1 box"
                  value={formData.itemsNeeded}
                  onChange={(e) => setFormData({ ...formData, itemsNeeded: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-lg"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                <MessageCircle size={20} />
                <span>{submitting ? 'Submitting Quotation...' : 'Send Inquiry & Open WhatsApp'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
