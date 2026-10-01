import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  const [selectedPhone, setSelectedPhone] = useState('917974981304');

  const handleSend = (e, phoneToUse = selectedPhone) => {
    if (e) e.preventDefault();
    const text = quickMsg.trim() || 'Namaste Sajal Kirana, I want to inquire about daily groceries and home delivery.';
    const url = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setQuickMsg('');
  };

  return (
    <>
      {/* Quick message popup */}
      {isOpen && (
        <div className="whatsapp-popup-container">
          {/* Header */}
          <div style={{ background: '#128c7e', color: '#ffffff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffffff', color: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sajal Kirana Mandi</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Online • Two Store Desks Available</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#ffffff', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Number Selector */}
          <div style={{ background: '#f1f5f9', padding: '0.5rem 0.75rem', display: 'flex', gap: '0.4rem', borderBottom: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setSelectedPhone('917974981304')}
              style={{
                flex: 1,
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: selectedPhone === '917974981304' ? '#15803d' : '#ffffff',
                color: selectedPhone === '917974981304' ? '#ffffff' : 'var(--text-body)'
              }}
            >
              Sajal (79749 81304)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhone('918819939196')}
              style={{
                flex: 1,
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: selectedPhone === '918819939196' ? '#15803d' : '#ffffff',
                color: selectedPhone === '918819939196' ? '#ffffff' : 'var(--text-body)'
              }}
            >
              Counter (88199 39196)
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1rem', background: '#e5ddd5', minHeight: '100px' }}>
            <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem', color: '#1e293b', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '90%' }}>
              Namaste! 🙏 How can we help you today with your retail groceries or bulk wholesale order?
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSend(e)} style={{ padding: '0.75rem', background: '#ffffff', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Type grocery requirement..."
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              title="Send WhatsApp message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#25d366',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <div
        className="whatsapp-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-label="Chat with Sajal Kirana on WhatsApp"
      >
        <MessageCircle size={22} />
        <span>WhatsApp Order</span>
      </div>
    </>
  );
}
