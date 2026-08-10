/**
 * @typedef {Object} SitemapUrlEntry
 * @property {string} loc
 * @property {string} [lastmod]
 */

/**
 * @typedef {Object} SitemapPageResult
 * @property {SitemapUrlEntry[]} urls
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} total
 * @property {boolean} success
 */

/**
 * @typedef {Object} SitemapSource
 * @property {string} id
 * @property {string} filePrefix
 * @property {string} apiPath
 * @property {boolean} [enabled]
 */

/**
 * @typedef {{ type: "page"; source: SitemapSource; page: number }
 *   | { type: "source-index"; source: SitemapSource }
 *   | null} SegmentMatch
 */

export {};
