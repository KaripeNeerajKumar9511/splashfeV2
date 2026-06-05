"use client";

import React from "react";
import {
  GemIcon,
  StoreIcon,
  PaletteIcon,
  Share2Icon,
} from "lucide-react";
import MarketingNav from "@/components/home/MarketingNav";

const TICKER_ITEMS = [
  { strong: "Save up to 80%", span: "on photography costs" },
  { strong: "No prompts needed", span: "upload & generate" },
  { strong: "Understands jewelry", span: "metals, gems & styling" },
  { strong: "India-first", span: "built for the Indian jewelry market" },
];

function TickerContent() {
  return (
    <>
      {TICKER_ITEMS.map((item) => (
        <React.Fragment key={item.strong}>
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

export default function SplashLanding() {
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
.sc-lbl{position:absolute;bottom:12px;left:14px;z-index:2;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-l);background:rgba(14,13,9,.75);padding:4px 10px;border-radius:4px;pointer-events:none}
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
  .sc-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr) minmax(0,1fr);grid-template-rows:minmax(200px,1fr) minmax(160px,1fr);min-height:400px;gap:10px}
  .sc-product{grid-column:1;grid-row:1/3}
  .sc-campaign{grid-column:2;grid-row:1}
  .sc-lifestyle{grid-column:3;grid-row:1}
  .sc-model{grid-column:2;grid-row:2}
  .sc-multipiece{grid-column:3;grid-row:2}
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
}

/* Small phones portrait */
@media(max-width:480px){
  section{padding:3rem 1rem}
  .showcase{padding:3rem 1rem}
  .og{grid-template-columns:1fr}
  .sc-grid{grid-template-columns:1fr;gap:10px;min-height:0}
  .sc-product,.sc-campaign,.sc-lifestyle,.sc-model,.sc-multipiece{grid-column:1;grid-row:auto}
  .sc-product{min-height:380px}
  .sc-campaign,.sc-lifestyle,.sc-model,.sc-multipiece{min-height:200px}
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

/* Landscape with limited width */
@media(max-width:900px) and (orientation:landscape){
  .sc-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr) minmax(0,1fr);grid-template-rows:minmax(180px,1fr) minmax(140px,1fr);min-height:360px}
  .sc-product{grid-column:1;grid-row:1/3}
  .sc-campaign{grid-column:2;grid-row:1}
  .sc-lifestyle{grid-column:3;grid-row:1}
  .sc-model{grid-column:2;grid-row:2}
  .sc-multipiece{grid-column:3;grid-row:2}
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
  <div className="pill"><span className="dot"></span>Built exclusively for jewelry brands</div>
  <h1>Your jewelry.<br /><em>Studio-quality visuals.</em><br />No photographer needed.</h1>
  <p className="hero-sub">Upload a reference photo — or nothing at all. Splash understands jewelry and generates product shots, model imagery, and campaign visuals in minutes.</p>
  <div className="actions">
    <a href="/signup" className="btn-p">
      Start creating for free
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </a>
    <a href="#how" className="btn-o">See how it works</a>
  </div>
  <p className="note">No credit card required &nbsp;·&nbsp; No prompts needed &nbsp;·&nbsp; First images on us</p>
</section>

{/* TICKER */}
<div className="ticker" aria-label="Highlights">
  <div className="ticker-track">
    <div className="ticker-group">
      <TickerContent />
    </div>
    <div className="ticker-group" aria-hidden="true">
      <TickerContent />
    </div>
  </div>
</div>

{/* SHOWCASE */}
<div className="showcase" id="showcase">
  <div className="eye">Showcase</div>
  <div className="showcase-hdr">
    <div className="st">Created<br />with Splash</div>
    <a href="/login" className="btn-o showcase-cta">View all →</a>
  </div>
  <div className="sc-grid">
    <div className="sc sc-product">
      <div className="sc-inner">
        <img src="/images/lifestyle.webp" alt="Gold and emerald necklace product shot" loading="lazy" />
      </div>
      <div className="sc-lbl">Lifestyle setup</div>
    </div>
    <div className="sc sc-campaign">
      <div className="sc-inner">
        <img src="/images/campaign.webp" alt="Campaign visual with model wearing gold necklace" loading="lazy" />
      </div>
      <div className="sc-lbl">Campaign visual</div>
    </div>
    <div className="sc sc-lifestyle">
      <div className="sc-inner">
        <img src="/images/product.webp" alt="Lifestyle setup at a festive jewelry event" loading="lazy" />
      </div>
      <div className="sc-lbl">Product shot</div>
    </div>
    <div className="sc sc-model">
      <div className="sc-inner">
        <img src="/images/model.webp" alt="Model shot with gold chain necklace" loading="lazy" />
      </div>
      <div className="sc-lbl">Model shot</div>
    </div>
    <div className="sc sc-multipiece">
      <div className="sc-inner">
        <img src="/images/multipice.png" alt="Multi-piece gold earrings collection" loading="lazy" />
      </div>
      <div className="sc-lbl">Multi-piece</div>
    </div>
  </div>
</div>

{/* HOW IT WORKS */}
<section className="how" id="how">
  <div className="eye">How it works</div>
  <div className="how-lay">
    <div>
      <div className="st">Three steps to<br /><em>studio-perfect visuals</em></div>
      <div className="how-steps">
        <div className="step">
          <div className="sn">01</div>
          <div>
            <div className="s-title">Upload your jewelry piece</div>
            <div className="s-desc">Take a simple photo with your phone or use an existing product image. Or skip it entirely — Splash can generate beautiful visuals from scratch. It works brilliantly either way.</div>
          </div>
        </div>
        <div className="step">
          <div className="sn">02</div>
          <div>
            <div className="s-title">AI composes the scene</div>
            <div className="s-desc">Splash reads your jewelry's metal finish, gemstone type, and style — then generates a campaign-ready visual with the perfect lighting, backdrop, and composition. Share a reference image to match any mood.</div>
          </div>
        </div>
        <div className="step">
          <div className="sn">03</div>
          <div>
            <div className="s-title">Download &amp; publish</div>
            <div className="s-desc">Export in full resolution. Use it on your website, social media, ads, catalogues, or share directly with your team for review — all from one place.</div>
          </div>
        </div>
      </div>
    </div>
    <div className="how-vis">
      <div className="hv-inner">
        <div className="hv-icon">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><path d="M13 4v10M13 14l-4-4M13 14l4-4"/><rect x="4" y="18" width="18" height="5" rx="2"/></svg>
        </div>
        <div className="hv-lbl">One upload</div>
        <div className="hv-title">Multiple campaign-ready<br />outputs in seconds</div>
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
  <div className="eye">What you can create</div>
  <div className="st">Every visual<br /><em>your brand needs</em></div>
  <div className="og">
    <div className="oc">
      <div className="oi"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="5"/><circle cx="9" cy="9" r="2"/></svg></div>
      <div className="ot">Clean product shot</div>
      <div className="od">White or plain background. Perfect for websites, marketplaces, and catalogs.</div>
    </div>
    <div className="oc">
      <div className="oi"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><path d="M3 15 Q9 3 15 15"/><circle cx="9" cy="8" r="2"/></svg></div>
      <div className="ot">Campaign visual</div>
      <div className="od">Editorial, mood-driven imagery for ads, lookbooks, and seasonal campaigns.</div>
    </div>
    <div className="oc">
      <div className="oi"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="6" width="12" height="9" rx="2"/><path d="M6 6V5a3 3 0 016 0v1"/></svg></div>
      <div className="ot">Lifestyle setup</div>
      <div className="od">Themed scenes with props, textures, and environments that match your brand.</div>
    </div>
    <div className="oc">
      <div className="oi"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg></div>
      <div className="ot">Model shot</div>
      <div className="od">Jewelry worn on a model — up to 5 pieces styled together in a single image.</div>
    </div>
    <div className="oc">
      <div className="oi"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="4" height="9" rx="1"/><rect x="7" y="7" width="4" height="7" rx="1"/><rect x="12" y="6" width="4" height="8" rx="1"/></svg></div>
      <div className="ot">Bulk catalog</div>
      <div className="od">Generate dozens of consistent images across your full collection in one session.</div>
    </div>
  </div>
</section>

{/* CAPABILITIES */}
<section className="cap">
  <div className="eye">Capabilities</div>
  <div className="st">Built different.<br /><em>For jewelry.</em></div>
  <div className="cg">
    <div className="cc hi">
      <div className="ctag">No prompt required</div>
      <div className="ctitle">Generate without typing a single word</div>
      <div className="cdesc">Most AI tools require technical descriptions. Splash understands jewelry — metals, gemstones, silhouettes — and composes the perfect scene automatically. Just upload and go.</div>
      <div className="pills"><span className="pl g">White background</span><span className="pl g">Themed setups</span><span className="pl g">Auto-composed</span></div>
    </div>
    <div className="cc hi">
      <div className="ctag">Mood matching</div>
      <div className="ctitle">Share a reference. Get that exact feel.</div>
      <div className="cdesc">Upload any inspiration image — a campaign you love, a competitor's shoot, a mood board. Splash reads the lighting, backdrop, colour palette, and styling, then applies it to your piece.</div>
      <div className="pills"><span className="pl g">Reads lighting</span><span className="pl g">Matches colour tone</span><span className="pl g">Captures mood</span></div>
    </div>
    <div className="cc">
      <div className="ctag">Team collaboration</div>
      <div className="ctitle">Your whole team, one shared studio</div>
      <div className="cdesc">Invite designers, marketers, and your agency. Work inside shared projects, review outputs, and publish — no email chains, no file transfers.</div>
      <div className="pills"><span className="pl g">Shared projects</span><span className="pl g">Review &amp; comment</span><span className="pl g">Agency ready</span></div>
    </div>
    <div className="cc">
      <div className="ctag">Multi-piece generation</div>
      <div className="ctitle">Style up to 5 pieces in one image</div>
      <div className="cdesc">Create cohesive campaign shots featuring a full set — necklace, earrings, ring, bracelet — worn together on a model or arranged in a single scene.</div>
      <div className="pills"><span className="pl g">Up to 5 pieces</span><span className="pl g">Model shots</span><span className="pl g">Set styling</span></div>
    </div>
  </div>
</section>

{/* WHO USES SPLASH */}
<section className="who" id="who">
  <div className="eye">Who uses Splash</div>

  <div className="st">
    Built for everyone
    <br />
    <em>in the jewelry space</em>
  </div>

  <div className="wg">
    <div className="wc">
      <div className="wi">
        <GemIcon className="wi-icon" />
      </div>

      <div className="wt">D2C Jewelry Brands</div>

      <div className="wd">
        Stop spending ₹25,000–₹1,50,000 per photoshoot. Splash gives you
        studio-quality product images for your website, Instagram, and
        marketplace listings — at a fraction of the cost and in a fraction
        of the time.
      </div>

      <div className="pills">
        <span className="pl g">Product catalog</span>
        <span className="pl g">Instagram content</span>
        <span className="pl g">Marketplace listings</span>
        <span className="pl g">Campaign visuals</span>
      </div>
    </div>

    <div className="wc">
      <div className="wi">
        <StoreIcon className="wi-icon" />
      </div>

      <div className="wt">Traditional Jewelers Going Digital</div>

      <div className="wd">
        Upload one photo of your piece. Get stunning catalog images, ready
        to share on WhatsApp or your new website. No technical knowledge
        needed.
      </div>

      <div className="pills">
        <span className="pl g">WhatsApp catalog</span>
        <span className="pl g">Website gallery</span>
      </div>
    </div>

    <div className="wc">
      <div className="wi">
        <PaletteIcon className="wi-icon" />
      </div>

      <div className="wt">Creative Agencies</div>

      <div className="wd">
        Deliver more for your jewelry clients without adding headcount.
        Team collaboration, bulk generation, and white-label ready.
      </div>

      <div className="pills">
        <span className="pl g">Bulk delivery</span>
        <span className="pl g">Team projects</span>
      </div>
    </div>

    <div className="wc">
      <div className="wi">
        <Share2Icon className="wi-icon" />
      </div>

      <div className="wt">Social Media Managers</div>

      <div className="wd">
        Never run out of jewelry content again. Generate 30 days of social
        posts in one session with consistent styling.
      </div>

      <div className="pills">
        <span className="pl g">Content calendar</span>
        <span className="pl g">Reels & Stories</span>
      </div>
    </div>
  </div>
</section>

{/* TESTIMONIALS */}
<section className="test">
  <div className="eye">Stories</div>
  <div className="st">What jewelry brands<br /><em>are saying</em></div>
  <div className="tg">
    <div className="tc">
      <div className="stars"><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div></div>
      <div className="tq">"A single jewellery shoot used to cost us <strong>₹2 lakhs minimum</strong> — studio, photographer, stylist, editing. With Splash we generate the same campaign-quality imagery in minutes, at a fraction of that cost."</div>
      <div className="ta"><div className="av">TR</div><div><div className="an">Tarinika</div><div className="ar">Fine Jewellery Brand</div></div></div>
    </div>
    <div className="tc">
      <div className="stars"><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div></div>
      <div className="tq">"We were spending <strong>₹3.5 lakhs+ per shoot</strong> every season. Splash replaced our entire production workflow — we now launch collections faster, with more visual variations, and at a cost that actually makes sense."</div>
      <div className="ta"><div className="av">PK</div><div><div className="an">Paksha</div><div className="ar">Contemporary Jewellery Brand</div></div></div>
    </div>
    <div className="tc">
      <div className="stars"><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div></div>
      <div className="tq">"Our Diwali campaign had <strong>5 collections, 200+ images, generated in 2 days</strong>. Previously that would take 3 weeks and a full production crew costing ₹2 lakhs+. Splash is now our primary creative tool."</div>
      <div className="ta"><div className="av">SN</div><div><div className="an">Sneha Nair</div><div className="ar">Marketing Director</div></div></div>
    </div>
  </div>
</section>

{/* PRICING */}
<section className="price" id="pricing">
  <div className="eye">Pricing</div>

  <div className="st pricing-title">
    Need pricing details?
    <br />
    <em>Let’s talk.</em>
  </div>

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

    <h3>To get more details, please contact us</h3>

    <p>
      We’ll help you choose the right plan based on your image volume,
      team size, and business needs.
    </p>

    <a href="/contact" className="price-simple-btn">
      Contact Us
    </a>
  </div>
</section>

{/* CTA */}
<section className="cta">
  <div className="cta-glow"></div>
  <h2>Your next collection.<br /><em>Ready before the shoot<br />would've been booked.</em></h2>
  <p className="cta-sub">Start creating jewelry visuals today — your first images are on us.</p>

  <div className="cta-actions" >
    <a href="/signup" className="btn-p">
      Start creating for free
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </a>
    <a href="https://wa.me/91xxxxxxxxxx" className="btn-wa" target="_blank">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(37,211,102,0.85)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Chat on WhatsApp
    </a>
  </div>

  {/* <div className="cta-acts">
    <a href="/login" className="btn-p" style={{ fontSize: "15px", padding: "15px 34px" }}>
      Start creating for free
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </a>
    <a href="https://wa.me/91XXXXXXXXXX" className="btn-wa">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(37,211,102,0.85)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Chat on WhatsApp
    </a>
  </div> */}
  <p className="cta-note">No credit card · No prompts · Just your jewelry and Splash</p>
</section>

<footer className="footer">
  <div className="footer-logo">
    <img src="/images/SplashLogoPNG.png" alt="Splash" />
  </div>



  <ul className="flinks">
    <li>
      <a href="https://www.instagram.com/splash_ai_studios/">
        Instagram
      </a>
    </li>
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>

  <div className="footer-center">
    © 2025 Splash AI Studio
  </div>

</footer>
    </div>
  );
}
