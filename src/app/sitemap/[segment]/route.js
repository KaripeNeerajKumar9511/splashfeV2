import {
  absoluteLoc,
  buildSitemapIndexXml,
  buildUrlsetXml,
  fetchSitemapPage,
  matchSitemapSegment,
  normalizeLastPage,
  normalizePageNumber,
} from "@/lib/sitemap";
import {
  getSitemapBaseUrl,
  isSitemapDisabled,
  missingSitemapUrlResponse,
  plainNotFoundResponse,
  sitemapDisabledResponse,
  xmlResponse,
} from "@/lib/sitemap/responses";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /sitemap/[segment]
 * - {filePrefix}{n}.xml → paginated urlset
 * - {filePrefix}.xml / {id}.xml → mini index for that source
 *
 * @param {Request} _request
 * @param {{ params: Promise<{ segment: string }> }} context
 * @returns {Promise<Response>}
 */
export async function GET(_request, context) {
  if (isSitemapDisabled()) {
    return sitemapDisabledResponse();
  }

  const base = getSitemapBaseUrl();
  if (!base) {
    return missingSitemapUrlResponse();
  }

  const { segment } = await context.params;
  const match = matchSitemapSegment(segment);

  if (!match) {
    return plainNotFoundResponse();
  }

  if (match.type === "source-index") {
    const pageResult = await fetchSitemapPage(match.source.apiPath, 1);
    const lastPage = normalizeLastPage(pageResult.last_page);
    const lastmod = new Date().toISOString();
    const entries = [];

    for (let page = 1; page <= lastPage; page += 1) {
      entries.push({
        loc: absoluteLoc(
          base,
          `/sitemap/${match.source.filePrefix}${page}.xml`
        ),
        lastmod,
      });
    }

    return xmlResponse(buildSitemapIndexXml(entries));
  }

  const page = normalizePageNumber(match.page);
  if (page === null) {
    return plainNotFoundResponse();
  }

  const pageResult = await fetchSitemapPage(match.source.apiPath, page);
  // Upstream failure with empty urls → still 200 empty urlset
  return xmlResponse(buildUrlsetXml(pageResult.urls));
}
