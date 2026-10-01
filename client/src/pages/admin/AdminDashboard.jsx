import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Eye,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading analytics dashboard...</div>;
  }

  const stats = data?.stats || {};
  const recentInquiries = data?.recentInquiries || [];
  const lowStockAlerts = data?.lowStockAlerts || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="admin-page-title">Store Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Real-time snapshot of grocery catalog, stock availability, and incoming customer orders.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats.totalProducts || 0}</div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600, marginTop: '0.35rem' }}>
              Active in Storefront
            </div>
          </div>
          <div className="stat-icon-wrap" style={{ background: '#dcfce7', color: '#15803d' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="stat-label">Incoming Orders</div>
            <div className="stat-value" style={{ color: '#ea580c' }}>{stats.activeInquiries || 0}</div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 600, marginTop: '0.35rem' }}>
              Active WhatsApp Orders
            </div>
          </div>
          <div className="stat-icon-wrap" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value" style={{ color: stats.lowStockCount > 0 ? '#dc2626' : '#16a34a' }}>
              {stats.lowStockCount || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.35rem' }}>
              {stats.outOfStockCount || 0} items Out of Stock
            </div>
          </div>
          <div className="stat-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="stat-label">Active Categories</div>
            <div className="stat-value">{stats.totalCategories || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.35rem' }}>
              Grocery Aisles
            </div>
          </div>
          <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <FolderTree size={24} />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockAlerts.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.92rem' }}>
                Inventory Alert: {lowStockAlerts.length} Item(s) running low!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b91c1c' }}>
                {lowStockAlerts.map(p => `${p.name} (${p.stock_quantity} left)`).join(', ')}
              </div>
            </div>
          </div>
          <Link to="/admin/inventory" className="btn btn-sm btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }}>
            Restock Inventory
          </Link>
        </div>
      )}

      {/* Grid: Recent Orders */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Customer Orders</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Latest WhatsApp grocery orders with items & product images</p>
          </div>
          <Link to="/admin/inquiries" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref #</th>
                <th>Customer</th>
                <th>Items Ordered (Images)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No customer orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentInquiries.map((inq) => {
                  const phoneClean = inq.customer_phone ? inq.customer_phone.replace(/[^0-9]/g, '') : '';
                  const replyMsg = `Namaste ${inq.customer_name}! This is regarding your Sajal Kirana order #${inq.inquiry_number}. We have received your grocery items.`;
                  const waUrl = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(replyMsg)}` : '#';

                  return (
                    <tr key={inq.id}>
                      <td style={{ fontWeight: 700 }}>
                        <button
                          onClick={() => setSelectedOrder(inq)}
                          style={{ color: 'var(--primary-700)', fontWeight: 800, cursor: 'pointer', background: 'none', border: 'none' }}
                          title="Click to view details"
                        >
                          {inq.inquiry_number}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inq.customer_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inq.customer_phone}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {inq.items?.slice(0, 3).map((it, idx) => (
                            <img
                              key={idx}
                              src={it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80'}
                              alt={it.product_name}
                              title={`${it.product_name} (${it.quantity}x)`}
                              style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                            />
                          ))}
                          {inq.items?.length > 3 && (
                            <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                              +{inq.items.length - 3}
                            </span>
                          )}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>
                            ({inq.items?.length || 0} items)
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                        ₹{inq.total_amount?.toLocaleString('en-IN') || 0}
                      </td>
                      <td>
                        <span className={`status-pill ${inq.status}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setSelectedOrder(inq)}
                            title="View order details with images"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', border: '1px solid #e2e8f0' }}
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          {phoneClean && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-whatsapp"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                              title="Reply to customer on WhatsApp"
                            >
                              <MessageCircle size={14} />
                              <span>Reply</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Order Details: {selectedOrder.inquiry_number}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {/* Customer Info Card */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Customer Name</span>
                    <strong>{selectedOrder.customer_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Phone Number</span>
                    <a href={`tel:${selectedOrder.customer_phone}`} style={{ color: 'var(--primary-700)', fontWeight: 600 }}>
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                  {selectedOrder.notes && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Delivery Address / Notes</span>
                      <span style={{ color: 'var(--text-body)' }}>{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List with Product Images */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Ordered Products ({selectedOrder.items?.length || 0}):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                    <img
                      src={it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80'}
                      alt={it.product_name}
                      style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                        {it.product_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Quantity: <strong>{it.quantity}</strong> × ₹{it.unit_price}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)' }}>
                      ₹{it.subtotal?.toLocaleString('en-IN') || 0}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '1rem', marginTop: '1.25rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Order Value:</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  ₹{selectedOrder.total_amount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
              {selectedOrder.customer_phone && (
                <a
                  href={`https://wa.me/${selectedOrder.customer_phone.replace(/[^0-9]/g, '')}?text=Namaste%20${encodeURIComponent(selectedOrder.customer_name)},%20this%20is%20regarding%20your%20Sajal%20Kirana%20order%20${selectedOrder.inquiry_number}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={16} />
                  <span>Reply on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
