"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How it works", hash: "how" },
  { label: "Who it's for", hash: "who" },
  { label: "Pricing", hash: "pricing" },
];

export default function MarketingNav({ isHome = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const sectionHref = (hash) => (isHome ? `#${hash}` : `/#${hash}`);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setMobileNav(mq.matches);
      if (!mq.matches) closeMenu();
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [closeMenu]);

  return (
    <>
      <style>{`
:root{--nav-h:64px}
.marketing-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:max(.75rem,env(safe-area-inset-top)) clamp(1rem,4vw,5%) .85rem;border-bottom:.5px solid rgba(255,255,255,.07);position:fixed;top:0;left:0;right:0;width:100%;background:rgba(14,13,9,.94);backdrop-filter:blur(16px);z-index:100;min-height:var(--nav-h)}
.marketing-nav .nav-logo{display:flex;align-items:center;flex-shrink:0;min-width:0;max-width:58%}
.marketing-nav .nav-logo img{height:clamp(36px,10vw,52px);width:auto;max-width:100%;object-fit:contain}
.marketing-nav .nav-r{display:flex;align-items:center;gap:1.75rem}
.marketing-nav .nav-r a{font-size:13px;color:rgba(242,237,216,.58);text-decoration:none;transition:color .2s,background .2s;white-space:nowrap}
.marketing-nav .nav-r a:hover{color:#F2EDD8}
.marketing-nav .btn-gold{background:#C9A84C;color:#0E0D09!important;font-weight:500!important;padding:10px 22px;border-radius:6px;transition:opacity .2s!important;white-space:nowrap}
.marketing-nav .btn-gold:hover{opacity:.88}
.marketing-nav .nav-toggle{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:.5px solid rgba(255,255,255,.07);border-radius:10px;background:#1E1C15;color:#F2EDD8;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.marketing-nav .nav-toggle svg{width:22px;height:22px}
.marketing-nav .nav-backdrop{display:none}
@media(max-width:768px){
  :root{--nav-h:56px}
  .marketing-nav .nav-toggle{display:flex}
  .marketing-nav .nav-backdrop{display:block;position:fixed;inset:0;top:var(--nav-h);background:rgba(14,13,9,.55);backdrop-filter:blur(4px);z-index:98;opacity:0;pointer-events:none;transition:opacity .25s}
  .marketing-nav .nav-backdrop.open{opacity:1;pointer-events:auto}
  .marketing-nav .nav-r{position:fixed;top:var(--nav-h);left:0;right:0;z-index:99;flex-direction:column;align-items:stretch;gap:0;padding:12px clamp(1rem,4vw,1.5rem) max(16px,env(safe-area-inset-bottom));background:rgba(22,20,16,.98);border-bottom:.5px solid rgba(255,255,255,.07);max-height:calc(100dvh - var(--nav-h));overflow-y:auto;transform:translateY(-8px);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}
  .marketing-nav .nav-r.open{opacity:1;pointer-events:auto;transform:translateY(0)}
  .marketing-nav .nav-r a{font-size:15px;padding:14px 12px;border-bottom:.5px solid rgba(255,255,255,.07);width:100%;white-space:normal}
  .marketing-nav .nav-r a:last-of-type{border-bottom:none}
  .marketing-nav .nav-r .btn-gold{margin-top:8px;text-align:center;justify-content:center;display:flex;padding:14px 20px}
}
@media(max-width:380px){
  .marketing-nav .nav-logo{max-width:52%}
}
@media(max-height:520px) and (orientation:landscape){
  :root{--nav-h:52px}
}
@media(prefers-reduced-motion:reduce){
  .marketing-nav .nav-r,.marketing-nav .nav-backdrop{transition:none}
}
      `}</style>

      <nav className="marketing-nav" aria-label="Main navigation">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <img src="/images/SplashLogoPNG.png" alt="Splash AI Studio" />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="marketing-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X strokeWidth={1.75} /> : <Menu strokeWidth={1.75} />}
        </button>

        <div
          className={`nav-backdrop ${menuOpen ? "open" : ""}`}
          aria-hidden={!menuOpen}
          onClick={closeMenu}
        />

        <div
          id="marketing-nav-menu"
          className={`nav-r ${menuOpen ? "open" : ""}`}
          aria-hidden={mobileNav && !menuOpen ? true : undefined}
          {...(mobileNav && !menuOpen ? { inert: "" } : {})}
        >
          {NAV_LINKS.map(({ label, hash }) => (
            <a key={hash} href={sectionHref(hash)} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <Link href="/signup" className="btn-gold" onClick={closeMenu}>
            Start free
          </Link>
        </div>
      </nav>
    </>
  );
}
