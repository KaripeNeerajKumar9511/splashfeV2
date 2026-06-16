"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MarketingNav from "@/components/home/MarketingNav";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "campaign", label: "Campaign" },
  { id: "background", label: "Background change" },
  { id: "product", label: "Product shot" },
];

export default function PublicGallery({ images = [] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return images;
    return images.filter((img) => img.category === activeFilter);
  }, [images, activeFilter]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, goPrev, goNext]);

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="gallery-page">
      <MarketingNav />

      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

.gallery-page {
  --gold: #C9A84C;
  --gold-l: #E8D08A;
  --gold-dim: rgba(201, 168, 76, 0.12);
  --gold-b: rgba(201, 168, 76, 0.22);
  --d1: #0E0D09;
  --d2: #161410;
  --d3: #1E1C15;
  --t1: #F2EDD8;
  --t2: rgba(242, 237, 216, 0.58);
  --t3: rgba(242, 237, 216, 0.32);
  --nav-h: 64px;
  min-height: 100dvh;
  background: var(--d1);
  color: var(--t1);
  font-family: 'DM Sans', sans-serif;
  padding-top: var(--nav-h);
}

@media (max-width: 768px) {
  .gallery-page { --nav-h: 56px; }
}

.gallery-hero {
  position: relative;
  text-align: center;
  padding: clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 5%) clamp(2rem, 5vw, 3rem);
  background: var(--d2);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.gallery-hero-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(600px, 100%);
  height: 280px;
  background: radial-gradient(ellipse, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.gallery-eye {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.25rem;
}

.gallery-eye::before {
  content: '';
  width: 28px;
  height: 0.5px;
  background: var(--gold);
}

.gallery-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 5.5vw, 64px);
  font-weight: 300;
  line-height: 1.08;
  color: var(--t1);
  margin-bottom: 1rem;
}

.gallery-title em {
  font-style: italic;
  color: var(--gold-l);
}

.gallery-sub {
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 300;
  color: var(--t2);
  max-width: 520px;
  margin: 0 auto 2rem;
  line-height: 1.75;
}

.gallery-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.gallery-filter {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding: 8px 18px;
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  background: var(--d3);
  color: var(--t2);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.gallery-filter:hover {
  color: var(--t1);
  border-color: var(--gold-b);
}

.gallery-filter.active {
  background: var(--gold-dim);
  border-color: var(--gold-b);
  color: var(--gold-l);
}

.gallery-grid-wrap {
  padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5%);
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-count {
  font-size: 12px;
  color: var(--t3);
  letter-spacing: 0.06em;
  margin-bottom: 1.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.gallery-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid var(--gold-b);
  background: var(--d3);
  cursor: pointer;
  aspect-ratio: 4 / 5;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.gallery-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-card:hover img {
  transform: scale(1.04);
}

.gallery-card-label {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 2;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-l);
  background: rgba(14, 13, 9, 0.82);
  padding: 6px 10px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.25s, transform 0.25s;
}

.gallery-card:hover .gallery-card-label {
  opacity: 1;
  transform: translateY(0);
}

.gallery-card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.gallery-empty {
  text-align: center;
  padding: 4rem 1.5rem;
  color: var(--t2);
}

.gallery-cta {
  text-align: center;
  padding: clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 5%);
  background: var(--d2);
  border-top: 0.5px solid rgba(255, 255, 255, 0.07);
  position: relative;
}

.gallery-cta-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(500px, 100%);
  height: 200px;
  background: radial-gradient(ellipse at bottom, rgba(201, 168, 76, 0.07) 0%, transparent 65%);
  pointer-events: none;
}

.gallery-cta h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 1rem;
  position: relative;
}

.gallery-cta h2 em {
  font-style: italic;
  color: var(--gold-l);
}

.gallery-cta p {
  font-size: 15px;
  color: var(--t2);
  margin-bottom: 2rem;
  font-weight: 300;
}

.gallery-cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}

.btn-gold {
  background: var(--gold);
  color: var(--d1);
  font-size: 14px;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-gold:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  color: var(--d1);
}

.btn-outline {
  border: 0.5px solid var(--gold-b);
  color: var(--t2);
  font-size: 14px;
  font-weight: 400;
  padding: 13px 24px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s, border-color 0.2s;
}

.btn-outline:hover {
  color: var(--t1);
  border-color: var(--gold);
}

.gallery-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  padding: 2rem clamp(1.25rem, 5vw, 5%);
  border-top: 0.5px solid rgba(255, 255, 255, 0.07);
  background: var(--d1);
}

