const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API request error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Store Settings
  getStoreSettings: () => fetchJson('/store-settings'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.wholesaleOnly) query.append('wholesaleOnly', params.wholesaleOnly);
    if (params.featured) query.append('featured', params.featured);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/products${qs}`);
  },

  getProductBySlug: (slug) => fetchJson(`/products/${slug}`),
  createProduct: (data) => fetchJson('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => fetchJson(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => fetchJson(`/products/${id}`, { method: 'DELETE' }),
  getInventoryAlerts: () => fetchJson('/products/inventory-alerts'),

  // Categories
  getCategories: () => fetchJson('/categories'),
  createCategory: (data) => fetchJson('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => fetchJson(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => fetchJson(`/categories/${id}`, { method: 'DELETE' }),

  // Banners
  getBanners: () => fetchJson('/banners'),
  createBanner: (data) => fetchJson('/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id, data) => fetchJson(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id) => fetchJson(`/banners/${id}`, { method: 'DELETE' }),

  // Inquiries / Bulk Orders
  getInquiries: (params = {}) => {
    const query = new URLSearchParams(params);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/inquiries${qs}`);
  },
  createInquiry: (data) => fetchJson('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateInquiryStatus: (id, status) => fetchJson(`/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Analytics
  getDashboardStats: () => fetchJson('/analytics/dashboard'),
};
