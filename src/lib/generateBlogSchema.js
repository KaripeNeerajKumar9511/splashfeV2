import { generateSchema } from "@/lib/schema/generateSchema";

export { normalizeFaqs } from "@/lib/schema/builders";

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
  const baseUrl = String(siteUrl || "").replace(/\/$/, "");

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
 * Blog listing / detail adapter around the shared generateSchema.
 * FAQ Question/Answer mapping lives only in buildFaqEntities.
 */
export function generateBlogSchema({
  mode,
  url,
  metadata = {},
  socialLinks = {},
  blogs = [],
  blog = null,
  siteUrl,
}) {
  const site = { origin: siteUrl, socialLinks };

  if (mode === "listing") {
    return generateSchema({
      type: "CollectionPage",
      url,
      name: metadata?.meta_title || metadata?.title || "Splash AI Studio Blog",
      description:
        metadata?.meta_description ||
        "Insights on AI jewellery photography, catalogue visuals, and brand marketing.",
      items: (blogs || []).map((item) => ({
        name: item?.title || item?.name,
        url: item?.url,
        description: item?.description,
      })),
      breadcrumbs: [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
      ],
      site,
    });
  }

  if (mode === "detail" && blog) {
    const pageUrl = blog.url || url;
    const title = blog.title || "";
    return generateSchema({
      type: "BlogPosting",
      url: pageUrl,
      name: title,
      description: blog.description,
      faqs: blog.faqs,
      blog: {
        ...blog,
        datePublished: blog.datePublished || new Date().toISOString(),
        dateModified: blog.dateModified || blog.datePublished || new Date().toISOString(),
      },
      metadata,
      breadcrumbs: [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: title || "Article", href: pageUrl },
      ],
      site,
    });
  }

  return null;
}

export function serializeBlogSchema(schema) {
  if (!schema) return null;
  if (Array.isArray(schema)) return schema.length ? schema : null;
  if (typeof schema === "object" && Object.keys(schema).length === 0) return null;
  return schema;
}
