"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { apiService } from "@/lib/api";

const NAV_LINKS = [
  { label: "How it works", hash: "how" },
  { label: "Who it's for", hash: "who" },
  { label: "Pricing", href: "/pricing", hash: "pricing" },
];

const DROPDOWN_LIMIT = 10;

function NavDropdown({ label, href, items, mobile, onNavigate }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const allItems = items || [];
  const visible = allItems.slice(0, DROPDOWN_LIMIT);
  const showViewAll = allItems.length > DROPDOWN_LIMIT;

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  if (!visible.length) return null;

  if (mobile) {
    return (
      <div className="nav-dd-mobile">
        <button
          type="button"
          className="nav-dd-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {label}
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div className="nav-dd-mobile-list">
            {visible.map((item) => (
              <Link key={item.path} href={item.path} onClick={onNavigate}>
                {item.name}
              </Link>
            ))}
            {showViewAll ? (
              <Link href={href} onClick={onNavigate} className="nav-dd-all">
                View all
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="nav-dd"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="nav-dd-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="nav-dd-menu" role="menu" onMouseEnter={openMenu}>
          <div className="nav-dd-menu-inner">
            {visible.map((item) => (
              <Link key={item.path} href={item.path} role="menuitem" onClick={onNavigate}>
                {item.name}
              </Link>
            ))}
            {showViewAll ? (
              <Link href={href} className="nav-dd-all" onClick={onNavigate}>
                View all
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MarketingNav({ isHome = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [landingNav, setLandingNav] = useState({
    features: [],
    products: [],
    industries: [],
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const sectionHref = (link) => {
    if (link.href) return isHome ? `#${link.hash}` : link.href;
    return isHome ? `#${link.hash}` : `/#${link.hash}`;
  };

  useEffect(() => {
    let cancelled = false;
    apiService
      .getLandingNav()
      .then((data) => {
        if (!cancelled) setLandingNav(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
.marketing-nav .nav-r{display:flex;align-items:center;gap:1.1rem}
.marketing-nav .nav-r a,.marketing-nav .nav-dd-btn,.marketing-nav .nav-dd-toggle{font-size:13px;color:rgba(242,237,216,.58);text-decoration:none;transition:color .2s,background .2s;white-space:nowrap;background:none;border:0;cursor:pointer;font-family:var(--font-dm-sans),'DM Sans',sans-serif}
.marketing-nav .nav-r a:hover,.marketing-nav .nav-dd-btn:hover,.marketing-nav .nav-dd-toggle:hover{color:#F2EDD8}
.marketing-nav .nav-r a.btn-gold{display:inline-flex;align-items:center;justify-content:center;background:#C9A84C;color:#0E0D09;font-weight:500;padding:10px 22px;border-radius:6px;transition:opacity .2s,background .2s;white-space:nowrap}
.marketing-nav .nav-r a.btn-gold:hover{opacity:.88;color:#0E0D09;background:#C9A84C}
.marketing-nav .nav-toggle{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:.5px solid rgba(255,255,255,.07);border-radius:10px;background:#1E1C15;color:#F2EDD8;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.marketing-nav .nav-toggle svg{width:22px;height:22px}
.marketing-nav .nav-backdrop{display:none}
.nav-dd{position:relative}
.nav-dd-btn{display:inline-flex;align-items:center;gap:4px}
.nav-dd-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%);min-width:240px;padding-top:12px;z-index:120}
.nav-dd-menu-inner{max-height:min(70vh,420px);overflow-y:auto;background:#161410;border:.5px solid rgba(201,168,76,.22);border-radius:12px;padding:8px;box-shadow:0 18px 40px rgba(0,0,0,.35)}
.nav-dd-menu a{display:block;padding:10px 12px;border-radius:8px;white-space:normal;line-height:1.35}
.nav-dd-menu a:hover{background:rgba(201,168,76,.1);color:#F2EDD8}
.nav-dd-all{color:#C9A84C!important;font-weight:500}
.nav-dd-mobile{width:100%}
.nav-dd-toggle{display:flex;width:100%;align-items:center;justify-content:space-between;padding:14px 12px;border-bottom:.5px solid rgba(255,255,255,.07)}
.nav-dd-mobile-list{padding:0 8px 8px 16px}
.nav-dd-mobile-list a{display:block;padding:10px 12px;font-size:14px}
@media(max-width:768px){
  :root{--nav-h:56px}
  .marketing-nav .nav-toggle{display:flex}
  .marketing-nav .nav-backdrop{display:block;position:fixed;inset:0;top:var(--nav-h);background:rgba(14,13,9,.55);backdrop-filter:blur(4px);z-index:98;opacity:0;pointer-events:none;transition:opacity .25s}
  .marketing-nav .nav-backdrop.open{opacity:1;pointer-events:auto}
  .marketing-nav .nav-r{position:fixed;top:var(--nav-h);left:0;right:0;z-index:99;flex-direction:column;align-items:stretch;gap:0;padding:12px clamp(1rem,4vw,1.5rem) max(16px,env(safe-area-inset-bottom));background:rgba(22,20,16,.98);border-bottom:.5px solid rgba(255,255,255,.07);max-height:calc(100dvh - var(--nav-h));overflow-y:auto;transform:translateY(-8px);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}
  .marketing-nav .nav-r.open{opacity:1;pointer-events:auto;transform:translateY(0)}
  .marketing-nav .nav-r a{font-size:15px;padding:14px 12px;border-bottom:.5px solid rgba(255,255,255,.07);width:100%;white-space:normal}
  .marketing-nav .nav-r a:last-of-type{border-bottom:none}
  .marketing-nav .nav-r a.btn-gold{margin-top:8px;text-align:center;justify-content:center;display:flex;padding:14px 20px}
  .nav-dd-menu{display:none}
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
          inert={mobileNav && !menuOpen ? true : undefined}
        >
          <NavDropdown
            label="Features"
            href="/features"
            items={landingNav.features}
            mobile={mobileNav}
            onNavigate={closeMenu}
          />
          <NavDropdown
            label="Products"
            href="/products"
            items={landingNav.products}
            mobile={mobileNav}
            onNavigate={closeMenu}
          />
          <NavDropdown
            label="Industries"
            href="/industries"
            items={landingNav.industries}
            mobile={mobileNav}
            onNavigate={closeMenu}
          />
          {NAV_LINKS.map((link) => (
            <a key={link.hash || link.href} href={sectionHref(link)} onClick={closeMenu}>
              {link.label}
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
