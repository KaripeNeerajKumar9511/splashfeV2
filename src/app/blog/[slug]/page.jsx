import { notFound } from "next/navigation";
import BlogPostView from "./BlogPostView";
import BlogSchemaJsonLd from "./BlogSchemaJsonLd";
import { generateBlogSchema, mapApiPostToBlogBase } from "@/lib/generateBlogSchema";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://gosplash.ai"
).replace(/\/$/, "");

async function fetchBlogPost(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/homepage/blog/${encodeURIComponent(slug)}/`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.status === false) return null;
    return data?.post ?? data?.data?.post ?? null;
  } catch {
    return null;
  }
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  // Media files are served by the API origin, not the marketing site.
  if (path.startsWith("/media/")) {
    return `${API_BASE.replace(/\/$/, "")}${path}`;
  }
  return `${SITE_URL}${path}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) {
    return {
      title: "Page not found | Splash AI Studio",
      robots: { index: false, follow: false },
    };
  }

  const title = post.meta_title || post.mete_title || post.title || "Splash Blog";
  const description =
    post.meta_description ||
    post.excerpt ||
    post.short_content ||
    "Insights from Splash AI Studio";
  const image = absoluteUrl(post.image || post.image_url);
  const url = `${SITE_URL}/blog/${post.slug || slug}`;
  const keywords = post.meta_keyword
    ? String(post.meta_keyword)
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Splash AI Studio",
      locale: "en_US",
      images: image
        ? [
            {
              url: image,
              alt: post.title || title,
            },
          ]
        : undefined,
      publishedTime: post.created_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.author ? [post.author] : ["Splash Team"],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      "instagram:title": title,
      "instagram:description": description,
      ...(image ? { "instagram:image": image } : {}),
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const pageUrl = `${SITE_URL}/blog/${post.slug || slug}`;
  const blogBase = mapApiPostToBlogBase(post, slug, SITE_URL, absoluteUrl);
  const schema = generateBlogSchema({
    mode: "detail",
    url: pageUrl,
    metadata: post,
    blog: blogBase,
    siteUrl: SITE_URL,
  });

  return (
    <>
      <BlogSchemaJsonLd schema={schema} />
      <BlogPostView post={post} />
    </>
  );
}
