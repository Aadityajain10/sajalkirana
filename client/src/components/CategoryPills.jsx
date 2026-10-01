import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryPills({ categories = [], activeSlug = '' }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-scroller-wrap">
      <div className="section-header">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Wholesale sacks, bulk cartons, and daily kitchen packs</p>
        </div>
        <Link to="/catalog" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="category-grid">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <Link
              key={cat.id || cat.slug}
              to={`/catalog?category=${cat.slug}`}
              className={`category-card ${isActive ? 'active' : ''}`}
            >
              <div className="category-thumb-wrap">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="category-thumb"
                  loading="lazy"
                />
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
