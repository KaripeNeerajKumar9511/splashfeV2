import {
  absoluteLoc,
  buildSitemapIndexXml,
  fetchSitemapPage,
  getEnabledSources,
  normalizeLastPage,
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
 * GET /sitemap.xml — sitemap index (static + all dynamic pages).
 * @returns {Promise<Response>}
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
  /** @type {{ loc: string; lastmod: string }[]} */
  const entries = [
    {
      loc: absoluteLoc(base, "/sitemap/static.xml"),
      lastmod,
    },
  ];

  const sources = getEnabledSources();
  const results = await Promise.allSettled(
    sources.map((source) => fetchSitemapPage(source.apiPath, 1))
  );

  results.forEach((result, index) => {
    const source = sources[index];
    const payload =
      result.status === "fulfilled"
        ? result.value
        : { urls: [], last_page: 1, success: false };

    const lastPage = normalizeLastPage(payload.last_page);
    for (let page = 1; page <= lastPage; page += 1) {
      entries.push({
        loc: absoluteLoc(
          base,
          `/sitemap/${source.filePrefix}${page}.xml`
        ),
        lastmod,
      });
    }
  });

  return xmlResponse(buildSitemapIndexXml(entries));
}
