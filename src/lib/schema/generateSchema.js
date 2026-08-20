import { getSiteSchemaConfig } from "./siteConfig";
import {
  buildBlogPosting,
  buildBreadcrumbList,
  buildFaqPage,
  buildItemList,
  buildOrganization,
  buildWebPage,
  buildWebSite,
  omitEmpty,
} from "./builders";

function graph(nodes) {
  const list = nodes.map(omitEmpty).filter(Boolean);
  if (!list.length) return null;
  if (list.length === 1) {
    return { "@context": "https://schema.org", ...list[0] };
  }
  return { "@context": "https://schema.org", "@graph": list };
}

function normalizeType(type) {
  const value = String(type || "").trim();
  if (value === "FaqPage") return "FAQPage";
  if (value === "Article") return "BlogPosting";
  return value;
}

/**
 * Master JSON-LD entry. Pages pass a type; shared FAQ/Org/WebSite builders
 * are composed here so callers never remap Question/acceptedAnswer.
 *
 * @param {import("./types").GenerateSchemaInput} input
 */
export function generateSchema(input) {
  const type = normalizeType(input?.type);
  const url = String(input?.url || "").replace(/\/+$/, "") || input?.url;
  if (!type || !url) return null;

  const site = getSiteSchemaConfig({
    ...input.site,
    origin: input.site?.origin,
    inLanguage: input.inLanguage || input.site?.inLanguage,
  });
  const origin = site.origin;
  const org = buildOrganization(site);
  const website = buildWebSite(site);
  const publisherRef = { "@id": org["@id"] };
  const name = input.name || input.metadata?.meta_title || input.metadata?.title;
  const description = input.description || input.metadata?.meta_description;
  const faqs = input.faqs || input.blog?.faqs;
  const breadcrumbs = buildBreadcrumbList({
    url,
    items: input.breadcrumbs,
    origin,
  });

  let faqName = name;
  if (type !== "FAQPage" && name) faqName = `${name} FAQs`;

  const faqPage = buildFaqPage({
    url,
    name: faqName,
    description,
    faqs,
    publisher: publisherRef,
  });

  switch (type) {
    case "FAQPage":
      return graph([org, website, faqPage, breadcrumbs]);

    case "CollectionPage":
      return graph([
        org,
        website,
        omitEmpty({
          ...buildWebPage({ url, name, description, origin, type: "CollectionPage" }),
          mainEntity: buildItemList(input.items),
        }),
        breadcrumbs,
      ]);

    case "BlogPosting":
      return graph([
        org,
        website,
        buildBlogPosting({
          url,
          blog: input.blog,
          origin,
          image: input.image,
          inLanguage: site.inLanguage,
          organizationName: site.name,
        }),
        faqPage,
        breadcrumbs,
      ]);

    case "LandingPage":
    case "HomePage":
    case "WebPage":
    default:
      return graph([
        org,
        website,
        buildWebPage({ url, name, description, origin }),
        faqPage,
        breadcrumbs,
      ]);
  }
}
