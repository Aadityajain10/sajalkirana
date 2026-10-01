import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Phone, ShieldCheck, X, ShoppingCart, MapPin, Clock, Sparkles, PhoneCall, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { totalItemsCount, totalAmount, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Sync search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchQuery(q);
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/catalog') {
      const params = new URLSearchParams(location.search);
      params.delete('search');
      const qs = params.toString();
      navigate(qs ? `/catalog?${qs}` : '/catalog');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      {/* Top Notice / Utility Bar - Ultra Modern & Premium */}
      <div className="top-notice-bar">
        <div className="container top-notice-container">
          {/* Left: Live store status, location & delivery */}
          <div className="top-bar-left">
            <div className="top-status-badge">
              <span className="live-pulse">
                <span className="live-pulse-dot"></span>
                <span className="live-pulse-ring"></span>
              </span>
              <span className="top-status-label">Open Today</span>
              <span className="top-status-separator">•</span>
              <span className="top-status-time">8:30 AM – 9:30 PM</span>
            </div>

            <div className="top-bar-divider" />

            <div className="top-info-pill">
              <MapPin size={12} className="top-pill-icon" />
              <span>Damoh Road, Gadhakota</span>
            </div>

            <div className="top-bar-divider" />

            <div className="top-delivery-chip">
              <Zap size={11} className="top-delivery-icon" />
              <span>Fast Home Delivery</span>
            </div>
          </div>

          {/* Right: Two dedicated store order lines & staff portal */}
          <div className="top-bar-right">
            <div className="top-call-group">
              <span className="top-call-prefix">
                <PhoneCall size={12} />
                <span>Call / Order:</span>
              </span>
              <a
                href="tel:+918819939196"
                className="top-call-pill"
                title="Call Sourabh"
              >
                <span className="call-pill-tag counter">SOURABH</span>
                <span className="call-pill-num">+91 88199 39196</span>
              </a>
              <a
                href="tel:+917974981304"
                className="top-call-pill"
                title="Call Sajal (Store Owner)"
              >
                <span className="call-pill-tag owner">SAJAL</span>
                <span className="call-pill-num">+91 79749 81304</span>
              </a>
            </div>

            <div className="top-bar-divider hide-mobile" />

            <Link
              to="/admin"
              className="top-admin-badge"
              title="Store Management & Order Portal"
            >
              <ShieldCheck size={13} />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="header-main">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-logo-icon">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="brand-title">
                Sajal<span>Kirana</span>
              </div>
              <div className="brand-subtitle">Fresh Grocery Superstore</div>
            </div>
          </Link>

          {/* Search Bar - Single Unified Search Bar */}
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <Search className="header-search-icon" size={18} />
            <input
              type="text"
              className="header-search-input"
              placeholder="Search Atta, Basmati Rice, Mustard Oil, Dals, Spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Navigation Links */}
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}>
              All Products
            </Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              Store & Contact
            </Link>
          </nav>

          {/* Cart Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Cart"
            >
              <ShoppingCart size={20} />
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              {totalItemsCount > 0 && (
                <span className="cart-badge">{totalItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
