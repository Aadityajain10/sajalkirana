import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, X, Check } from 'lucide-react';
import { api } from '../../services/api.js';
import { uploadImage } from '../../services/supabase.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    category_id: '',
    category_slug: '',
    brand: '',
    retail_price: '',
    unit: 'kg',
    package_size: '',
    stock_quantity: 100,
    low_stock_threshold: 10,
    is_featured: false,
    is_active: true,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
    description: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      category_id: categories[0]?.id || '',
      category_slug: categories[0]?.slug || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id || '',
      category_slug: product.category_slug || '',
      brand: product.brand || '',
      retail_price: product.retail_price,
      unit: product.unit || 'kg',
      package_size: product.package_size || '',
      stock_quantity: product.stock_quantity || 0,
      low_stock_threshold: product.low_stock_threshold || 10,
      is_featured: !!product.is_featured,
      is_active: product.is_active !== false,
      images: product.images?.length > 0 ? product.images : initialFormState.images,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file, 'product-images');
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          images: [imageUrl, ...(prev.images.slice(1))]
        }));
        addToast('Image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed', err);
      addToast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.retail_price) {
      addToast('Please fill in required fields (Name & Price)', 'error');
      return;
    }

    try {
      const selectedCat = categories.find(c => c.id === formData.category_id || c.slug === formData.category_slug);
      const payload = {
        ...formData,
        category_slug: selectedCat?.slug || formData.category_slug,
        retail_price: parseFloat(formData.retail_price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
        low_stock_threshold: parseInt(formData.low_stock_threshold, 10)
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(payload);
        addToast('New product created!', 'success');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.deleteProduct(id);
      addToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
      addToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = !selectedCategory || p.category_slug === selectedCategory || p.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Product Catalog Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Manage everyday grocery prices, stock levels, and upload product photos.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by product name or brand..."
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '200px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80';
                  const isLow = p.stock_quantity <= p.low_stock_threshold;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={img} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {p.brand ? `${p.brand} • ` : ''}{p.package_size || p.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {p.category_name || categories.find(c => c.slug === p.category_slug)?.name || p.category_slug || 'General'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ₹{p.retail_price} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/{p.unit}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: isLow ? '#dc2626' : 'var(--text-heading)' }}>
                          {p.stock_quantity} {p.unit}s
                        </div>
                        {isLow && (
                          <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                            Low Stock (&lt;{p.low_stock_threshold})
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill ${p.is_active ? 'fulfilled' : 'cancelled'}`}>
                          {p.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleOpenEditModal(p)}
                            title="Edit Product"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProduct ? 'Edit Grocery Product' : 'Add New Grocery Product'}
              </h2>
              <button className="drawer-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Product Name */}
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Aashirvaad Shudh Chakki Atta (10 kg)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Category & Brand */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      required
                      value={formData.category_slug}
                      onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aashirvaad, Fortune, Tata"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>

                {/* Price, Unit & Stock */}
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="e.g. 440"
                      value={formData.retail_price}
                      onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit of Measure</label>
                    <select
                      className="form-select"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="packet">packet</option>
                      <option value="bag">bag</option>
                      <option value="L">L (Litre)</option>
                      <option value="tin">tin</option>
                      <option value="box">box</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Package Spec</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 10 kg Bag, 1L Pouch"
                      value={formData.package_size}
                      onChange={(e) => setFormData({ ...formData, package_size: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Current Stock Qty</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Low Stock Threshold</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image Upload / Storage */}
                <div className="form-group">
                  <label className="form-label">Product Image (Supabase Storage / Upload)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div className="image-upload-preview">
                      <img src={formData.images[0]} alt="Preview" />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="product-file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="product-file-input"
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', cursor: 'pointer', marginBottom: '0.5rem' }}
                      >
                        <Upload size={16} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      </label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Or enter image URL directly"
                        value={formData.images[0] || ''}
                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Product details, grain quality, packaging specifications..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Active in Storefront</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} />
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
