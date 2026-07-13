import { PRICING_PLANS, PRICING_FOOTER_NOTE, formatPlanPrice } from "@/lib/pricingPlans";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

let cachedPricing = null;
let cacheTime = 0;
const CACHE_MS = 60_000;

export function normalizePlanFromApi(plan) {
  const id = plan.id || plan.slug;
  const slug = String(id || "").toLowerCase();
  let rawIcon = String(plan.icon || "diamond").toLowerCase();
  if (slug === "free" && (!rawIcon || rawIcon === "diamond")) {
    rawIcon = "sparkles";
  }
  const icon = rawIcon === "growth" ? "trending-up" : rawIcon;

  return {
    id,
    slug: id,
    name: plan.name,
    description: plan.description || "",
    price: plan.price ?? null,
    priceDisplay: plan.priceDisplay,
    currency: plan.currency || "INR",
    billingCycle: plan.billingCycle || "month",
    credits: plan.credits,
    creditsNumeric: plan.creditsNumeric ?? plan.credits,
    creditsLabel: plan.creditsLabel || "Credits",
    imagesNote: plan.imagesNote || "",
    features: plan.features || [],
    featured: !!plan.featured,
    badge: plan.badge,
    icon,
    cta: plan.cta || "Get Started",
    ctaVariant: plan.ctaVariant || "outline",
    ctaHref: plan.ctaHref,
    razorpay_enabled: plan.razorpay_enabled !== false,
    db_id: plan.db_id,
  };
}

export async function fetchPricingData({ force = false } = {}) {
  const now = Date.now();
  if (!force && cachedPricing && now - cacheTime < CACHE_MS) {
    return cachedPricing;
  }

  try {
    const res = await fetch(`${API_BASE}/api/plans/pricing/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch pricing");
    const data = await res.json();
    if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
      const result = {
        plans: data.plans.map(normalizePlanFromApi),
        taxConfig: data.tax_config || null,
        footerNote: data.footer_note || PRICING_FOOTER_NOTE,
      };
      cachedPricing = result;
      cacheTime = now;
      return result;
    }
  } catch (e) {
    console.warn("Using static pricing fallback:", e);
  }

  return {
    plans: PRICING_PLANS,
    taxConfig: null,
    footerNote: PRICING_FOOTER_NOTE,
  };
}

export function getPlanFromList(plans, planId) {
  if (!plans?.length || !planId) return null;
  return plans.find((p) => p.id === planId || p.slug === planId) || null;
}

export function formatDynamicPlanPrice(plan) {
  if (plan.priceDisplay) return plan.priceDisplay;
  if (!plan.price && plan.price !== 0) return "Custom Pricing";
  const symbol = plan.currency === "INR" ? "₹" : "$";
  return `${symbol}${Number(plan.price).toLocaleString("en-IN")}`;
}

export function getPlanAmountDisplay(plan) {
  if (!plan) return "";
  if (plan.priceDisplay) return plan.priceDisplay;
  if (plan.price === 0 || plan.price == null) return "";
  if (plan.priceDisplay !== undefined || plan.db_id) {
    return formatDynamicPlanPrice(plan);
  }
  return formatPlanPrice(plan);
}

export function getPlanCreditsDisplay(plan) {
  if (!plan) return "";

  const credits = plan.credits ?? plan.creditsNumeric;
  if (credits == null || credits === "") return "";

  const creditsStr = String(credits);
  if (/credit/i.test(creditsStr)) return creditsStr;

  const label = plan.creditsLabel || "Credits";
  if (label === "Credits" || !label) return `${creditsStr} Credits`;
  if (creditsStr.includes("+") || label.includes("+")) return `${creditsStr} Credits`;
  return `${creditsStr} ${label}`;
}

export function shouldShowBillingCycle(plan) {
  if (!plan?.billingCycle) return false;
  if (plan.price === 0 || plan.price == null) return false;
  if (plan.priceDisplay && !plan.price) return false;
  return true;
}
