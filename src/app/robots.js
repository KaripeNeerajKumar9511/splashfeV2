/**
 * @returns {import("next").MetadataRoute.Robots}
 */
export default function robots() {
  const disabled = process.env.NEXT_DISABLE_SITEMAP === "1";
  const siteOrigin = (
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXT_SITEMAP_URL ||
    "https://www.gosplash.ai"
  ).replace(/\/+$/, "");

  /** @type {import("next").MetadataRoute.Robots} */
  const config = {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/settings/",
          "/account/",
          "/login/",
          "/signup/",
          "/auth/",
          "/checkout/",
          "/billing/",
          "/profile/",
          "/complete-profile/",
          "/forgot-password/",
          "/reset-password/",
          "/_next/",
          "/tmp/",
        ],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "ImagesiftBot", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "PetalBot", allow: "/" },
    ],
  };

  if (!disabled) {
    config.sitemap = `${siteOrigin}/sitemap.xml`;
  }

  return config;
}
