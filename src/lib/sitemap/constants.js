import "server-only";

/** Default page size requested from backend sitemap APIs. */
export const SITEMAP_LIMIT = 1000;

/** Hard cap for last_page / page numbers. */
export const SITEMAP_MAX_PAGES = 50_000;

/** Default upstream fetch timeout (ms). Override with SITEMAP_FETCH_TIMEOUT_MS. */
export const SITEMAP_DEFAULT_TIMEOUT_MS = 30_000;

export const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

export const SITEMAP_XSL_HREF = "/sitemap.xsl";

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "no-store",
};

export const SITEMAP_PLAIN_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
};

export const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

export const XML_STYLESHEET_PI = `<?xml-stylesheet type="text/xsl" href="${SITEMAP_XSL_HREF}"?>`;
