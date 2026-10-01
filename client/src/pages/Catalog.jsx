import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../services/api.js';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc', 'name'

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          api.getCategories().catch(() => ({ data: [] })),
          api.getProducts({
            category: currentCategory,
            search: currentSearch
          }).catch(() => ({ data: [] }))
        ]);

        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error('Failed to load catalog data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentCategory, currentSearch]);

  const handleCategorySelect = (slug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('category', slug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set('search', val.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.retail_price - b.retail_price;
    if (sortBy === 'price-desc') return b.retail_price - a.retail_price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="catalog-page" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            All Grocery Products
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Browse fresh retail groceries, pulses, grains, oils, and kitchen staples at best everyday prices.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            background: 'var(--surface-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Top Controls: Status + Sort */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong>{sortedProducts.length}</strong> items
                {currentCategory && ` in ${categories.find(c => c.slug === currentCategory)?.name || currentCategory}`}
              </span>

              {currentSearch && (
                <span
                  style={{
                    background: 'var(--primary-50)',
                    color: 'var(--primary-800)',
                    border: '1px solid var(--primary-200)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 600
                  }}
                >
                  <span>Search: "<strong>{currentSearch}</strong>"</span>
                  <X
                    size={14}
                    style={{ cursor: 'pointer', color: 'var(--primary-700)' }}
                    onClick={() => handleSearchChange('')}
                    title="Clear search"
                  />
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-subtle)',
                  background: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="catalog-category-bar">
            <button
              onClick={() => handleCategorySelect('')}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: !currentCategory ? 'var(--primary-700)' : 'var(--surface-subtle)',
                color: !currentCategory ? '#ffffff' : 'var(--text-body)',
                border: 'none',
                transition: 'all 0.15s'
              }}
            >
              All Categories
            </button>

            {categories.map((cat) => {
              const active = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: active ? 'var(--primary-700)' : 'var(--surface-subtle)',
                    color: active ? '#ffffff' : 'var(--text-body)',
                    border: 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {cat.name}
                </button>
              );
            })}

            {(currentCategory || currentSearch) && (
              <button
                onClick={clearAllFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#dc2626',
                  background: '#fee2e2',
                  border: 'none',
                  marginLeft: 'auto'
                }}
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>



        {/* Product Grid */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading products...
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              We couldn't find any products matching your current search or category filter.
            </p>
            <button className="btn btn-primary" onClick={clearAllFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
