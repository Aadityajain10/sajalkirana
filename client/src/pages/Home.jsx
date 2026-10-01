import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Award, MessageCircle, ShoppingBag, Clock } from 'lucide-react';
import HeroBanner from '../components/HeroBanner.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../services/api.js';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [bannersRes, categoriesRes, productsRes] = await Promise.all([
          api.getBanners().catch(() => ({ data: [] })),
          api.getCategories().catch(() => ({ data: [] })),
          api.getProducts({ featured: 'true', limit: 8 }).catch(() => ({ data: [] }))
        ]);

        // Clean up any banners referencing wholesale
        const cleanBanners = (bannersRes.data || []).map(b => ({
          ...b,
          cta_link: b.cta_link?.includes('wholesale') ? '/catalog' : b.cta_link,
          cta_text: b.cta_text?.includes('Wholesale') ? 'Shop Now' : b.cta_text,
          badge_text: b.badge_text?.includes('Wholesale') ? 'Best Price Store' : b.badge_text
        }));

        setBanners(cleanBanners);
        setCategories(categoriesRes.data || []);
        setFeaturedProducts(productsRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="home-page">
      <div className="container">
        {/* 1. Hero Promotional Carousel */}
        <HeroBanner banners={banners} />

        {/* 2. Category Navigation */}
        <CategoryPills categories={categories} />

        {/* 3. Featured Kirana Staples */}
        <section style={{ margin: '3rem 0' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Trending Daily Essentials</h2>
              <p className="section-subtitle">Top-quality unpolished pulses, aged basmati, chakki fresh atta and pure edible oils</p>
            </div>
            <Link to="/catalog" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Explore All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Quick WhatsApp Order Card */}
        <section className="home-cta-section">
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
              <MessageCircle size={14} /> SIMPLE & FAST ORDERING
            </div>
            <h2 className="home-cta-title">
              Have a Handwritten Grocery List? Order Directly on WhatsApp!
            </h2>
            <p className="home-cta-desc">
              Take a photo of your monthly grocery list or type your requirements. We will quickly prepare your order and deliver it to your doorstep with instant confirmation.
            </p>
            <div className="home-cta-actions">
              <a
                href="https://wa.me/917974981304?text=Namaste%20Sajal%20Kirana,%20I%20want%20to%20place%20a%20grocery%20order."
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={20} />
                <span>WhatsApp Sajal (79749 81304)</span>
              </a>
              <a
                href="https://wa.me/918819939196?text=Namaste%20Sajal%20Kirana,%20I%20want%20to%20place%20a%20grocery%20order."
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
              >
                <MessageCircle size={20} />
                <span>WhatsApp Counter (88199 39196)</span>
              </a>
              <Link to="/catalog" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}>
                Browse Online Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Trust Badges & Kirana Assurance */}
        <section className="home-trust-section">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Why Families Trust Sajal Kirana
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Over 15+ years of providing pure, unadulterated food grains, fresh spices, and dependable grocery service.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>100% Pure & Clean</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Machine-cleaned grains with zero stones and unpolished natural nutrition.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Genuine Best Prices</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Honest and transparent everyday grocery pricing on all kitchen staples.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Truck size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fast Local Delivery</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Prompt doorstep delivery straight from our market store to your home.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <MessageCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>WhatsApp Ordering</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Seamless ordering over WhatsApp with quick response and delivery status.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
