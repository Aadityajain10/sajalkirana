import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="hero-slider-section">
      <div
        className="hero-slide"
        style={{
          backgroundImage: `url(${current.image_url})`,
        }}
      >
        <div className="hero-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            {current.badge_text && (
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>{current.badge_text}</span>
              </div>
            )}
            <h1 className="hero-title">{current.title}</h1>
            <p className="hero-subtitle">{current.subtitle}</p>
            <div className="hero-actions">
              <Link to={current.cta_link || '/catalog'} className="btn btn-accent btn-lg">
                <span>{current.cta_text || 'Shop Now'}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/wholesale" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}>
                Wholesale Inquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="hero-arrow-btn hero-arrow-prev"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="hero-arrow-btn hero-arrow-next"
            >
              <ChevronRight size={22} />
            </button>

            {/* Dots */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                gap: '0.5rem'
              }}
            >
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: idx === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentIndex ? '#f97316' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
