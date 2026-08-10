import "server-only";

/**
 * Product sitemap source registry + static marketing routes.
 *
 * Backend contract (paginated JSON):
 *   GET {NEXT_PUBLIC_API_URL}{apiPath}?page={n}&limit={LIMIT}
 *   Response:
 *   {
 *     urls: Array<{ loc: string; lastmod?: string }>,
 *     current_page: number,
 *     last_page: number,
 *     total: number
 *   }
 *
 * Expected endpoints for this product (implement on the backend if missing):
 *   - GET /api/sitemap/blog
 */

/**
 * @type {import("./types").SitemapSource[]}
 */
export const SITEMAP_SOURCES = [
  {
    id: "blog",
    filePrefix: "blog",
    apiPath: "/api/sitemap/blog",
    enabled: true,
  },
];

/** Important public marketing / legal / app routes (paths only). */
export const STATIC_PAGES = [
  "/",
  "/about",
  "/pricing",
  "/contact",
  "/blog",
  "/gallery",
  "/faqs",
  "/privacy",
  "/terms",
  // "/cookies",
  "/security",
  // "/careers",
  // "/community",
  // "/tutorials",
  // "/help",
  // "/api-reference",
  "/vision-mision",
];

/** @returns {import("./types").SitemapSource[]} */
export function getEnabledSources() {
  return SITEMAP_SOURCES.filter((s) => s.enabled !== false);
}

/**
 * Longest filePrefix first so matching stays unambiguous.
 * @returns {import("./types").SitemapSource[]}
 */
export function getEnabledSourcesByPrefixLength() {
  return [...getEnabledSources()].sort(
    (a, b) => b.filePrefix.length - a.filePrefix.length
  );
}

/**
 * Parse a /sitemap/[segment] value against the registry.
 * Supports:
 *   - {filePrefix}{n}.xml  → paginated urlset
 *   - {filePrefix}.xml or {id}.xml → mini sitemap index for that source
 *
 * @param {string} segment
 * @returns {import("./types").SegmentMatch}
 */
export function matchSitemapSegment(segment) {
  if (!segment || typeof segment !== "string") return null;

  const normalized = segment.trim().toLowerCase();
  if (!normalized.endsWith(".xml")) return null;

  const sources = getEnabledSourcesByPrefixLength();

  for (const source of sources) {
    const prefix = source.filePrefix.toLowerCase();
    const pageRe = new RegExp(`^${escapeRegExp(prefix)}(\\d+)\\.xml$`, "i");
    const pageMatch = normalized.match(pageRe);
    if (pageMatch) {
      const page = Number.parseInt(pageMatch[1], 10);
      if (!Number.isFinite(page) || page < 1) return null;
      return { type: "page", source, page };
    }
  }

  for (const source of sources) {
    const prefix = source.filePrefix.toLowerCase();
    const id = source.id.toLowerCase();
    if (
      normalized === `${prefix}.xml` ||
      normalized === `${id}.xml`
    ) {
      return { type: "source-index", source };
    }
  }

  return null;
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
