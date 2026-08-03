"use client";

import MarketingNav from "@/components/home/MarketingNav";
import MarketingFooter from "@/components/home/MarketingFooter";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');";

export default function MarketingPageShell({ children, className = "", showFooter = true }) {
  return (
    <div
      className={`marketing-page min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#0E0D09] text-[#F2EDD8] [--nav-h:64px] pt-[var(--nav-h)] max-md:[--nav-h:56px] ${className}`}
    >
      <style>{FONT_IMPORT}</style>
      <MarketingNav />
      {children}
      {showFooter ? <MarketingFooter /> : null}
    </div>
  );
}

export function MarketingHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.07)] bg-[#161410]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[min(640px,90vw)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20">
        {eyebrow ? (
          <p className="mb-4 font-['DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A84C]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mb-4 font-['Cormorant_Garamond',serif] text-4xl font-normal tracking-tight text-[#F2EDD8] sm:text-5xl md:text-[3.25rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto max-w-xl font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
