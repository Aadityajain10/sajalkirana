import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminInquiries() {
  const { addToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.getInquiries({
        status: statusFilter || undefined
      });
      setInquiries(res.data || []);
    } catch (err) {
      console.error('Failed to load inquiries', err);
      addToast('Failed to load customer orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      addToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update status', err);
      addToast('Failed to update status', 'error');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Customer WhatsApp Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Track incoming customer grocery orders, delivery addresses, and WhatsApp conversations.
          </p>
        </div>

        {/* Status Filter */}
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">All Statuses</option>
          <option value="new">New Orders</option>
          <option value="contacted">Contacted</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref Number</th>
                <th>Customer Details</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => {
                  const isExpanded = expandedId === inq.id;
                  const phoneClean = inq.customer_phone.replace(/[^0-9]/g, '');
                  const replyText = `Namaste ${inq.customer_name}! This is Sajal Kirana regarding your order #${inq.inquiry_number}. We have received your grocery list.`;
                  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(replyText)}`;

                  return (
                    <React.Fragment key={inq.id}>
                      <tr>
                        <td style={{ fontWeight: 800 }}>
                          <button
                            onClick={() => toggleExpand(inq.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <span>{inq.inquiry_number}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{inq.customer_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <a href={`tel:${phoneClean}`} style={{ color: 'inherit' }}>{inq.customer_phone}</a>
                          </div>
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          ₹{inq.total_amount?.toLocaleString('en-IN') || 0}
                        </td>
                        <td>
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            className="form-select"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto', fontWeight: 600 }}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(inq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-whatsapp"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <MessageCircle size={15} />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>

                      {/* Expanded Item Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{ background: '#f8fafc', padding: '1.25rem 2rem', borderBottom: '2px solid #cbd5e1' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                                  Ordered Grocery Items:
                                </h4>
                                {inq.items && inq.items.length > 0 ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {inq.items.map((it, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.75rem',
                                          padding: '0.5rem 0.75rem',
                                          background: '#ffffff',
                                          borderRadius: '8px',
                                          border: '1px solid #e2e8f0'
                                        }}
                                      >
                                        <img
                                          src={it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80'}
                                          alt={it.product_name}
                                          style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)' }}>
                                            {it.product_name}
                                          </div>
                                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                            Qty: <strong>{it.quantity}</strong> {it.unit_price ? `× ₹${it.unit_price}` : ''}
                                          </div>
                                        </div>
                                        <div style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.9rem' }}>
                                          ₹{(it.subtotal || (it.unit_price * it.quantity) || 0).toLocaleString('en-IN')}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Direct text list order (see customer notes)
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                                  Delivery Address & Notes:
                                </h4>
                                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.88rem', color: 'var(--text-body)', minHeight: '60px' }}>
                                  {inq.notes || 'No extra address notes provided.'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
