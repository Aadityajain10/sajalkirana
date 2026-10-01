import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Plus, ArrowUpRight, Search, RefreshCw } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminInventory() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
      addToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuickAddStock = async (productId, currentStock, addedQty) => {
    try {
      const newStock = Math.max(0, currentStock + addedQty);
      await api.updateProduct(productId, { stock_quantity: newStock });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: newStock } : p));
      addToast(`Updated stock to ${newStock} units`, 'success');
    } catch (err) {
      console.error('Failed to update stock', err);
      addToast('Failed to update stock', 'error');
    }
  };

  const filtered = products.filter(p => {
    const isOut = p.stock_quantity === 0;
    const isLow = p.stock_quantity <= (p.low_stock_threshold || 10) && !isOut;

    if (filter === 'low' && !isLow) return false;
    if (filter === 'out' && !isOut) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10) && p.stock_quantity > 0).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Inventory & Stock Alerts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Monitor stock levels, set low-stock thresholds, and quickly restock grocery commodities.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={fetchProducts}>
          <RefreshCw size={16} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: filter === 'all' ? 'var(--primary-700)' : '#ffffff',
            color: filter === 'all' ? '#ffffff' : 'var(--text-heading)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          All Items ({products.length})
        </button>

        <button
          onClick={() => setFilter('low')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: filter === 'low' ? '#ea580c' : '#ffffff',
            color: filter === 'low' ? '#ffffff' : '#c2410c',
            border: '1px solid #fed7aa',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <AlertTriangle size={16} />
          <span>Low Stock ({lowStockCount})</span>
        </button>

        <button
          onClick={() => setFilter('out')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: filter === 'out' ? '#dc2626' : '#ffffff',
            color: filter === 'out' ? '#ffffff' : '#dc2626',
            border: '1px solid #fecaca'
          }}
        >
          Out of Stock ({outOfStockCount})
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Commodity / Product</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isOut = p.stock_quantity === 0;
                const isLow = p.stock_quantity <= (p.low_stock_threshold || 10) && !isOut;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Package: {p.package_size || p.unit}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isOut ? '#dc2626' : isLow ? '#ea580c' : 'var(--text-heading)' }}>
                        {p.stock_quantity}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> {p.unit}s</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        ≤ {p.low_stock_threshold || 10} {p.unit}s
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${isOut ? 'cancelled' : isLow ? 'contacted' : 'fulfilled'}`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock Warning' : 'Healthy Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleQuickAddStock(p.id, p.stock_quantity, 10)}
                        >
                          +10 {p.unit}s
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleQuickAddStock(p.id, p.stock_quantity, 50)}
                        >
                          +50 {p.unit}s
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
