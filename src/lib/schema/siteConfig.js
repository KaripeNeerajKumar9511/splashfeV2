/**
 * Site identity for JSON-LD. Values come from env and existing repo defaults
 * (generateBlogSchema / contact page / footer). Pages may override `origin`.
 */

const EXISTING_DEFAULTS = {
  name: "Splash AI Studio",
  siteUrl: "https://gosplash.ai",
  email: "support@gosplash.ai",
  phone: "+918790900881",
  logoPath: "/images/SplashLogoPNG.png",
  instagram: "https://www.instagram.com/splash_ai_studios/",
  inLanguage: "en-IN",
};

function stripSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function absUrl(origin, pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = stripSlash(origin);
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function getPublicSiteOrigin(override) {
  return stripSlash(
    override ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_URL ||
      EXISTING_DEFAULTS.siteUrl
  );
}

/**
 * @param {Partial<import("./types").SiteSchemaConfig> & { socialLinks?: object, logoPath?: string }} [overrides]
 * @returns {import("./types").SiteSchemaConfig}
 */
export function getSiteSchemaConfig(overrides = {}) {
  const origin = getPublicSiteOrigin(overrides.origin);
  const social = overrides.socialLinks?.data || {};
  const logoFromCms = social.header_logo || overrides.socialLinks?.logo_url || overrides.logo;
  const logo = logoFromCms
    ? absUrl(origin, logoFromCms)
    : absUrl(origin, overrides.logoPath || EXISTING_DEFAULTS.logoPath);

  const phoneRaw = social.phone || overrides.phone || EXISTING_DEFAULTS.phone;
  const phone = phoneRaw ? `+${String(phoneRaw).replace(/^\+/, "").replace(/\s+/g, "")}` : undefined;

  const sameAs = (
    overrides.sameAs || [
      social.instagram_url || social.instagram || EXISTING_DEFAULTS.instagram,
      social.facebook_url,
      social.youtube_url,
      social.twitter_url,
      social.linkedin_url,
    ]
  )
    .map((link) => String(link || "").trim())
    .filter(Boolean);

  return {
    name: social.org_name || overrides.name || EXISTING_DEFAULTS.name,
    origin,
    logo,
    email: social.email || overrides.email || EXISTING_DEFAULTS.email,
    phone,
    sameAs,
    inLanguage: overrides.inLanguage || EXISTING_DEFAULTS.inLanguage,
    searchTarget: overrides.searchTarget,
  };
}

export function toAbsoluteUrl(origin, href) {
  if (!href) return origin;
  return absUrl(origin, href);
}

export { EXISTING_DEFAULTS as SITE_SCHEMA_DEFAULTS };
