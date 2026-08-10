const SPLASH_ORG_DEFAULTS = {
  name: "Splash AI Studio",
  siteUrl: "https://gosplash.ai",
  email: "support@gosplash.ai",
  phone: "+918790900881",
  logoPath: "/images/SplashLogoPNG.png",
  instagram: "https://www.instagram.com/splash_ai_studios/",
};

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeFaqs(faqs) {
  return (faqs ?? [])
    .map((faq) => {
      const question = String(faq?.question ?? faq?.q ?? "").trim();
      const rawAnswer = String(faq?.answer ?? faq?.a ?? "").trim();
      const answer = stripHtml(rawAnswer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);
}

function resolveLogoUrl(siteUrl, socialLinks) {
  const fromCms = socialLinks?.data?.header_logo || socialLinks?.logo_url;
  if (fromCms) {
    if (/^https?:\/\//i.test(fromCms)) return fromCms;
    const base = (process.env.NEXT_PUBLIC_SITE_URL || siteUrl || SPLASH_ORG_DEFAULTS.siteUrl).replace(
      /\/$/,
      ""
    );
    return `${base}${fromCms.startsWith("/") ? "" : "/"}${fromCms}`;
  }
  const base = (siteUrl || SPLASH_ORG_DEFAULTS.siteUrl).replace(/\/$/, "");
  return `${base}${SPLASH_ORG_DEFAULTS.logoPath}`;
}

function buildOrgSchema({ logoUrl, socialLinks, siteUrl }) {
  const orgUrl = (siteUrl || SPLASH_ORG_DEFAULTS.siteUrl).replace(/\/$/, "/");
  return {
    "@type": "Organization",
    name: socialLinks?.data?.org_name || SPLASH_ORG_DEFAULTS.name,
    url: orgUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    email: socialLinks?.data?.email || SPLASH_ORG_DEFAULTS.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: socialLinks?.data?.phone
          ? `+${String(socialLinks.data.phone).replace(/^\+/, "")}`
          : SPLASH_ORG_DEFAULTS.phone,
        contactType: "customer service",
        email: socialLinks?.data?.email || SPLASH_ORG_DEFAULTS.email,
      },
    ],
    sameAs: [
      socialLinks?.data?.instagram_url ||
        socialLinks?.data?.instagram ||
        SPLASH_ORG_DEFAULTS.instagram,
      socialLinks?.data?.facebook_url,
      socialLinks?.data?.youtube_url,
      socialLinks?.data?.twitter_url,
      socialLinks?.data?.linkedin_url,
    ].filter(Boolean),
  };
}

function buildFaqPageSchema(blogUrl, blogTitle, faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${blogUrl}${blogUrl.includes("#") ? "" : "#faq"}`,
    url: blogUrl,
    name: blogTitle ? `${blogTitle} FAQs` : "Blog FAQs",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildBlogDetailSchema({ url, metadata, blog, logoUrl, orgSchema, siteUrl }) {
  const blogUrl = blog?.url || url;
  const blogId = `${blogUrl}${blogUrl.includes("#") ? "" : "#blogposting"}`;
  const imageUrl = blog?.image || logoUrl;
  const keywordsSource =
    blog?.keywords ??
    (metadata?.meta_keyword
      ? String(metadata.meta_keyword)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined);

  const orgUrl = (siteUrl || SPLASH_ORG_DEFAULTS.siteUrl).replace(/\/$/, "/");

  const publisherSchema = (() => {
    const { email, ...orgRest } = orgSchema;
    void email;
    return {
      ...orgRest,
      "@id": `${orgUrl}#organization`,
      url: orgUrl,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
        width: 250,
        height: 60,
      },
      contactPoint: Array.isArray(orgSchema.contactPoint)
        ? orgSchema.contactPoint[0]
        : orgSchema.contactPoint,
    };
  })();

  const authorName = String(blog?.authorName ?? "").trim();
  const authorJobTitle = String(blog?.authorJobTitle ?? "").trim();
  const authorProfileUrl = String(blog?.authorProfileUrl ?? "").trim();
  const authorSameAs = (blog?.authorSameAs ?? [])
    .map((link) => String(link ?? "").trim())
    .filter(Boolean);

  const authorSchema = {
    "@type": "Person",
    name: authorName || "Splash Team",
    worksFor: {
      "@type": "Organization",
      name: SPLASH_ORG_DEFAULTS.name,
      url: orgUrl,
    },
  };

  if (authorJobTitle) authorSchema.jobTitle = authorJobTitle;
  if (authorProfileUrl) authorSchema.url = authorProfileUrl;
  if (authorSameAs.length > 0) authorSchema.sameAs = authorSameAs;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": blogId,
    headline: blog?.title || "",
    description: blog?.description || "",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 628,
    },
    datePublished: blog?.datePublished || new Date().toISOString(),
    dateModified: blog?.dateModified || blog?.datePublished || new Date().toISOString(),
    inLanguage: blog?.inLanguage ?? "en-IN",
    articleSection: blog?.articleSection ?? "Jewellery & AI Photography",
    ...(keywordsSource?.length ? { keywords: keywordsSource } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    author: authorSchema,
    publisher: publisherSchema,
  };

  const faqs = normalizeFaqs(blog?.faqs);
  if (faqs.length === 0) return blogPostingSchema;

  return [blogPostingSchema, buildFaqPageSchema(blogUrl, blog?.title || "", faqs)];
}

