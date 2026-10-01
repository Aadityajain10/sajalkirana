import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';

export default function CartDrawer() {
  const {
    items,
    totalItemsCount,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  const { addToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      addToast('Please enter your Name and Phone Number', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_type: 'retail',
        notes: customerNotes.trim(),
        total_amount: totalAmount,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
          price_type: 'retail',
          subtotal: item.subtotal,
          image: item.product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'
        }))
      };

      const res = await api.createInquiry(payload);
      
      setOrderSuccess(res);
      addToast('Order saved & registered successfully!', 'success');
      clearCart();

      // Open Primary WhatsApp by default
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to submit order', err);
      addToast(err.message || 'Failed to submit order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <aside className="drawer-container">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} style={{ color: 'var(--primary-700)' }} />
            <span>Your Grocery Cart ({totalItemsCount})</span>
          </div>
          <button className="drawer-close" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {orderSuccess ? (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center', margin: 'auto 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={34} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
              Order Saved in Store!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Reference Number: <strong style={{ color: 'var(--primary-800)' }}>{orderSuccess.data?.inquiry_number}</strong><br />
              Order has been recorded in the store dashboard. You can send the order receipt to either or both shop owners on WhatsApp:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {orderSuccess.whatsappUrl && (
                <a
                  href={orderSuccess.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', fontSize: '0.88rem' }}
                >
                  <MessageCircle size={18} />
                  <span>Send to Sajal (+91 79749 81304)</span>
                </a>
              )}

              {orderSuccess.whatsappUrl2 && (
                <a
                  href={orderSuccess.whatsappUrl2}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', fontSize: '0.88rem' }}
                >
                  <MessageCircle size={18} />
                  <span>Send to Sourabh (+91 88199 39196)</span>
                </a>
              )}
            </div>

            <button
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={() => {
                setOrderSuccess(null);
                setIsCartOpen(false);
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', margin: 'auto 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--surface-subtle)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <ShoppingBag size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Explore our fresh daily grocery items and kitchen staples.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="drawer-body">
              {items.map((item) => {
                const { product, quantity, unitPrice, subtotal } = item;
                const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';

                return (
                  <div key={product.id} className="cart-item-row">
                    <img src={imageSrc} alt={product.name} className="cart-item-img" />
                    
                    <div className="cart-item-info">
                      <div className="cart-item-name">{product.name}</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span className="cart-item-price">₹{subtotal.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          (₹{unitPrice}/{product.unit})
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        style={{ color: '#ef4444', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="qty-controller">
                        <button className="qty-btn" onClick={() => updateQuantity(product.id, quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="qty-value" style={{ minWidth: '24px', fontSize: '0.82rem' }}>{quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(product.id, quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Checkout & Order on WhatsApp */}
            <div className="drawer-footer">
              <div className="cart-total-row">
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Amount</div>
                <div className="total-amount">₹{totalAmount.toLocaleString('en-IN')}</div>
              </div>

              {/* Order / Inquiry Form */}
              <form onSubmit={handleCheckoutWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Ramesh Kumar)"
                  className="form-input"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
                />

                <input
                  type="tel"
                  placeholder="WhatsApp Mobile Number (e.g. 7974981304)"
                  className="form-input"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
                />

                <input
                  type="text"
                  placeholder="Delivery Address (e.g. Near Ghantaghar, Gadhakota)"
                  className="form-input"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
                />

                <button
                  type="submit"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', padding: '0.75rem' }}
                  disabled={submitting}
                >
                  <MessageCircle size={20} />
                  <span>{submitting ? 'Placing Order...' : 'Order on WhatsApp'}</span>
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
