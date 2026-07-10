"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  GemIcon,
  StoreIcon,
  PaletteIcon,
  Share2Icon,
} from "lucide-react";
import MarketingNav from "@/components/home/MarketingNav";
import { apiService } from "@/lib/api";
import { HOME_PAGE_DEFAULTS, resolveHomeContent } from "@/lib/pageContentDefaults";

const WHO_ICON_MAP = {
  Gem: GemIcon,
  Store: StoreIcon,
  Palette: PaletteIcon,
  Share2: Share2Icon,
};

const OUTPUT_ICONS = [
  <svg key="0" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="5" /><circle cx="9" cy="9" r="2" /></svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><path d="M3 15 Q9 3 15 15" /><circle cx="9" cy="8" r="2" /></svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="6" width="12" height="9" rx="2" /><path d="M6 6V5a3 3 0 016 0v1" /></svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="6" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="4" height="9" rx="1" /><rect x="7" y="7" width="4" height="7" rx="1" /><rect x="12" y="6" width="4" height="8" rx="1" /></svg>,
];

function TickerContent({ items }) {
  return (
    <>
      {items.map((item) => (
        <React.Fragment key={`${item.strong}-${item.span}`}>
          <div className="ti">
            <strong>{item.strong}</strong>
            <span>{item.span}</span>
          </div>
          <span className="td" aria-hidden="true">
            ✦
          </span>
        </React.Fragment>
      ))}
    </>
  );
}

const FALLBACK_SHOWCASE = [
  { id: "fallback-1", src: "/images/lifestyle.webp", label: "Lifestyle", homepage_layout: "lifestyle", alt: "Gold and emerald necklace product shot" },
  { id: "fallback-2", src: "/images/campaign.webp", label: "Campaign visual", homepage_layout: "campaign", alt: "Campaign visual with model wearing gold necklace" },
  { id: "fallback-3", src: "/images/product.webp", label: "Product shot", homepage_layout: "product", alt: "Lifestyle setup at a festive jewelry event" },
  { id: "fallback-4", src: "/images/model.webp", label: "Model shot", homepage_layout: "model", alt: "Model shot with gold chain necklace" },
  { id: "fallback-5", src: "/images/multipice.png", label: "Multi piece", homepage_layout: "multipiece", alt: "Multi-piece gold earrings collection" },
];

