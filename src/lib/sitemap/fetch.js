import "server-only";

import { SITEMAP_LIMIT } from "./constants";
import {
  getFetchTimeoutMs,
  normalizeLastPage,
  normalizeUrlEntries,
} from "./xml";

/**
 * Safe empty / failure payload — never throws to callers.
 * @returns {import("./types").SitemapPageResult}
 */
function emptyResult(page = 1) {
  return {
    urls: [],
    current_page: page,
    last_page: 1,
    total: 0,
    success: false,
  };
}

/**
 * Fetch one paginated sitemap page from the backend.
 * Never throws — timeouts/errors return a safe fallback.
 *
 * @param {string} apiPath
 * @param {number} [page=1]
 * @param {{ limit?: number }} [options]
 * @returns {Promise<import("./types").SitemapPageResult>}
 */
export async function fetchSitemapPage(apiPath, page = 1, options = {}) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!apiBase) {
    console.error("[sitemap] NEXT_PUBLIC_API_URL is not set");
    return emptyResult(page);
  }

  const limit = options.limit ?? SITEMAP_LIMIT;
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const url = `${apiBase}${path}?page=${encodeURIComponent(String(page))}&limit=${encodeURIComponent(String(limit))}`;
  const timeoutMs = getFetchTimeoutMs();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      console.error(
        `[sitemap] Upstream ${res.status} for ${url}`
      );
      return emptyResult(page);
    }

    const data = await res.json();
    const urls = normalizeUrlEntries(data?.urls);
    const currentPage = Number.isFinite(Number(data?.current_page))
      ? Math.max(1, Math.floor(Number(data.current_page)))
      : page;
    const lastPage = normalizeLastPage(data?.last_page);
    const total = Number.isFinite(Number(data?.total))
      ? Math.max(0, Math.floor(Number(data.total)))
      : urls.length;

    return {
      urls,
      current_page: currentPage,
      last_page: lastPage,
      total,
      success: true,
    };
  } catch (err) {
    const name = err && typeof err === "object" && "name" in err ? err.name : "";
    const isTimeout =
      name === "TimeoutError" ||
      name === "AbortError" ||
      (err instanceof Error && /timeout|aborted/i.test(err.message));

    if (isTimeout) {
      console.warn(`[sitemap] Timeout fetching ${url} (${timeoutMs}ms)`);
    } else {
      console.error(`[sitemap] Failed fetching ${url}`, err);
    }

    return emptyResult(page);
  }
}
