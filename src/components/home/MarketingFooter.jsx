"use client";

import { useEffect, useMemo, useState } from "react";
import { apiService } from "@/lib/api";
import {
  HOME_PAGE_DEFAULTS,
  ORIGINAL_FOOTER_DEFAULTS,
  resolveHomeContent,
} from "@/lib/pageContentDefaults";

export default function MarketingFooter({ footer: footerProp } = {}) {
  const [pageContent, setPageContent] = useState(HOME_PAGE_DEFAULTS);

  useEffect(() => {
    if (footerProp) return;
    apiService
      .getPageContent("home")
      .then((data) => setPageContent(data || {}))
      .catch(() => setPageContent({}));
  }, [footerProp]);

  const footer = useMemo(() => {
    if (footerProp?.link_rows?.length) return footerProp;
    return resolveHomeContent(pageContent).footer || ORIGINAL_FOOTER_DEFAULTS;
  }, [footerProp, pageContent]);

  return (
    <>
      <style>{`
.mkt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 60px;
  border-top: 1px solid rgba(201, 168, 93, 0.1);
  background: #0b0805;
  width: 100%;
  box-sizing: border-box;
}
.mkt-footer-logo {
  flex-shrink: 0;
}
.mkt-footer-logo img {
  width: 180px;
  height: auto;
  display: block;
}
.mkt-footer-copy {
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  font-family: 'DM Sans', sans-serif;
  flex-shrink: 0;
}
.mkt-footer-copy em {
  font-style: italic;
  color: #E8D08A;
}
.mkt-flinks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}
.mkt-flinks-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.mkt-flinks-row a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: color 0.25s ease;
  white-space: nowrap;
}
.mkt-flinks-row a em {
  font-style: italic;
  color: #E8D08A;
}
.mkt-flinks-row a:hover {
  color: #d4af37;
}
@media (max-width: 768px) {
  .mkt-footer {
    flex-direction: column;
    gap: 24px;
    text-align: center;
    padding: 32px 24px;
    padding-bottom: max(32px, env(safe-area-inset-bottom));
  }
  .mkt-footer-logo img {
    width: 140px;
  }
  .mkt-flinks {
    width: 100%;
    gap: 12px;
  }
  .mkt-flinks-row {
    gap: 16px 20px;
  }
  .mkt-footer-copy {
    order: 3;
  }
}
      `}</style>
      <footer className="mkt-footer">
        <div className="mkt-footer-logo">
          <img src={footer.logo_url} alt="Splash" />
        </div>
        <nav className="mkt-flinks" aria-label="Footer">
          {(footer.link_rows || ORIGINAL_FOOTER_DEFAULTS.link_rows).map((row, rowIndex) => (
            <ul className="mkt-flinks-row" key={`mkt-footer-row-${rowIndex}`}>
              {row.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    {...(String(link.href).startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                </li>
              ))}
            </ul>
          ))}
        </nav>
        <div
          className="mkt-footer-copy"
          dangerouslySetInnerHTML={{ __html: footer.copyright }}
        />
      </footer>
    </>
  );
}