/**
 * Map a public blog API post to schema input.
 * @param {object} post
 * @param {string} slug
 * @param {string} siteUrl
 * @param {(path: string) => string | undefined} absoluteUrl
 */
export function mapApiPostToBlogBase(post, slug, siteUrl, absoluteUrl) {
  if (!post) return null;

  const pageSlug = post.slug || slug;
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    url: `${baseUrl}/blog/${encodeURIComponent(pageSlug)}`,
    title: post.meta_title || post.mete_title || post.title || "",
    description: post.meta_description || post.excerpt || post.short_content || "",
    image: absoluteUrl(post.image || post.image_url),
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    authorName: post.author || "Splash Team",
    authorJobTitle: post.author_job_title || post.authorJobTitle || undefined,
    authorProfileUrl: post.author_profile_url || post.authorProfileUrl || undefined,
    authorSameAs: post.author_same_as || post.authorSameAs || undefined,
    faqs: post.faqs,
    keywords: post.meta_keyword
      ? String(post.meta_keyword)
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined,
    inLanguage: post.in_language || post.inLanguage || "en-IN",
    articleSection: post.article_section || post.articleSection || "Jewellery & AI Photography",
  };
}

/**
 * @param {{
 *   mode: "listing" | "detail";
 *   url: string;
 *   metadata?: object;
 *   socialLinks?: object;
 *   blogs?: object[];
 *   blog?: object | null;
 *   siteUrl?: string;
 * }} options
 */
export function generateBlogSchema({
  mode,
  url,
  metadata = {},
  socialLinks = {},
  blogs = [],
  blog = null,
  siteUrl = SPLASH_ORG_DEFAULTS.siteUrl,
}) {
  const logoUrl = resolveLogoUrl(siteUrl, socialLinks);
  const orgSchema = buildOrgSchema({ logoUrl, socialLinks, siteUrl });

  if (mode === "listing") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url,
      name: metadata?.meta_title || metadata?.title || "Splash AI Studio Blog",
      description:
        metadata?.meta_description ||
        "Insights on AI jewellery photography, catalogue visuals, and brand marketing.",
      publisher: orgSchema,
      mainEntity: {
        "@type": "ItemList",
        itemListElement:
          blogs?.length > 0
            ? blogs.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: item?.url || "",
                name: item?.title || "",
                description: item?.description || "",
              }))
            : [],
      },
    };
  }

  if (mode === "detail" && blog) {
    return buildBlogDetailSchema({
      url,
      metadata,
      blog,
      logoUrl,
      orgSchema,
      siteUrl,
    });
  }

  return {};
}

/** Serialize schema for a JSON-LD script tag. */
export function serializeBlogSchema(schema) {
  if (!schema) return null;
  if (Array.isArray(schema)) {
    if (schema.length === 0) return null;
    return schema;
  }
  if (typeof schema === "object" && Object.keys(schema).length === 0) return null;
  return schema;
}
