import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload, FolderTree } from 'lucide-react';
import { api } from '../../services/api.js';
import { uploadImage } from '../../services/supabase.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminCategories() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    icon_name: 'Package'
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      icon_name: 'Package'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      icon_name: cat.icon_name || 'Package'
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, 'categories');
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        addToast('Category image uploaded!', 'success');
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
    if (!formData.name) return;

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        addToast('Category updated!', 'success');
      } else {
        await api.createCategory(formData);
        addToast('Category created!', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category', err);
      addToast(err.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      addToast('Category removed', 'success');
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category', err);
      addToast('Failed to delete category', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title">Category Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Manage grocery aisles, departments, and category thumbnail visuals.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <img
                      src={cat.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80'}
                      alt=""
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  </td>
                  <td style={{ fontWeight: 700 }}>{cat.name}</td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{cat.slug}</td>
                  <td style={{ color: 'var(--text-body)', fontSize: '0.85rem' }}>{cat.description}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(cat)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(cat.id, cat.name)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button className="drawer-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Dals & Pulses"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slug (URL identifier)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. dals-pulses (leave empty to auto-generate)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Short summary of items in this department..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category Image</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={formData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="cat-file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="cat-file-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer', marginBottom: '0.4rem', display: 'inline-flex' }}>
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
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} />
                  <span>{editingCategory ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
