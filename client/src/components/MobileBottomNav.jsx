import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-items">
        <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/catalog" className={`mobile-nav-item ${isActive('/catalog') ? 'active' : ''}`}>
          <Grid size={20} />
          <span>Catalog</span>
        </Link>

        <button
          className="mobile-nav-item"
          onClick={() => setIsCartOpen(true)}
          style={{ background: 'none', border: 'none' }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: '#f97316',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <Link to="/contact" className={`mobile-nav-item ${isActive('/contact') ? 'active' : ''}`}>
          <MapPin size={20} />
          <span>Store</span>
        </Link>

        <a href="tel:+917974981304" className="mobile-nav-item">
          <Phone size={20} />
          <span>Call Us</span>
        </a>
      </div>
    </nav>
  );
}
