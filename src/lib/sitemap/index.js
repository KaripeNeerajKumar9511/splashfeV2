import "server-only";

export {
  SITEMAP_LIMIT,
  SITEMAP_MAX_PAGES,
  SITEMAP_NS,
  SITEMAP_XSL_HREF,
  SITEMAP_XML_HEADERS,
  SITEMAP_PLAIN_HEADERS,
  XML_DECLARATION,
  XML_STYLESHEET_PI,
} from "./constants";

export {
  SITEMAP_SOURCES,
  STATIC_PAGES,
  getEnabledSources,
  getEnabledSourcesByPrefixLength,
  matchSitemapSegment,
} from "./sources";

export { fetchSitemapPage } from "./fetch";

export {
  escapeXml,
  normalizeLastPage,
  normalizePageNumber,
  normalizeUrlEntries,
  absoluteLoc,
  buildUrlsetXml,
  buildSitemapIndexXml,
  getFetchTimeoutMs,
} from "./xml";

export {
  isSitemapDisabled,
  getSitemapBaseUrl,
  sitemapDisabledResponse,
  missingSitemapUrlResponse,
  plainNotFoundResponse,
  xmlResponse,
} from "./responses";