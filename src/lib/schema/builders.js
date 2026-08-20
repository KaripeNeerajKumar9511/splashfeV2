import { toAbsoluteUrl } from "./siteConfig";

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function orgId(origin) {
  return `${origin}/#organization`;
}

function websiteId(origin) {
  return `${origin}/#website`;
}

/** Drop empty optional fields so JSON.stringify never writes undefined/"". */
export function omitEmpty(value) {
  if (value == null || value === "") return undefined;
  if (Array.isArray(value)) {
    const next = value.map(omitEmpty).filter((item) => item !== undefined);
    return next.length ? next : undefined;
  }
  if (typeof value === "object") {
    const next = {};
    for (const [key, nested] of Object.entries(value)) {
      const compact = omitEmpty(nested);
      if (compact !== undefined) next[key] = compact;
    }
    return Object.keys(next).length ? next : undefined;
  }
  return value;
}

export function normalizeFaqs(faqs) {
  return (faqs ?? [])
    .map((faq) => {
      const question = String(faq?.question ?? faq?.q ?? "").trim();
      const answer = stripHtml(faq?.answer ?? faq?.a ?? faq?.answerHtml ?? "");
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);
}

/**
 * @param {import("./types").SiteSchemaConfig} site
 */
export function buildOrganization(site) {
  const origin = site.origin;
  const node = {
    "@type": "Organization",
    "@id": orgId(origin),
    name: site.name,
    url: origin,
  };
  if (site.logo) {
    node.logo = { "@type": "ImageObject", url: site.logo };
  }
  if (site.email) node.email = site.email;
  if (site.phone || site.email) {
    node.contactPoint = [
      omitEmpty({
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.phone,
        email: site.email,
      }),
    ].filter(Boolean);
  }
  if (site.sameAs?.length) node.sameAs = site.sameAs;
  return omitEmpty(node);
}

/**
 * @param {import("./types").SiteSchemaConfig} site
 */
export function buildWebSite(site) {
  const origin = site.origin;
  const node = {
    "@type": "WebSite",
    "@id": websiteId(origin),
    name: site.name,
    url: origin,
    publisher: { "@id": orgId(origin) },
    inLanguage: site.inLanguage,
  };
  if (site.searchTarget) {
    node.potentialAction = {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: site.searchTarget },
      "query-input": "required name=search_term_string",
    };
  }
  return omitEmpty(node);
}

export function buildWebPage({ url, name, description, idSuffix, origin, type = "WebPage" }) {
  const node = {
    "@type": type,
    "@id": idSuffix ? `${url}#${idSuffix}` : url,
    url,
    name,
    description,
    isPartOf: origin ? { "@id": websiteId(origin) } : undefined,
    about: origin ? { "@id": orgId(origin) } : undefined,
  };
  return omitEmpty(node);
}

export function buildFaqEntities(faqs) {
  return normalizeFaqs(faqs).map((faq) =>
    omitEmpty({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })
  );
}

export function buildFaqPage({ url, name, description, faqs, publisher }) {
  const entities = buildFaqEntities(faqs);
  if (!entities.length) return null;
  return omitEmpty({
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    name,
    description,
    publisher,
    mainEntity: entities,
  });
}

export function buildBreadcrumbList({ url, items, origin }) {
  const crumbs = (items || [])
    .map((item) => {
      const name = String(item?.name || "").trim();
      const href = item?.href || item?.url || "";
      if (!name || !href) return null;
      return { name, item: toAbsoluteUrl(origin, href) };
    })
    .filter(Boolean);
  if (crumbs.length < 2) return null;
  return omitEmpty({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  });
}

export function buildPerson({ name, jobTitle, url, sameAs, worksFor }) {
  const personName = String(name || "").trim();
  if (!personName) return null;
  return omitEmpty({
    "@type": "Person",
    name: personName,
    jobTitle,
    url,
    sameAs: Array.isArray(sameAs) ? sameAs.filter(Boolean) : undefined,
    worksFor,
  });
}

export function buildItemList(items) {
  const list = (items || [])
    .map((item, index) => {
      const name = String(item?.name || item?.title || "").trim();
      const url = String(item?.url || item?.href || "").trim();
      if (!name && !url) return null;
      return omitEmpty({
        "@type": "ListItem",
        position: index + 1,
        url: url || undefined,
        name: name || undefined,
        description: item?.description || undefined,
      });
    })
    .filter(Boolean);
  if (!list.length) return null;
  return { "@type": "ItemList", itemListElement: list };
}

export function buildBlogPosting({ url, blog, origin, image, inLanguage, organizationName }) {
  if (!blog && !url) return null;
  const pageUrl = blog?.url || url;
  const imageUrl = blog?.image || image;
  const keywords = blog?.keywords;
  const authorSameAs = (blog?.authorSameAs || [])
    .map((link) => String(link ?? "").trim())
    .filter(Boolean);

  const author = buildPerson({
    name: blog?.authorName || "Splash Team",
    jobTitle: blog?.authorJobTitle,
    url: blog?.authorProfileUrl,
    sameAs: authorSameAs,
    worksFor: origin
      ? omitEmpty({
          "@type": "Organization",
          "@id": orgId(origin),
          name: organizationName,
          url: origin,
        })
      : undefined,
  });

  return omitEmpty({
    "@type": "BlogPosting",
    "@id": `${pageUrl}#blogposting`,
    headline: blog?.title || undefined,
    description: blog?.description || undefined,
    image: imageUrl
      ? { "@type": "ImageObject", url: imageUrl, width: 1200, height: 628 }
      : undefined,
    datePublished: blog?.datePublished,
    dateModified: blog?.dateModified || blog?.datePublished,
    inLanguage: blog?.inLanguage || inLanguage,
    articleSection: blog?.articleSection,
    keywords: keywords?.length ? keywords : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author,
    publisher: origin ? { "@id": orgId(origin) } : undefined,
  });
}
