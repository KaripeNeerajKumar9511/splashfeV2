"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";
import MarketingPageShell from "@/components/home/MarketingPageShell";
import LucideIcon from "@/components/landing-pages/LucideIcon";
import ThemesCarousel from "@/components/landing-pages/ThemesCarousel";
import { absoluteApiUrl } from "@/lib/landingPages";
import { adaptBlogHtmlForPortal } from "@/lib/adaptBlogHtmlForPortal";
import {
  BLOG_RENDERED_CONTENT_PORTAL_CLASS,
  BLOG_RENDERED_CONTENT_PORTAL_CSS,
} from "@/lib/blogContentStyles";

function mediaSrc(src) {
  return absoluteApiUrl(src);
}

function track(event, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

function HeroTitle({ title }) {
  const words = String(title || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 3) return title;
  const split = Math.max(3, Math.ceil(words.length * 0.45));
  const lead = words.slice(0, split).join(" ");
  const rest = words.slice(split).join(" ");
  return (
    <>
      {lead}{" "}
      <span className="text-[rgba(242,237,216,0.42)]">{rest}</span>
    </>
  );
}

function RatioFrame({ ratio }) {
  const [w, h] = String(ratio || "1:1")
    .split(":")
    .map((n) => Number(n) || 1);
  const max = Math.max(w, h);
  return (
    <div className="flex h-28 items-center justify-center sm:h-32">
      <div
        className="rounded-md border border-[rgba(201,168,76,0.45)] bg-[rgba(201,168,76,0.08)]"
        style={{
          width: `${(w / max) * 72}px`,
          height: `${(h / max) * 72}px`,
        }}
      />
    </div>
  );
}

function ArticleBody({ html }) {
  const adapted = adaptBlogHtmlForPortal(html || "");
  if (!adapted) return null;
  return (
    <div
      className={`${BLOG_RENDERED_CONTENT_PORTAL_CLASS} lp-article`}
      dangerouslySetInnerHTML={{ __html: adapted }}
    />
  );
}

function hasHtml(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return text.length > 0;
}

export default function DynamicLandingPage({ page }) {
  const hero = page?.hero || {};
  const why = page?.why || {};
  const generateCards = page?.generate_cards || [];
  const visuals = page?.visuals || [];
  const ratios = page?.aspect_ratios || [];
  const ecommerce = page?.ecommerce_use_cases || [];
  const faqs = page?.faqs || [];
  const cta = page?.cta || {};
  const article = page?.article || {};
  const keyword = page.primary_keyword || page.name || "";
  const topic = page.name || keyword;
  const whyBody = why.body || why.intro || "";
  const showWhy = Boolean(why.title || hasHtml(whyBody));
  const showArticle = Boolean(article.title || hasHtml(article.body));

  useEffect(() => {
    track("landing_page_view", {
      page_type: page.type,
      page_slug: page.slug,
      page_name: page.name,
    });
  }, [page.type, page.slug, page.name]);

  return (
    <MarketingPageShell>
      <style>{`
        ${BLOG_RENDERED_CONTENT_PORTAL_CSS}
        .lp-article { font-family: 'DM Sans', sans-serif; font-size: 18px; line-height: 1.75; color: rgba(242,237,216,0.72); }
        .lp-article p { margin: 0 0 1.25rem; font-size: 18px; font-weight: 300; line-height: 1.75; color: rgba(242,237,216,0.72); }
        .lp-article h2, .lp-article h3, .lp-article h4 {
          font-family: 'Cormorant Garamond', serif; font-weight: 400; color: #F2EDD8; margin: 1.75rem 0 1rem;
        }
        .lp-article h2 { font-size: 1.75rem; }
        .lp-article h3 { font-size: 1.35rem; }
        .lp-article ul, .lp-article ol { margin: 0 0 1.5rem; padding-left: 1.4rem; }
        .lp-article li { margin: 0.4rem 0; }
        .lp-article a { color: #C9A84C; }
        .lp-faq-summary::-webkit-details-marker { display: none; }
        .lp-page > section { padding-top: 3.5rem; padding-bottom: 3.5rem; }
        .lp-page > section:first-of-type { padding-top: 0; padding-bottom: 3.5rem; }
        .lp-page > section:last-of-type { padding-bottom: 4.5rem; }
        .lp-hero-row { display: flex; flex-direction: column-reverse; align-items: center; gap: 3rem; }
        .lp-hero-copy, .lp-hero-visual { width: 100%; }
        .lp-hero-frame { position: relative; width: 100%; aspect-ratio: 3 / 4; overflow: hidden; border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); }
        .lp-hero-frame img { width: 100%; height: 100%; object-fit: cover; }
        .lp-hero-copy h1 { font-size: 2.25rem; line-height: 1.1; }
        .lp-themes-copy { text-align: center; max-width: 42rem; margin: 0 auto 4rem; padding: 0 24px; opacity: 0; transform: translateY(20px); transition: opacity 700ms ease, transform 700ms ease; }
        .lp-themes-gallery { position: relative; opacity: 0; transform: translateY(30px); transition: opacity 800ms 160ms ease, transform 800ms 160ms ease; }
        .lp-themes.is-in .lp-themes-copy,
        .lp-themes.is-in .lp-themes-gallery { opacity: 1; transform: none; }
        .lp-theme-viewport { overflow: hidden; cursor: grab; touch-action: pan-y; user-select: none; }
        .lp-theme-viewport:active { cursor: grabbing; }
        .lp-theme-track { display: flex; align-items: flex-start; gap: 16px; width: max-content; will-change: transform; padding: 0 16px; }
        .lp-theme-card { flex: 0 0 auto; width: min(82vw, 340px); margin: 0; }
        .lp-theme-photo {
          height: 68vw; max-height: 460px; min-height: 380px;
          overflow: hidden; border-radius: 20px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.38);
        }
        .lp-theme-photo img {
          display: block; width: 100%; height: 100%; object-fit: cover; object-position: center;
          transition: transform 600ms ease-out, filter 600ms ease-out;
        }
        .lp-theme-card:hover .lp-theme-photo img { transform: scale(1.04); filter: brightness(1.08) contrast(1.04); }
        .lp-theme-label {
          margin-top: 12px; text-align: center;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase; color: rgba(242,237,216,0.72);
        }
        .lp-theme-arrow {
          position: absolute; top: 42%; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 999px;
          background: rgba(14,13,9,0.55); border: 1px solid rgba(255,255,255,0.16);
          color: #F2EDD8; transition: background 200ms ease, transform 200ms ease, border-color 200ms ease;
        }
        .lp-theme-arrow:hover { background: rgba(14,13,9,0.82); border-color: rgba(201,168,76,0.55); transform: scale(1.06); }
        .lp-theme-arrow-prev { left: 12px; }
        .lp-theme-arrow-next { right: 12px; }
        @media (min-width: 768px) {
          .lp-hero-copy h1 { font-size: 3.75rem; }
          .lp-theme-card { width: 340px; }
          .lp-theme-photo { height: 460px; max-height: none; min-height: 0; }
          .lp-theme-track { gap: 18px; padding: 0 24px; }
        }
        @media (min-width: 1024px) {
          .lp-hero-row { flex-direction: row; gap: 5rem; }
          .lp-hero-copy { width: 60%; }
          .lp-hero-visual { width: 40%; }
          .lp-hero-copy h1 { font-size: 4.5rem; }
        }
        @media (min-width: 1280px) {
          .lp-theme-card { width: 360px; }
          .lp-theme-photo { height: 500px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-themes-copy, .lp-themes-gallery { opacity: 1; transform: none; transition: none; }
          .lp-theme-card:hover .lp-theme-photo img { transform: none; filter: none; }
        }
      `}</style>

      <div className="lp-page bg-[#0E0D09]">
        {page.is_preview ? (
          <div className="border-b border-[rgba(201,168,76,0.28)] bg-[#161410] px-4 py-2 text-center font-['DM_Sans',sans-serif] text-xs tracking-wide text-[#C9A84C]">
            Preview — this page is not public
          </div>
        ) : null}

        <section className="relative w-full overflow-hidden bg-[#0E0D09]">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
            <div className="lp-hero-row">
              <div className="lp-hero-copy z-10 flex flex-col items-start text-left">
                {(why.eyebrow || keyword) ? (
                  <p className="mb-6 font-['DM_Sans',sans-serif] text-sm font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
                    {why.eyebrow || keyword}
                  </p>
                ) : null}
                <h1 className="mb-8 font-['Cormorant_Garamond',serif] text-4xl font-normal leading-[1.1] tracking-tight text-[#F2EDD8] md:text-6xl lg:text-7xl">
                  <HeroTitle title={hero.title} />
                </h1>
                {hero.tagline ? (
                  <p className="mb-10 max-w-2xl font-['DM_Sans',sans-serif] text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)] md:text-xl">
                    {hero.tagline}
                  </p>
                ) : null}
                <div className="flex w-full flex-col gap-5 sm:w-auto sm:flex-row">
                  <Link
                    href="/signup"
                    onClick={() => track("get_started_click", { page_slug: page.slug, location: "hero" })}
                    className="inline-flex min-h-[62px] items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 font-['DM_Sans',sans-serif] text-lg font-medium text-[#0E0D09] transition hover:opacity-90"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5" strokeWidth={2} />
                  </Link>
                  {visuals.length ? (
                    <a
                      href="#themes"
                      onClick={() => track("view_themes_click", { page_slug: page.slug })}
                      className="inline-flex min-h-[62px] items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] px-8 py-4 font-['DM_Sans',sans-serif] text-lg font-medium text-[#F2EDD8] transition hover:border-[#C9A84C]"
                    >
                      View Visuals
                      <Globe className="h-5 w-5" strokeWidth={1.6} />
                    </a>
                  ) : null}
                </div>
              </div>
              {hero.image ? (
                <div className="lp-hero-visual relative">
                  <div className="lp-hero-frame shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaSrc(hero.image)}
                      alt={hero.title || keyword}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {showWhy ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-4xl space-y-8 text-left">
              {why.title ? (
                <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-normal leading-tight text-[#F2EDD8] md:text-4xl">
                  {why.title}
                </h2>
              ) : null}
              <ArticleBody html={whyBody} />
            </div>
          </section>
        ) : null}

        {generateCards.length > 0 ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-6 text-center font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#F2EDD8] md:text-5xl">
                {page.generate_title || `What We Generate for ${topic}`}
              </h2>
              <p className="mx-auto mb-10 max-w-3xl text-center font-['DM_Sans',sans-serif] text-lg font-light text-[rgba(242,237,216,0.58)]">
                {page.generate_subtitle || "Everything you need to sell jewellery online — images and videos generated using AI."}
              </p>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {generateCards.map((card) => (
                  <article key={card.id} className="group flex flex-col items-center text-center">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.1)] bg-white/5 text-[#C9A84C] transition group-hover:border-[rgba(201,168,76,0.5)]">
                      <LucideIcon name={card.icon} className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 font-['Cormorant_Garamond',serif] text-xl text-[#F2EDD8]">
                      {card.title}
                    </h3>
                    <p className="mx-auto max-w-xs font-['DM_Sans',sans-serif] text-sm font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                      {card.tagline}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {visuals.length > 0 ? (
          <section id="themes" className="relative scroll-mt-24 overflow-hidden bg-[#0E0D09]">
            <ThemesCarousel
              visuals={visuals}
              title={page.visuals_title || `Themes for ${topic}`}
              subtitle={page.visuals_subtitle || "Choose from a wide range of studio and lifestyle themes."}
            />
          </section>
        ) : null}

        {ratios.length > 0 ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-4 text-center font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#F2EDD8] md:text-5xl">
                Available Aspect Ratios
              </h2>
              <p className="mx-auto mb-12 max-w-3xl text-center font-['DM_Sans',sans-serif] text-lg font-light text-[rgba(242,237,216,0.58)]">
                Generate jewellery images and videos optimized for every platform.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
                {ratios.map((ratio) => (
                  <article
                    key={ratio.id || ratio.ratio}
                    className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#161410] p-5 text-center transition hover:border-[rgba(201,168,76,0.45)]"
                  >
                    <p className="mb-2 font-['DM_Sans',sans-serif] text-sm tracking-wide text-[#C9A84C]">
                      {ratio.ratio}
                    </p>
                    <RatioFrame ratio={ratio.ratio} />
                    <h3 className="mt-3 font-['Cormorant_Garamond',serif] text-xl text-[#F2EDD8] sm:text-2xl">
                      {ratio.name}
                    </h3>
                    <p className="mt-1 font-['DM_Sans',sans-serif] text-[10px] uppercase tracking-[0.16em] text-[rgba(242,237,216,0.45)] sm:text-xs">
                      {ratio.description}
                    </p>
                    {ratio.use_case ? (
                      <p className="mt-2 hidden font-['DM_Sans',sans-serif] text-xs font-light leading-relaxed text-[rgba(242,237,216,0.55)] sm:block">
                        {ratio.use_case}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {showArticle ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-4xl space-y-8">
              {article.title ? (
                <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-normal leading-tight text-[#F2EDD8] md:text-4xl">
                  {article.title}
                </h2>
              ) : null}
              <ArticleBody html={article.body} />
            </div>
          </section>
        ) : null}

        {ecommerce.length > 0 ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-4 text-center font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#F2EDD8] md:text-5xl">
                {page.ecommerce_title || "Ecommerce Ready Visuals"}
              </h2>
              <p className="mx-auto mb-12 max-w-3xl text-center font-['DM_Sans',sans-serif] text-lg font-light text-[rgba(242,237,216,0.58)]">
                {page.ecommerce_subtitle || "Use AI-generated jewellery images and videos seamlessly across all ecommerce platforms."}
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ecommerce.map((card) => (
                  <article
                    key={card.id}
                    className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#161410] p-8 transition hover:border-[rgba(201,168,76,0.3)]"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(201,168,76,0.12)] text-[#C9A84C]">
                      <LucideIcon name={card.icon} className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 font-['Cormorant_Garamond',serif] text-xl text-[#F2EDD8]">
                      {card.title}
                    </h3>
                    <p className="font-['DM_Sans',sans-serif] font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="bg-[#0E0D09] px-6">
            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#F2EDD8] md:text-4xl">
                {page.faq_title || `Frequently Asked Questions – ${topic}`}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={faq.id || faq.question}
                    className="group overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.07)] bg-white/5"
                  >
                    <summary className="lp-faq-summary flex cursor-pointer list-none items-center justify-between p-6 text-left">
                      <span className="pr-4 font-['DM_Sans',sans-serif] text-lg font-medium text-[#F2EDD8]">
                        {index + 1}. {faq.question}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C9A84C] bg-[#C9A84C] text-[#0E0D09] transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-6 pb-6 font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.62)]">
                      {/<\/?[a-z][\s\S]*>/i.test(faq.answer || "") ? (
                        <div dangerouslySetInnerHTML={{ __html: adaptBlogHtmlForPortal(faq.answer) }} />
                      ) : (
                        <p>{faq.answer}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-[#0E0D09] px-6 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 font-['Cormorant_Garamond',serif] text-4xl font-normal leading-tight text-[#F2EDD8] md:text-6xl">
              {cta.title || `Ready to Transform Your ${topic}?`}
            </h2>
            {cta.tagline ? (
              <p className="mx-auto mb-10 max-w-2xl font-['DM_Sans',sans-serif] text-lg font-light text-[rgba(242,237,216,0.58)]">
                {cta.tagline}
              </p>
            ) : (
              <div className="mb-10" />
            )}
            <Link
              href="/signup"
              onClick={() => track("get_started_click", { page_slug: page.slug, location: "final_cta" })}
              className="inline-flex min-h-[62px] items-center justify-center rounded-full bg-[#C9A84C] px-8 py-4 font-['DM_Sans',sans-serif] text-lg font-medium text-[#0E0D09] transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </MarketingPageShell>
  );
}
