import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  FolderTree,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Store,
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/admin.css';

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products & Pricing', path: '/admin/products', icon: Package },
    { label: 'Inventory & Stock Alerts', path: '/admin/inventory', icon: AlertTriangle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Hero Banners', path: '/admin/banners', icon: ImageIcon },
    { label: 'Inquiries & WhatsApp CRM', path: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="admin-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <ShoppingBag size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Sajal Kirana</div>
            <div style={{ fontSize: '0.72rem', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Portal
            </div>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            to="/"
            className="admin-nav-item"
            style={{ color: '#fed7aa', marginBottom: '0.5rem' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Store size={18} />
            <span>Visit Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="admin-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Store Manager</span>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1.05rem', lineHeight: 1.2 }}>
                {user?.user_metadata?.full_name || user?.email || 'Store Owner'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-outline btn-sm">
              <Store size={16} />
              <span className="hide-mobile">Live Website</span>
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
