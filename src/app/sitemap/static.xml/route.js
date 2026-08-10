import {
  STATIC_PAGES,
  absoluteLoc,
  buildUrlsetXml,
} from "@/lib/sitemap";
import {
  getSitemapBaseUrl,
  isSitemapDisabled,
  missingSitemapUrlResponse,
  sitemapDisabledResponse,
  xmlResponse,
} from "@/lib/sitemap/responses";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /sitemap/static.xml — hardcoded marketing / legal routes.
 * @returns {Response}
 */
export async function GET() {
  if (isSitemapDisabled()) {
    return sitemapDisabledResponse();
  }

  const base = getSitemapBaseUrl();
  if (!base) {
    return missingSitemapUrlResponse();
  }

  const lastmod = new Date().toISOString();
  const entries = STATIC_PAGES.map((path) => ({
    loc: absoluteLoc(base, path),
    lastmod,
  }));

  return xmlResponse(buildUrlsetXml(entries));
}
