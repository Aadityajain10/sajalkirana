import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, MapPin, Clock, MessageSquare, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Features Bar */}
      <div style={{ background: '#0a3d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Guaranteed Freshness</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Best quality handpicked grocery items</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Fast Local Delivery</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Prompt home delivery in Gadhakota</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>100% Quality Purity</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Clean grains and authentic brands</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Instant WhatsApp Order</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Send your grocery list directly for delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer-top">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShoppingBag size={22} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                Sajal<span style={{ color: '#f97316' }}>Kirana</span>
              </div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Your trusted neighborhood grocery store. Supplying the highest grade Chakki Atta, Basmati Rice, unpolished Dals, Desi Ghee, Edible Oils, and Spices at everyday fair prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/catalog" className="footer-link">All Grocery Products</Link></li>
              <li><Link to="/contact" className="footer-link">Store Location & Hours</Link></li>
              <li><Link to="/admin" className="footer-link">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="footer-col-title">Popular Aisles</h4>
            <ul className="footer-links">
              <li><Link to="/catalog?category=atta-flour-grains" className="footer-link">Chakki Atta & Grains</Link></li>
              <li><Link to="/catalog?category=rice-basmati" className="footer-link">Basmati & Everyday Rice</Link></li>
              <li><Link to="/catalog?category=dals-pulses" className="footer-link">Unpolished Dals & Pulses</Link></li>
              <li><Link to="/catalog?category=edible-oils-ghee" className="footer-link">Mustard Oil & Pure Ghee</Link></li>
              <li><Link to="/catalog?category=dry-fruits-nuts" className="footer-link">California Badam & Kaju</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-col-title">Store & Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: '#f97316', flexShrink: 0, marginTop: '2px' }} />
                <span>Near Gas Agency, Damoh Road, Ahead of Ghantaghar, Gadhakota (MP) - 470229</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} style={{ color: '#f97316', flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a href="tel:+917974981304" style={{ color: '#ffffff', fontWeight: 600 }}>+91 79749 81304</a>
                  <span style={{ color: '#64748b' }}>|</span>
                  <a href="tel:+918819939196" style={{ color: '#ffffff', fontWeight: 600 }}>+91 88199 39196</a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Clock size={18} style={{ color: '#f97316', flexShrink: 0, marginTop: '2px' }} />
                <span>Mon – Sun: 8:30 AM - 9:30 PM<br/><span style={{ color: '#86efac', fontSize: '0.8rem' }}>Open all 7 days for home deliveries</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Sajal Kirana Store. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Home Delivery Policy</span>
            <span>Customer Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
