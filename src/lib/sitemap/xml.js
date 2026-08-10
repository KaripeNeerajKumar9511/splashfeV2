import "server-only";

import {
  SITEMAP_DEFAULT_TIMEOUT_MS,
  SITEMAP_LIMIT,
  SITEMAP_MAX_PAGES,
  XML_DECLARATION,
  XML_STYLESHEET_PI,
  SITEMAP_NS,
} from "./constants";

/** @param {string} value */
export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Normalize last_page from upstream (finite, ≥ 1, hard-capped).
 * @param {unknown} value
 * @returns {number}
 */
export function normalizeLastPage(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(Math.floor(n), SITEMAP_MAX_PAGES);
}

/**
 * Cap a requested page number.
 * @param {unknown} value
 * @returns {number | null} null if invalid
 */
export function normalizePageNumber(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return null;
  const page = Math.floor(n);
  if (page > SITEMAP_MAX_PAGES) return null;
  return page;
}

/**
 * @param {unknown} rawUrls
 * @returns {{ loc: string; lastmod: string }[]}
 */
export function normalizeUrlEntries(rawUrls) {
  if (!Array.isArray(rawUrls)) return [];

  const fallbackLastmod = new Date().toISOString();
  /** @type {Map<string, { loc: string; lastmod: string }>} */
  const byLoc = new Map();

  for (const item of rawUrls) {
    if (!item || typeof item !== "object") continue;
    const locRaw = "loc" in item ? item.loc : null;
    if (typeof locRaw !== "string") continue;
    const loc = locRaw.trim();
    if (!loc) continue;

    const key = loc.toLowerCase();
    if (byLoc.has(key)) continue;

    const lastmodRaw =
      "lastmod" in item && typeof item.lastmod === "string"
        ? item.lastmod.trim()
        : "";
    byLoc.set(key, {
      loc,
      lastmod: lastmodRaw || fallbackLastmod,
    });
  }

  return [...byLoc.values()];
}

/**
 * Build absolute loc from site origin + path.
 * @param {string} baseUrl
 * @param {string} path
 */
export function absoluteLoc(baseUrl, path) {
  const base = String(baseUrl).replace(/\/+$/, "");
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * @param {{ loc: string; lastmod?: string }[]} entries
 * @returns {string}
 */
export function buildUrlsetXml(entries) {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod || new Date().toISOString();
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    XML_DECLARATION,
    XML_STYLESHEET_PI,
    `<urlset xmlns="${SITEMAP_NS}">`,
    body,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * @param {{ loc: string; lastmod?: string }[]} entries
 * @returns {string}
 */
export function buildSitemapIndexXml(entries) {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod || new Date().toISOString();
      return [
        "  <sitemap>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        "  </sitemap>",
      ].join("\n");
    })
    .join("\n");

  return [
    XML_DECLARATION,
    XML_STYLESHEET_PI,
    `<sitemapindex xmlns="${SITEMAP_NS}">`,
    body,
    "</sitemapindex>",
    "",
  ].join("\n");
}

/**
 * @returns {number}
 */
export function getFetchTimeoutMs() {
  const raw = process.env.SITEMAP_FETCH_TIMEOUT_MS;
  if (!raw) return SITEMAP_DEFAULT_TIMEOUT_MS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return SITEMAP_DEFAULT_TIMEOUT_MS;
  return n;
}

export { SITEMAP_LIMIT };
