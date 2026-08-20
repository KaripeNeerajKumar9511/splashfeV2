const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export const LANDING_TYPE_META = {
  features: {
    type: "FEATURE",
    label: "Features",
    eyebrow: "Features",
    title: "Splash AI Studio Features",
    subtitle: "Explore the capabilities behind studio-quality jewellery photography.",
  },
  products: {
    type: "PRODUCT",
    label: "Products",
    eyebrow: "Products",
    title: "Product Photography",
    subtitle: "Studio-quality visuals for every jewellery product, generated with AI.",
  },
  industries: {
    type: "INDUSTRY",
    label: "Industries",
    eyebrow: "Industries",
    title: "Industry Solutions",
    subtitle: "Premium visual production tailored to jewellery and related industries.",
  },
};

export function absoluteApiUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  if (path.startsWith("/media/")) {
    return `${API_BASE}${path}`;
  }
  return path;
}

async function readJson(res) {
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLandingNav() {
  try {
    const res = await fetch(`${API_BASE}/api/homepage/landing-pages/nav/`, { cache: "no-store" });
    const data = await readJson(res);
    return {
      features: data?.features || [],
      products: data?.products || [],
      industries: data?.industries || [],
    };
  } catch {
    return { features: [], products: [], industries: [] };
  }
}

export async function fetchLandingPages(typePath) {
  try {
    const res = await fetch(
      `${API_BASE}/api/homepage/landing-pages/${encodeURIComponent(typePath)}/`,
      { cache: "no-store" }
    );
    const data = await readJson(res);
    return Array.isArray(data?.pages) ? data.pages : [];
  } catch {
    return [];
  }
}

export async function fetchLandingPage(typePath, slug, preview) {
  try {
    const qs = preview ? `?preview=${encodeURIComponent(preview)}` : "";
    const res = await fetch(
      `${API_BASE}/api/homepage/landing-pages/${encodeURIComponent(typePath)}/${encodeURIComponent(slug)}/${qs}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    const data = await readJson(res);
    if (data?.status === false) return null;
    return data?.page ?? null;
  } catch {
    return null;
  }
}