.gallery-footer img {
  height: 40px;
  width: auto;
}

.gallery-footer-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.gallery-footer-links a {
  color: var(--t2);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.gallery-footer-links a:hover {
  color: var(--gold-l);
}

.gallery-footer-copy {
  font-size: 12px;
  color: var(--t3);
  width: 100%;
  text-align: center;
}

@media (min-width: 769px) {
  .gallery-footer-copy { width: auto; text-align: right; flex: 1; }
}

/* Lightbox */
.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(14, 13, 9, 0.94);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2rem);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gallery-lightbox-inner {
  position: relative;
  max-width: min(900px, 100%);
  max-height: calc(100dvh - 4rem);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.gallery-lightbox-inner img {
  max-width: 100%;
  max-height: calc(100dvh - 8rem);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  border: 0.5px solid var(--gold-b);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.gallery-lightbox-meta {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-l);
}

.gallery-lightbox-close {
  position: fixed;
  top: calc(var(--nav-h) + 12px);
  right: clamp(1rem, 4vw, 2rem);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  background: var(--d3);
  color: var(--t1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  z-index: 201;
}

.gallery-lightbox-close:hover {
  border-color: var(--gold-b);
  background: var(--d2);
}

.gallery-lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0.5px solid var(--gold-b);
  background: rgba(30, 28, 21, 0.9);
  color: var(--t1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  z-index: 201;
}

.gallery-lightbox-nav:hover {
  background: var(--d3);
  border-color: var(--gold);
}

.gallery-lightbox-nav.prev { left: clamp(0.75rem, 3vw, 2rem); }
.gallery-lightbox-nav.next { right: clamp(0.75rem, 3vw, 2rem); }

@media (max-width: 640px) {
  .gallery-lightbox-nav {
    width: 40px;
    height: 40px;
    top: auto;
    bottom: 1.5rem;
    transform: none;
  }
  .gallery-lightbox-nav.prev { left: calc(50% - 48px); }
  .gallery-lightbox-nav.next { right: calc(50% - 48px); left: auto; }
}
      `}</style>

      <header className="gallery-hero">
        <div className="gallery-hero-glow" aria-hidden="true" />
        <div className="gallery-eye">
          <Sparkles size={14} strokeWidth={1.5} />
          Showcase
        </div>
        <h1 className="gallery-title">
          Created with <em>Splash</em>
        </h1>
        <p className="gallery-sub">
          Every image below was generated by Splash AI — no photographer, no studio,
          just your jewelry and our AI.
        </p>
        <div className="gallery-filters" role="tablist" aria-label="Filter gallery">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeFilter === id}
              className={`gallery-filter${activeFilter === id ? " active" : ""}`}
              onClick={() => {
                setActiveFilter(id);
                setLightboxIndex(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="gallery-grid-wrap" aria-label="AI-generated jewelry gallery">
        {filtered.length > 0 ? (
          <>
            <p className="gallery-count">
              {filtered.length} visual{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="gallery-grid">
              {filtered.map((img, index) => (
                <article
                  key={img.filename}
                  className="gallery-card"
                  onClick={() => openLightbox(index)}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.label}`}
                >
                  <div className="gallery-card-shine" aria-hidden="true" />
                  <img src={img.src} alt={img.label} loading="lazy" />
                  <span className="gallery-card-label">{img.label}</span>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="gallery-empty">
            <p>No images in this category yet.</p>
          </div>
        )}
      </section>

      <section className="gallery-cta">
        <div className="gallery-cta-glow" aria-hidden="true" />
        <h2>
          Ready to create <em>your own</em>?
        </h2>
        <p>Upload your jewelry and get studio-quality visuals in minutes.</p>
        <div className="gallery-cta-actions">
          <Link href="/contact" className="btn-gold">
            Get a Demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
          </Link>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </section>

      <footer className="gallery-footer">
        <Link href="/">
          <img src="/images/SplashLogoPNG.png" alt="Splash AI Studio" />
        </Link>
        <ul className="gallery-footer-links">
          <li>
            <a
              href="https://www.instagram.com/splash_ai_studios/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className="gallery-footer-copy">© 2025 Splash AI Studio</div>
      </footer>

      {activeImage && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Close preview"
            onClick={closeLightbox}
          >
            <X size={20} />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-lightbox-nav prev"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="gallery-lightbox-nav next"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="gallery-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage.src} alt={activeImage.label} />
            <span className="gallery-lightbox-meta">{activeImage.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
