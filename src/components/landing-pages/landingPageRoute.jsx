import { notFound } from "next/navigation";
import DynamicLandingPage from "@/components/landing-pages/DynamicLandingPage";
import JsonLd from "@/lib/schema/JsonLd";
import { generateSchema } from "@/lib/schema/generateSchema";
import {
  absoluteApiUrl,
  fetchLandingPage,
  LANDING_TYPE_META,
} from "@/lib/landingPages";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_URL ||
  "https://www.gosplash.ai"
).replace(/\/$/, "");

export function landingMetadata(page, typePath, slug) {
  if (!page) {
    return {
      title: "Page not found | Splash AI Studio",
      robots: { index: false, follow: false },
    };
  }
  const title = `${page.name} | Splash AI Studio`;
  const description = page.seo_description || page.hero?.tagline || "";
  const image = absoluteApiUrl(page.hero?.image);
  const url = `${SITE_URL}${page.path || `/${typePath}/${slug}`}`;
  const indexable = page.indexable !== false && page.status === "Published" && !page.is_preview;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Splash AI Studio",
      locale: "en_US",
      images: image ? [{ url: image, alt: page.hero?.title || page.name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateLandingMetadata(typePath, params, searchParams) {
  const { slug } = await params;
  const preview = (await searchParams)?.preview;
  const page = await fetchLandingPage(typePath, slug, preview);
  return landingMetadata(page, typePath, slug);
}

export async function renderLandingPage(typePath, params, searchParams) {
  if (!LANDING_TYPE_META[typePath]) notFound();
  const { slug } = await params;
  const preview = (await searchParams)?.preview;
  const page = await fetchLandingPage(typePath, slug, preview);
  if (!page) notFound();

  const path = page.path || `/${typePath}/${slug}`;
  const url = `${SITE_URL}${path}`;
  const meta = LANDING_TYPE_META[typePath];
  const schema = generateSchema({
    type: "LandingPage",
    url,
    name: page.name,
    description: page.seo_description || page.hero?.tagline || "",
    faqs: page.faqs,
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: meta?.label || typePath, href: `/${typePath}` },
      { name: page.name, href: path },
    ],
    site: { origin: SITE_URL },
  });

  return (
    <>
      <JsonLd schema={schema} />
      <DynamicLandingPage page={page} />
    </>
  );
}
