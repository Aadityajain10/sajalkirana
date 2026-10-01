import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Customer Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Contact from './pages/Contact.jsx';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminInventory from './pages/admin/AdminInventory.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminBanners from './pages/admin/AdminBanners.jsx';
import AdminInquiries from './pages/admin/AdminInquiries.jsx';

// Protected Admin Route
function ProtectedAdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// Store Layout Wrapper for customer pages
function StorefrontLayout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return children;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <StorefrontLayout>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/wholesale" element={<Navigate to="/catalog" replace />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </StorefrontLayout>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
