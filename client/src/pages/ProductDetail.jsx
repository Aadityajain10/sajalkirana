import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          setQty(1);

          // Fetch related in same category
          const relatedRes = await api.getProducts({
            category: res.data.category_slug || res.data.category_id,
            limit: 4
          });
          setRelatedProducts((relatedRes.data || []).filter(p => p.slug !== slug));
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The requested product does not exist or has been moved.</p>
        <Link to="/catalog" className="btn btn-primary">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentUnitPrice = parseFloat(product.retail_price || 0);
  const currentTotal = currentUnitPrice * qty;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'];

  const handleAddToCart = () => {
    addToCart(product, qty);
    addToast(`Added ${qty}x ${product.name} to cart!`, 'success');
  };

  const handleWhatsAppOrder = async (targetPhone = '917974981304') => {
    try {
      await api.createInquiry({
        customer_name: 'Storefront Customer',
        customer_phone: '+91 (Direct WhatsApp Order)',
        customer_type: 'retail',
        notes: `Quick WhatsApp Order for ${product.name}`,
        total_amount: currentTotal,
        items: [{
          id: product.id,
          name: product.name,
          quantity: qty,
          price: currentUnitPrice,
          price_type: 'retail',
          subtotal: currentTotal,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'
        }]
      });
      addToast('Order recorded in store dashboard!', 'success');
    } catch (e) {
      console.warn('Could not save direct product order', e);
    }

    const message = `🛒 *Order from Sajal Kirana*
*Product:* ${product.name}
*Quantity:* ${qty} ${product.unit || 'units'}
*Price:* ₹${currentUnitPrice}/${product.unit}
*Estimated Subtotal:* ₹${currentTotal.toLocaleString('en-IN')}

Please let me know if this item is available for immediate home delivery.`;

    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/catalog" style={{ color: 'var(--text-muted)' }}>Catalog</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="product-detail-layout">
          {/* Left: Product Images */}
          <div>
            <div className="product-detail-main-img-wrap">
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: idx === activeImageIdx ? '2px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Pricing */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {product.brand && (
                <span style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.brand}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Package: <strong>{product.package_size || product.unit}</strong></span>
              <span>•</span>
              <span style={{ color: product.stock_quantity > 0 ? '#15803d' : '#dc2626', fontWeight: 700 }}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Everyday Price</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
                  ₹{product.retail_price}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> / {product.unit}</span>
                </div>
              </div>

              {/* Quantity Picker & Total */}
              <div style={{ paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select Quantity:</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="qty-controller">
                    <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                      <Minus size={16} />
                    </button>
                    <span className="qty-value" style={{ minWidth: '40px', fontSize: '1rem' }}>{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(qty + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Subtotal:</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-display)' }}>
                      ₹{currentTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="product-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  className="btn btn-whatsapp btn-lg"
                  onClick={() => handleWhatsAppOrder('917974981304')}
                  title="WhatsApp Sajal"
                >
                  <MessageCircle size={20} />
                  <span>Order via WhatsApp (79749 81304)</span>
                </button>
                <button
                  className="btn btn-whatsapp btn-sm"
                  onClick={() => handleWhatsAppOrder('918819939196')}
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
                  title="WhatsApp Store Counter"
                >
                  <MessageCircle size={16} />
                  <span>Also Send to Store Counter (88199 39196)</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Product Description</h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {product.description || 'Premium quality grocery staple sourced directly from reliable grain mandis. Cleaned, sorted and packaged with complete quality control.'}
              </p>
            </div>

            {/* Store Assurances */}
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} style={{ color: '#15803d' }} />
                <span>100% Genuine & Fresh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Truck size={18} style={{ color: '#15803d' }} />
                <span>Gadhakota Fast Home Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Similar Products in this Category</h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