export default function SplashLanding() {
  const [showcaseImages, setShowcaseImages] = useState(FALLBACK_SHOWCASE);
  const [pageContent, setPageContent] = useState(HOME_PAGE_DEFAULTS);

  useEffect(() => {
    apiService
      .getPageContent("home")
      .then((data) => setPageContent(data || {}))
      .catch(() => setPageContent({}));
  }, []);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    fetch(`${apiBase}/api/homepage/public-gallery/showcase/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.images) && data.images.length > 0) {
          setShowcaseImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  const content = useMemo(() => resolveHomeContent(pageContent), [pageContent]);
  const { hero, ticker, showcase, how, output, capabilities, who_uses, testimonials, pricing, cta, footer } = content;

  return (
    <div className="splash-page">
      <MarketingNav isHome />
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#C9A84C;--gold-l:#E8D08A;--gold-dim:rgba(201,168,76,0.12);--gold-b:rgba(201,168,76,0.22);
  --d1:#0E0D09;--d2:#161410;--d3:#1E1C15;--d4:#26231A;--d5:#2E2B20;
  --t1:#F2EDD8;--t2:rgba(242,237,216,0.58);--t3:rgba(242,237,216,0.32);
  --b:rgba(255,255,255,0.07);--bg:rgba(201,168,76,0.2);
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'DM Sans',sans-serif;background:var(--d1);color:var(--t1);line-height:1.6;overflow-x:hidden;max-width:100vw}
.splash-page{--nav-h:64px;width:100%;max-width:100%;overflow-x:clip;padding-top:var(--nav-h);position:relative;isolation:isolate}
.splash-page img,.splash-page svg{max-width:100%;height:auto}
.splash-page h1{width:100%;max-width:820px;padding-left:clamp(.5rem,3vw,1rem);padding-right:clamp(.5rem,3vw,1rem);overflow-wrap:break-word;word-wrap:break-word}

/* HERO */
.hero{min-height:max(520px,calc(92dvh - var(--nav-h)));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(3rem,8vw,5rem) clamp(1.25rem,5vw,5%) clamp(2.5rem,6vw,4rem);position:relative;width:100%;max-width:100%}
.hero-glow{position:absolute;top:8%;left:50%;transform:translateX(-50%);width:min(700px,100%);max-width:100vw;height:min(500px,70vh);background:radial-gradient(ellipse,rgba(201,168,76,.055) 0%,transparent 65%);pointer-events:none}
.pill{display:inline-flex;align-items:center;gap:8px;border:.5px solid var(--gold-b);padding:6px 14px 6px 10px;border-radius:20px;font-size:clamp(11px,2.8vw,12px);color:var(--gold-l);background:var(--gold-dim);letter-spacing:.03em;margin-bottom:clamp(1.25rem,4vw,2rem);max-width:100%;text-align:left;flex-wrap:wrap;justify-content:center}
.dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
h1{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,6.5vw,82px);font-weight:300;line-height:1.06;letter-spacing:-.01em;color:var(--t1);max-width:820px;margin-bottom:1.5rem}
h1 em{font-style:italic;color:var(--gold-l)}
.hero-sub{font-size:clamp(14px,3.5vw,16px);font-weight:300;color:var(--t2);max-width:min(500px,100%);line-height:1.75;margin-bottom:clamp(1.5rem,4vw,2.5rem);padding:0 .25rem}
.actions{display:flex;align-items:stretch;gap:10px;flex-wrap:wrap;justify-content:center;width:100%;max-width:420px}
.btn-p{background:var(--gold);color:var(--d1);font-family:'DM Sans',sans-serif;font-size:clamp(13px,3.2vw,14px);font-weight:500;padding:14px clamp(20px,5vw,30px);border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s,transform .15s;min-height:48px;flex:1 1 auto}
.btn-p:hover{opacity:.9;transform:translateY(-1px);color:var(--d1)}
.btn-o{border:.5px solid var(--gold-b);color:var(--t2);font-family:'DM Sans',sans-serif;font-size:clamp(13px,3.2vw,14px);font-weight:400;padding:13px clamp(18px,4vw,24px);border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:color .2s,border-color .2s;min-height:48px;flex:1 1 auto}
.btn-o:hover{color:var(--t1);border-color:var(--gold)}
.note{margin-top:1.25rem;font-size:clamp(11px,2.8vw,12px);color:var(--t3);letter-spacing:.02em;padding:0 .5rem;line-height:1.5;max-width:100%;overflow-wrap:break-word}

/* TICKER — auto-scroll marquee */
.ticker{background:var(--d2);border-top:.5px solid var(--b);border-bottom:.5px solid var(--b);overflow:hidden;width:100%;max-width:100%}
.ticker-track{display:flex;width:max-content;animation:ticker-scroll 28s linear infinite;will-change:transform}
.ticker-group{display:flex;align-items:center;gap:1.5rem;padding:.85rem clamp(1rem,4vw,5%);flex-shrink:0}
.ti{display:flex;align-items:center;gap:9px;flex-shrink:0}
.ti strong{font-size:13px;font-weight:500;color:var(--t1);white-space:nowrap}
.ti span{font-size:13px;color:var(--t2);font-weight:300;white-space:nowrap}
.td{color:var(--gold);font-size:10px;flex-shrink:0}
@keyframes ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.ticker-track{animation:none;flex-wrap:wrap;width:100%}.ticker-group{padding:.85rem 1rem}}

/* SHOWCASE */
.showcase{background:var(--d2);padding:5rem 5%;max-width:100%;box-sizing:border-box;overflow:hidden}
.showcase-hdr{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:2.5rem}
.showcase-cta{margin-top:.5rem;align-self:flex-start}
.sc-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr);grid-template-rows:minmax(250px,1.05fr) minmax(250px,1fr);gap:12px;min-height:540px}
.sc{border-radius:14px;overflow:hidden;border:.5px solid var(--gold-b);position:relative;background:var(--d3);min-height:0}
.sc-product{grid-column:1;grid-row:1/3}
.sc-campaign{grid-column:2;grid-row:1}
.sc-lifestyle{grid-column:3;grid-row:1}
.sc-model{grid-column:2;grid-row:2}
.sc-multipiece{grid-column:3;grid-row:2}
.sc-lbl{position:absolute;bottom:12px;left:14px;z-index:2;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-l);background:rgba(14,13,9,.82);padding:5px 10px;border-radius:6px;pointer-events:none;backdrop-filter:blur(4px)}
.sc-inner{position:absolute;inset:0;background:var(--d1)}
.sc-inner img{width:100%;height:100%;max-width:none;object-fit:contain;object-position:center;display:block}

/* SECTION COMMONS */
section{padding:6rem 5%;max-width:100%;box-sizing:border-box}
.eye{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem}
.eye::before{content:'';width:28px;height:.5px;background:var(--gold)}
.st{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,4.5vw,54px);font-weight:300;line-height:1.1;color:var(--t1);margin-bottom:1rem}
.st em{font-style:italic;color:var(--gold-l)}

/* HOW IT WORKS */
.how{background:var(--d1)}
.how-lay{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start;margin-top:1rem}
.how-steps{margin-top:2.5rem}
.step{display:flex;align-items:flex-start;gap:1.5rem;padding:1.75rem 0;border-bottom:.5px solid var(--b)}
.step:first-child{border-top:.5px solid var(--b)}
.sn{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:400;color:var(--gold);width:26px;flex-shrink:0;margin-top:3px;letter-spacing:.08em}
.s-title{font-size:15px;font-weight:500;color:var(--t1);margin-bottom:5px}
.s-desc{font-size:13px;color:var(--t2);line-height:1.65;font-weight:300}
.how-vis{position:sticky;top:100px;background:var(--d3);border:.5px solid var(--gold-b);border-radius:16px;height:440px;display:flex;align-items:center;justify-content:center;margin-top:2.5rem}
.hv-inner{text-align:center;padding:2rem}
.hv-icon{width:68px;height:68px;border-radius:50%;border:.5px solid var(--gold-b);background:var(--gold-dim);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem}
.hv-lbl{font-size:11px;color:var(--t3);letter-spacing:.08em;text-transform:uppercase}
.hv-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:300;color:var(--t1);margin-top:8px;line-height:1.4}
.thumb-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:1.75rem}
.thumb{background:var(--d5);border:.5px solid var(--gold-b);border-radius:8px;aspect-ratio:1;display:flex;align-items:center;justify-content:center}

/* OUTPUT TYPES */
.output{background:var(--d2)}
.og{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:2.75rem}
.oc{background:var(--d4);border:.5px solid var(--b);border-radius:12px;padding:1.5rem 1rem 1.25rem;display:flex;flex-direction:column;gap:.75rem;transition:border-color .2s}
.oc:hover{border-color:var(--gold-b)}
.oi{width:36px;height:36px;border-radius:8px;background:var(--gold-dim);border:.5px solid var(--gold-b);display:flex;align-items:center;justify-content:center}
.ot{font-size:13px;font-weight:500;color:var(--t1)}
.od{font-size:12px;color:var(--t2);line-height:1.55;font-weight:300;flex:1}

/* CAPABILITIES */
.cap{background:var(--d1)}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:2.75rem}
.cc{background:var(--d3);border:.5px solid var(--b);border-radius:14px;padding:2rem}
.cc.hi{border-color:var(--gold-b)}
.ctag{display:inline-block;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:var(--gold-dim);border:.5px solid var(--gold-b);padding:3px 10px;border-radius:4px;margin-bottom:1rem}
.ctitle{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--t1);margin-bottom:.65rem;line-height:1.25}
.cdesc{font-size:13px;color:var(--t2);line-height:1.7;font-weight:300}
.pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:1rem}
.pl{font-size:11px;color:var(--t2);border:.5px solid var(--b);padding:4px 10px;border-radius:20px;background:var(--d5)}
.pl.g{border-color:var(--gold-b);color:var(--gold-l)}

/* WHO */
.who{background:var(--d2)}
.wg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:2.75rem}
.wc{background:var(--d4);border:.5px solid var(--b);border-radius:14px;padding:2rem;display:flex;flex-direction:column;gap:.875rem}
.wc.hi{border-color:var(--gold-b);background:var(--d3)}
.wi{font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center}
.wi-icon{width:40px;height:40px;color:var(--gold);flex-shrink:0}
.wt{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--t1);line-height:1.2}
.wd{font-size:13px;color:var(--t2);line-height:1.7;font-weight:300}
.wr{display:flex;flex-direction:column;gap:8px}

/* TESTIMONIALS */
.test{background:var(--d1)}
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:2.75rem}
.tc{background:var(--d2);border:.5px solid var(--b);border-radius:14px;padding:1.75rem;display:flex;flex-direction:column;gap:1.25rem}
.stars{display:flex;gap:3px}
.star{width:12px;height:12px;background:var(--gold);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}
.tq{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:300;font-style:italic;color:var(--t1);line-height:1.65;flex:1}
.tq strong{font-style:normal;font-weight:600;color:var(--gold-l)}
.ta{display:flex;align-items:center;gap:12px;border-top:.5px solid var(--b);padding-top:1.25rem}
.av{width:36px;height:36px;border-radius:50%;background:var(--d5);border:.5px solid var(--gold-b);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;color:var(--gold-l);flex-shrink:0}
.an{font-size:13px;font-weight:500;color:var(--t1)}
.ar{font-size:11px;color:var(--t2);margin-top:1px}

/* PRICING */
.price{background:var(--d2)}
.price-anchor{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3vw,36px);font-weight:300;color:var(--t2);text-align:center;margin-bottom:2.75rem;line-height:1.3}
.price-anchor em{font-style:italic;color:var(--gold-l)}
.pg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-items:start}
.pc{background:var(--d3);border:.5px solid var(--b);border-radius:16px;padding:2rem;display:flex;flex-direction:column;gap:1rem;position:relative}
.pc.featured{border-color:var(--gold-b);background:var(--d4)}
.pc-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--d1);font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;padding:4px 16px;border-radius:20px;white-space:nowrap}
.pc-tier{font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--t3)}
.pc.featured .pc-tier{color:var(--gold)}
.pc-price{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:300;color:var(--t1);line-height:1}
.pc-price sup{font-size:22px;vertical-align:super;color:var(--t2);font-weight:300}
.pc-price-note{font-size:12px;color:var(--t2);font-weight:300;margin-top:2px}
.pc-credits{font-size:12px;color:var(--t3);font-weight:300;line-height:1.5}
.pc-divider{height:.5px;background:var(--b);margin:.25rem 0}
.pc-desc{font-size:12px;color:var(--t2);line-height:1.6;font-weight:300}
.pc-features{display:flex;flex-direction:column;gap:8px;flex:1}
.pf-row{display:flex;align-items:flex-start;gap:9px}
.pf-row.dim{opacity:.35}
.chk{width:16px;height:16px;border-radius:50%;background:var(--gold-dim);border:.5px solid var(--gold-b);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.chk.x{background:rgba(255,255,255,.04);border-color:var(--b)}
.pft{font-size:12px;color:var(--t2);font-weight:300;line-height:1.45}
.pft.dim{color:var(--t3)}
.pc-cta{display:block;text-align:center;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;padding:11px 16px;border-radius:8px;text-decoration:none;transition:opacity .2s,transform .15s;margin-top:.5rem}
.pc-cta.primary{background:var(--gold);color:var(--d1)}
.pc-cta.primary:hover{opacity:.9;transform:translateY(-1px)}
.pc-cta.outline{border:.5px solid var(--gold-b);color:var(--gold-l)}
.pc-cta.outline:hover{background:var(--gold-dim)}
.pc-cta.ghost{border:.5px solid var(--b);color:var(--t2)}
.pc-cta.ghost:hover{border-color:var(--gold-b);color:var(--t1)}

/* CTA */
.cta{background:var(--d1);text-align:center;padding:9rem 5% 8rem;position:relative}
.cta-glow{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:min(600px,100%);max-width:100vw;height:300px;background:radial-gradient(ellipse at bottom,rgba(201,168,76,.07) 0%,transparent 65%);pointer-events:none}
.cta h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5.5vw,66px);font-weight:300;line-height:1.08;color:var(--t1);margin-bottom:1.25rem}
.cta h2 em{font-style:italic;color:var(--gold-l)}
.cta-sub{font-size:15px;color:var(--t2);margin-bottom:2.75rem;font-weight:300}
.cta-acts{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.btn-wa{display:inline-flex;align-items:center;gap:8px;border:.5px solid rgba(37,211,102,.3);color:rgba(37,211,102,.85);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:400;padding:13px 24px;border-radius:8px;text-decoration:none;background:rgba(37,211,102,.06);transition:opacity .2s}
.btn-wa:hover{opacity:.8}
.cta-note{margin-top:1.5rem;font-size:12px;color:var(--t3)}

/* FOOTER */
footer{border-top:.5px solid var(--b);padding:1.75rem 5%;display:flex;align-items:center;justify-content:space-between;background:var(--d2);flex-wrap:wrap;gap:1rem}
.fl{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--t1)}
.fl span{color:var(--gold)}
.flinks{display:flex;gap:1.5rem;list-style:none}
.flinks a{font-size:12px;color:var(--t3);text-decoration:none}
.fc{font-size:12px;color:var(--t3)}

/* RESPONSIVE — tablet */
@media(max-width:960px){
  section{padding:clamp(3.5rem,8vw,4.5rem) clamp(1rem,4vw,4%)}
  .showcase{padding:clamp(3.5rem,8vw,4.5rem) clamp(1rem,4vw,4%)}
  .how-lay{grid-template-columns:1fr;gap:2.5rem}
  .how-vis{display:none}
  .og{grid-template-columns:repeat(2,1fr)}
  .cg{grid-template-columns:1fr}
  .wg{grid-template-columns:1fr}
  .tg{grid-template-columns:1fr}
  .pg{grid-template-columns:repeat(2,1fr)}
  .showcase-hdr{flex-direction:column;align-items:flex-start}
  footer{flex-direction:column;align-items:flex-start;gap:1.25rem}
  .cta{padding:6rem clamp(1rem,4vw,5%) 5rem}
}

/* Mobile layout */
@media(max-width:768px){
  .splash-page{--nav-h:56px}
  .hero{min-height:auto;padding-top:2.5rem;padding-bottom:2rem}
  h1{padding-left:clamp(.75rem,4vw,1.25rem);padding-right:clamp(.75rem,4vw,1.25rem)}
  .actions{flex-direction:column;max-width:100%}
  .btn-p,.btn-o{width:100%;flex:none;max-width:100%}
  .ticker-group{padding-top:.75rem;padding-bottom:.75rem}
  .ti strong,.ti span{font-size:12px}
  .step{gap:1rem;padding:1.35rem 0}
  .wc,.cc{padding:1.5rem}
  .cta-acts{flex-direction:column;width:100%;max-width:360px;margin:0 auto}
  .cta-acts .btn-p,.cta-acts .btn-wa{width:100%;justify-content:center}
  .flinks{flex-wrap:wrap;gap:1rem 1.25rem}
  .showcase{padding:clamp(2.5rem,6vw,3.5rem) clamp(.85rem,4vw,1.25rem)}
  .showcase-hdr{margin-bottom:1.5rem}
  .showcase-hdr .st{font-size:clamp(28px,7vw,40px)}
  .showcase-cta{width:100%;justify-content:center;text-align:center}
}

/* Mobile showcase stack (phones only — tablets use portrait layout below) */
@media(max-width:767px){
  .sc-grid{
    grid-template-columns:1fr;
    grid-template-rows:none;
    gap:12px;
    min-height:0;
    width:100%;
  }
  .sc-product,.sc-campaign,.sc-lifestyle,.sc-model,.sc-multipiece{
    grid-column:1;
    grid-row:auto;
    width:100%;
    min-height:0;
    aspect-ratio:4/3;
  }
  .sc-product{aspect-ratio:3/4}
  .sc-campaign{aspect-ratio:3/4}
  .sc-model,.sc-multipiece{aspect-ratio:3/4}
  .sc-inner img{object-fit:cover;object-position:center}
  .sc-product .sc-inner img,.sc-lifestyle .sc-inner img{object-position:center top}
  .sc-campaign .sc-inner img{object-position:center 20%}
  .sc-model .sc-inner img{object-position:center 15%}
  .sc-multipiece .sc-inner img{object-position:center}
  .sc-lbl{
    bottom:10px;
    left:10px;
    font-size:11px;
    letter-spacing:.1em;
    padding:7px 12px;
    border-radius:8px;
    max-width:calc(100% - 20px);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
}

/* Tablet portrait — wireframe grid, all images visible in one screen */
@media(min-width:768px) and (max-width:1024px) and (orientation:portrait){
  .showcase{
    min-height:calc(100dvh - var(--nav-h));
    max-height:calc(100dvh - var(--nav-h));
    padding:1rem 1.25rem 1rem;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    box-sizing:border-box;
  }
  .showcase .eye{
    margin-bottom:.35rem;
    font-size:10px;
  }
  .showcase .eye::before{width:20px}
  .showcase-hdr{
    flex-shrink:0;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    gap:.75rem;
    margin-bottom:.65rem;
  }
  .showcase-hdr .st{
    font-size:clamp(20px,3.2vw,26px);
    margin-bottom:0;
    line-height:1.15;
  }
  .showcase-hdr .st br{display:none}
  .showcase-cta{
    margin-top:0;
    padding:8px 14px;
    font-size:12px;
    white-space:nowrap;
  }
  .sc-grid{
    flex:1;
    min-height:0;
    display:grid;
    grid-template-columns:2fr 1fr;
    grid-template-areas:
      "lifestyle lifestyle"
      "campaign multipiece"
      "campaign product"
      "model model";
    grid-template-rows:minmax(0,0.95fr) minmax(0,1.05fr) minmax(0,1.05fr) minmax(0,0.85fr);
    gap:6px;
    width:100%;
  }
  .sc{
    width:100%;
    height:100%;
    min-height:0;
    border-radius:10px;
  }
  .sc-product{grid-area:lifestyle;aspect-ratio:unset}
  .sc-campaign{grid-area:campaign;aspect-ratio:unset;align-self:stretch}
  .sc-multipiece{grid-area:multipiece;aspect-ratio:unset}
  .sc-lifestyle{grid-area:product;aspect-ratio:unset}
  .sc-model{grid-area:model;aspect-ratio:unset}
  .sc-inner img{
    object-fit:contain;
    object-position:center;
  }
  .sc-lbl{
    bottom:6px;
    left:8px;
    font-size:9px;
    letter-spacing:.08em;
    padding:4px 8px;
    border-radius:5px;
    max-width:calc(100% - 16px);
  }
}

/* Small phones portrait */
@media(max-width:480px){
  section{padding:3rem 1rem}
  .showcase{padding:2.75rem .85rem}
  .og{grid-template-columns:1fr}
  .sc-grid{gap:10px}
  .pg{grid-template-columns:1fr}
  .cta{padding:4.5rem 1rem 4rem}
  .cta h2{font-size:clamp(28px,8vw,36px)}
  .note br{display:none}
  footer{padding:1.5rem 1rem;padding-bottom:max(1.5rem,env(safe-area-inset-bottom))}
}

/* Very narrow phones (e.g. 320px) */
@media(max-width:380px){
  .pill{padding:5px 10px;font-size:10px}
  h1{font-size:clamp(32px,10vw,44px)}
  .hero-sub{font-size:13px}
  .s-title{font-size:14px}
  .wt,.ctitle{font-size:20px}
}

/* Phone landscape — short viewport */
@media(max-height:520px) and (orientation:landscape){
  .splash-page{--nav-h:52px}
  .hero{min-height:auto;padding:1.75rem 5% 1.5rem}
  .hero-glow{width:90vw;height:50vh;top:0}
  h1{font-size:clamp(32px,6vh,48px);margin-bottom:.75rem}
  .hero-sub{margin-bottom:1.25rem;font-size:14px}
  .pill{margin-bottom:1rem}
  .actions{flex-direction:row;flex-wrap:wrap;max-width:100%}
  .btn-p,.btn-o{width:auto;flex:0 1 auto;min-height:44px;padding:10px 20px}
  .note{margin-top:.75rem}
  section{padding:2.5rem 5%}
  .showcase{padding:2.5rem 5%}
  .cta{padding:3rem 5% 2.5rem}
  .how-vis{display:none}
}

/* Phone landscape — very short (e.g. iPhone SE landscape) */
@media(max-height:420px) and (orientation:landscape){
  h1{font-size:clamp(28px,5.5vh,40px)}
  .actions{gap:8px}
}

/* Landscape with limited width (non-tablet phones) */
@media(max-width:768px) and (orientation:landscape){
  .og{grid-template-columns:repeat(3,1fr)}
  .wg{grid-template-columns:repeat(2,1fr)}
  .tg{grid-template-columns:repeat(2,1fr)}
}

/* Prefer reduced motion */
@media(prefers-reduced-motion:reduce){
  .dot{animation:none}
}
      
.price {
  text-align: center;
}

.pricing-title {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.price-simple-card {
  max-width: 560px;
  margin: 2.5rem auto 0;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  background: rgba(23, 22, 19, 0.92);
  border: 1px solid rgba(201, 168, 76, 0.28);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
  text-align: center;
}

.price-simple-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 1.25rem;
  border-radius: 18px;
  background: rgba(201, 168, 76, 0.09);
  border: 1px solid rgba(201, 168, 76, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-simple-card h3 {
  max-width: 430px;
  margin: 0 auto 0.85rem;
  color: var(--t1);
  font-size: clamp(1.45rem, 2.4vw, 2rem);
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.price-simple-card p {
  max-width: 440px;
  margin: 0 auto 1.6rem;
  color: var(--t3);
  font-size: 0.95rem;
  line-height: 1.7;
}

.price-simple-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #c9a84c, #f1d37a);
  color: #11100d;
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 14px 34px rgba(201, 168, 76, 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.price-simple-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(201, 168, 76, 0.28);
}

@media (max-width: 640px) {
  .price-simple-card {
    margin-top: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
    padding: 2rem 1.25rem;
    border-radius: 20px;
  }
  .price-simple-card h3{font-size:1.35rem}
  .price-simple-btn{width:100%;max-width:280px}
}

@media (max-width: 480px) {
  .price-simple-card {
    padding: 1.75rem 1rem;
  }
}

@media (max-height: 520px) and (orientation: landscape) {
  .price-simple-card {
    margin-top: 1.5rem;
    padding: 1.5rem 1.25rem;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 40px 60px;
  border-top: 1px solid rgba(201, 168, 93, 0.1);

  background: #0b0805;
}

/* LOGO */
.footer-logo {
  flex-shrink: 0;
}

.footer-logo img {
  width: 180px;
  height: auto;
  display: block;
}

/* COPYRIGHT */
.footer-center {
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
  text-align: center;
}

/* LINKS */
.flinks {
  display: flex;
  align-items: center;
  gap: 32px;

  list-style: none;
  margin: 0;
  padding: 0;
}

.flinks a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.25s ease;
}

.flinks a:hover {
  color: #d4af37;
}

@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    gap: 24px;

    text-align: center;
    padding: 32px 24px;
  }

  .footer-logo img {
    width: 140px;
  }

  .flinks {
    flex-wrap: wrap;
    justify-content: center;
    gap: 18px;
  }

  .footer-center {
    order: 3;
  }
}
      `}</style>

{/* HERO */}
<section className="hero">
  <div className="hero-glow"></div>
  <div className="pill"><span className="dot"></span>{hero.pill_text}</div>
  <h1 dangerouslySetInnerHTML={{ __html: hero.title_html }} />
  <p className="hero-sub">{hero.subtitle}</p>
  <div className="actions">
    <a href={hero.cta_secondary_href} className="btn-o">
      {hero.cta_secondary_text}
    </a>
    <a href={hero.cta_primary_href} className="btn-p">{hero.cta_primary_text}
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </a>
  </div>
  <p className="note">{hero.note}</p>
</section>

{/* TICKER */}
<div className="ticker" aria-label="Highlights">
  <div className="ticker-track">
    <div className="ticker-group">
      <TickerContent items={ticker} />
    </div>
    <div className="ticker-group" aria-hidden="true">
      <TickerContent items={ticker} />
    </div>
  </div>
</div>

{/* SHOWCASE */}
<div className="showcase" id="showcase">
  <div className="eye">{showcase.eye_label}</div>
  <div className="showcase-hdr">
    <div className="st" dangerouslySetInnerHTML={{ __html: showcase.title_html }} />
    <a href={showcase.cta_href} className="btn-o showcase-cta">{showcase.cta_text}</a>
  </div>
  <div className="sc-grid">
    {showcaseImages.map((img) => (
      <div key={img.id || img.src} className={`sc sc-${img.homepage_layout || "product"}`}>
        <div className="sc-inner">
          <img src={img.src || img.image_url} alt={img.alt || img.label || "Showcase image"} loading="lazy" />
        </div>
        <div className="sc-lbl">{img.label}</div>
      </div>
    ))}
  </div>
</div>

{/* HOW IT WORKS */}
<section className="how" id="how">
  <div className="eye">{how.eye_label}</div>
  <div className="how-lay">
    <div>
      <div className="st" dangerouslySetInnerHTML={{ __html: how.title_html }} />
      <div className="how-steps">
        {how.steps.map((step) => (
          <div className="step" key={step.number}>
            <div className="sn">{step.number}</div>
            <div>
              <div className="s-title">{step.title}</div>
              <div className="s-desc">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="how-vis">
      <div className="hv-inner">
        <div className="hv-icon">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><path d="M13 4v10M13 14l-4-4M13 14l4-4"/><rect x="4" y="18" width="18" height="5" rx="2"/></svg>
        </div>
        <div className="hv-lbl">{how.visual.label}</div>
        <div className="hv-title" dangerouslySetInnerHTML={{ __html: how.visual.title_html }} />
        <div className="thumb-row">
          <div className="thumb"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C9A84C" strokeWidth="1" opacity=".65"><circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="2.5"/></svg></div>
          <div className="thumb"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C9A84C" strokeWidth="1" opacity=".65"><path d="M5 4h10l2 4H3L5 4z"/><ellipse cx="10" cy="15" rx="6" ry="3"/></svg></div>
          <div className="thumb"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C9A84C" strokeWidth="1" opacity=".65"><rect x="5" y="5" width="10" height="10" rx="2"/><circle cx="10" cy="10" r="3"/></svg></div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* WHAT YOU CAN CREATE */}
<section className="output">
  <div className="eye">{output.eye_label}</div>
  <div className="st" dangerouslySetInnerHTML={{ __html: output.title_html }} />
  <div className="og">
    {output.items.map((item, index) => (
      <div className="oc" key={item.title}>
        <div className="oi">{OUTPUT_ICONS[index] || OUTPUT_ICONS[0]}</div>
        <div className="ot">{item.title}</div>
        <div className="od">{item.description}</div>
      </div>
    ))}
  </div>
</section>

{/* CAPABILITIES */}
<section className="cap">
  <div className="eye">{capabilities.eye_label}</div>
  <div className="st" dangerouslySetInnerHTML={{ __html: capabilities.title_html }} />
  <div className="cg">
    {capabilities.items.map((item) => (
      <div className={`cc${item.highlighted ? " hi" : ""}`} key={item.title}>
        <div className="ctag">{item.tag}</div>
        <div className="ctitle">{item.title}</div>
        <div className="cdesc">{item.description}</div>
        <div className="pills">
          {(item.pills || []).map((pill) => (
            <span className="pl g" key={pill}>{pill}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

{/* WHO USES SPLASH */}
<section className="who" id="who">
  <div className="eye">{who_uses.eye_label}</div>
  <div className="st" dangerouslySetInnerHTML={{ __html: who_uses.title_html }} />
  <div className="wg">
    {who_uses.items.map((item) => {
      const Icon = WHO_ICON_MAP[item.icon] || GemIcon;
      return (
        <div className="wc" key={item.title}>
          <div className="wi">
            <Icon className="wi-icon" />
          </div>
          <div className="wt">{item.title}</div>
          <div className="wd">{item.description}</div>
          <div className="pills">
            {(item.pills || []).map((pill) => (
              <span className="pl g" key={pill}>{pill}</span>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</section>

{/* TESTIMONIALS */}
<section className="test">
  <div className="eye">{testimonials.eye_label}</div>
  <div className="st" dangerouslySetInnerHTML={{ __html: testimonials.title_html }} />
  <div className="tg">
    {testimonials.items.map((item) => (
      <div className="tc" key={item.name}>
        <div className="stars"><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div></div>
        <div className="tq" dangerouslySetInnerHTML={{ __html: item.quote_html }} />
        <div className="ta">
          <div className="av">{item.initials}</div>
          <div>
            <div className="an">{item.name}</div>
            <div className="ar">{item.role}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* PRICING */}
<section className="price" id="pricing">
  <div className="eye">{pricing.eye_label}</div>
  <div className="st pricing-title" dangerouslySetInnerHTML={{ __html: pricing.title_html }} />
  <div className="price-simple-card">
    <div className="price-simple-icon">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    </div>
    <h2 className="price-simple-title text-xl font-bold">{pricing.card_title}</h2>
    <p>{pricing.card_description}</p>
    <a href={pricing.cta_href} className="price-simple-btn">
      {pricing.cta_text}
    </a>
  </div>
</section>

{/* CTA */}
<section className="cta">
  <div className="cta-glow"></div>
  <h2 dangerouslySetInnerHTML={{ __html: cta.title_html }} />
  <p className="cta-sub">{cta.subtitle}</p>
  <div className="cta-actions">
    <a href={cta.primary_href} className="btn-p">
      {cta.primary_text}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </a>
    <a href={cta.whatsapp_href} className="btn-wa" target="_blank" rel="noopener noreferrer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(37,211,102,0.85)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      {cta.whatsapp_text}
    </a>
  </div>
  <p className="cta-note">{cta.note}</p>
</section>

<footer className="footer">
  <div className="footer-logo">
    <img src={footer.logo_url} alt="Splash" />
  </div>
  <ul className="flinks">
    {footer.links.map((link) => (
      <li key={`${link.label}-${link.href}`}>
        <a href={link.href}>{link.label}</a>
      </li>
    ))}
  </ul>
  <div className="footer-center">
    {footer.copyright}
  </div>
</footer>
    </div>
  );
}
