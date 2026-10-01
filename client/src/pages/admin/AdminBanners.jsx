import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import { uploadImage } from '../../services/supabase.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminBanners() {
  const { addToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge_text: '',
    image_url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80',
    cta_link: '/catalog',
    cta_text: 'Shop Now',
    is_active: true
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners();
      setBanners(res.data || []);
    } catch (err) {
      console.error('Failed to load banners', err);
      addToast('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      badge_text: 'Special Offer',
      image_url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80',
      cta_link: '/catalog',
      cta_text: 'Shop Now',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      badge_text: b.badge_text || '',
      image_url: b.image_url,
      cta_link: b.cta_link || '/catalog',
      cta_text: b.cta_text || 'Shop Now',
      is_active: b.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, 'banners');
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        addToast('Banner image uploaded!', 'success');
      }
    } catch (err) {
      console.error('Upload error', err);
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) return;

    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner.id, formData);
        addToast('Banner updated!', 'success');
      } else {
        await api.createBanner(formData);
        addToast('Banner created!', 'success');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner', err);
      addToast(err.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional banner?')) return;
    try {
      await api.deleteBanner(id);
      addToast('Banner deleted', 'success');
      fetchBanners();
    } catch (err) {
      console.error('Delete banner error', err);
      addToast('Failed to delete banner', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title">Hero Banner Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Configure homepage promotional banners, wholesale campaigns, and festival graphics.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Slide</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {banners.map((b) => (
          <div key={b.id} className="kirana-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img src={b.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {b.badge_text && (
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#ea580c', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  {b.badge_text}
                </div>
              )}
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{b.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{b.subtitle}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <span className={`status-pill ${b.is_active ? 'fulfilled' : 'cancelled'}`}>
                  {b.is_active ? 'Active on Homepage' : 'Disabled'}
                </span>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(b)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(b.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingBanner ? 'Edit Banner Slide' : 'Create Banner Slide'}
              </h2>
              <button className="drawer-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Headline Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Special Wholesale Rates for Commercial Buyers"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle / Description</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Short promotional explanation..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Badge Label</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. B2B Mandi Wholesale"
                      value={formData.badge_text}
                      onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTA Button Link</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. /wholesale or /catalog"
                      value={formData.cta_link}
                      onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Banner Background Image (Supabase Storage / Upload)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={formData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="banner-file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="banner-file-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer', marginBottom: '0.4rem', display: 'inline-flex' }}>
                        <Upload size={14} />
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      </label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Image URL"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer', marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Active in Hero Carousel</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} />
                  <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
