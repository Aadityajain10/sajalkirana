import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

  const handleAdd = () => {
    addToCart(product, qty);
    setAddedAnim(true);
    addToast(`Added ${qty}x ${product.name} to cart!`, 'success');
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleWhatsAppInquiry = async (e) => {
    e.stopPropagation();
    const subtotal = product.retail_price * qty;
    try {
      await api.createInquiry({
        customer_name: 'Storefront Customer',
        customer_phone: '+91 (Quick WhatsApp Order)',
        customer_type: 'retail',
        notes: `Quick WhatsApp Order for ${product.name}`,
        total_amount: subtotal,
        items: [{
          id: product.id,
          name: product.name,
          quantity: qty,
          price: product.retail_price,
          price_type: 'retail',
          subtotal: subtotal,
          image: imageSrc
        }]
      });
      addToast('Order recorded in store dashboard!', 'success');
    } catch (err) {
      console.warn('Could not register card order', err);
    }

    const message = `Namaste Sajal Kirana, I want to order:
*${product.name}*
• Quantity: ${qty} ${product.unit || 'units'}
• Price: ₹${product.retail_price}/${product.unit}
• Subtotal: ₹${subtotal.toLocaleString('en-IN')}

Please confirm stock and delivery timeline.`;

    const url = `https://wa.me/917974981304?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const isLowStock = product.stock_quantity <= (product.low_stock_threshold || 10) && product.stock_quantity > 0;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="kirana-card product-card">
      {/* Top Badges */}
      <div className="product-card-badge" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {product.is_featured && (
          <span className="badge-saving" style={{ background: '#fef3c7', color: '#b45309' }}>
            Featured
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </Link>

      {/* Card Details */}
      <div className="product-body">
        {product.brand && <div className="product-brand">{product.brand}</div>}
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-title" title={product.name}>{product.name}</h3>
        </Link>

        <div className="product-package">
          <span>{product.package_size || `${product.unit || '1 unit'}`}</span>
          <span>•</span>
          <span className={`badge-stock ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock_quantity} left` : 'In Stock'}
          </span>
        </div>

        {/* Pricing Box */}
        <div className="pricing-box">
          <div className="price-row">
            <div>
              <span className="retail-price">₹{product.retail_price}</span>
              <span className="price-unit"> / {product.unit || 'unit'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <div className="qty-controller">
            <button
              className="qty-btn"
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="qty-value">{qty}</span>
            <button
              className="qty-btn"
              onClick={() => setQty(qty + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className={`btn btn-sm ${addedAnim ? 'btn-primary' : 'btn-primary'}`}
              onClick={handleAdd}
              disabled={isOutOfStock}
              style={{ flex: 1, padding: '0.45rem 0.75rem' }}
              title="Add to Cart"
            >
              {addedAnim ? <Check size={16} /> : <ShoppingCart size={16} />}
              <span>{addedAnim ? 'Added' : 'Add'}</span>
            </button>

            <button
              className="btn btn-sm btn-whatsapp"
              onClick={handleWhatsAppInquiry}
              title="Order on WhatsApp"
              style={{ padding: '0.45rem 0.6rem' }}
            >
              <MessageCircle size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
