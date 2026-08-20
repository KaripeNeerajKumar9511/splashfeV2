/**
 * @typedef {Object} SiteSchemaConfig
 * @property {string} name
 * @property {string} origin
 * @property {string} [logo]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string[]} [sameAs]
 * @property {string} [inLanguage]
 * @property {string} [searchTarget]
 */

/**
 * @typedef {{ question?: string, answer?: string, q?: string, a?: string }} FaqInput
 */

/**
 * @typedef {{ name: string, href: string }} BreadcrumbItem
 */

/**
 * @typedef {{ name?: string, url?: string, description?: string }} ListItemInput
 */

/**
 * @typedef {"WebPage"|"HomePage"|"FAQPage"|"FaqPage"|"LandingPage"|"CollectionPage"|"Article"|"BlogPosting"} SchemaType
 */

/**
 * @typedef {Object} GenerateSchemaInput
 * @property {SchemaType} type
 * @property {string} url
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [image]
 * @property {FaqInput[]} [faqs]
 * @property {BreadcrumbItem[]} [breadcrumbs]
 * @property {ListItemInput[]} [items]
 * @property {object} [blog]
 * @property {object} [metadata]
 * @property {Partial<SiteSchemaConfig>} [site]
 * @property {string} [inLanguage]
 */

export {};
