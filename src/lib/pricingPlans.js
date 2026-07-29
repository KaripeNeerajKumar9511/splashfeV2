export const BILLING_PAGE = "/dashboard/my-account/billing";

const FEATURES = [
  "Premium AI image generation",
  "High-resolution downloads",
];

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Try Splash with complimentary credits — no card required.",
    price: 0,
    priceDisplay: "Free",
    currency: "INR",
    billingCycle: "month",
    credits: 10,
    imagesNote: "Create up to 5 new images.",
    features: [...FEATURES],
    featured: false,
    icon: "sparkles",
    cta: "Start Free",
    ctaVariant: "outline",
    ctaHref: "/signup",
  },
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small jewelry brands & startups.",
    price: 4999,
    priceUsd: 59,
    currency: "INR",
    billingCycle: "month",
    credits: 100,
    imagesNote: "Create up to 50 new images.",
    features: [...FEATURES, "Email support"],
    featured: false,
    icon: "diamond",
    cta: "Get Started",
    ctaVariant: "outline",
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing jewelry brands.",
    price: 13999,
    priceUsd: 169,
    currency: "INR",
    billingCycle: "month",
    credits: 300,
    imagesNote: "Create up to 150 new images.",
    features: [
      ...FEATURES,
      "Better value per credit",
      "Priority email support",
    ],
    featured: true,
    badge: "MOST POPULAR",
    icon: "trending-up",
    cta: "Get Started",
    ctaVariant: "solid",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Built for high-volume jewelry brands & agencies.",
    priceDisplay: "Custom",
    credits: "400+",
    creditsLabel: "Credits",
    imagesNote:
      "Custom credit allocation designed for high-volume image generation and agencies.",
    features: [
      ...FEATURES,
      "Lowest cost per credit",
      "Dedicated priority support",
    ],
    featured: false,
    icon: "crown",
    cta: "Contact Sales",
    ctaVariant: "outline",
    ctaHref: "/contact",
  },
];

export const PRICING_FOOTER_NOTE =
  "";

export function getPlanById(planId) {
  return PRICING_PLANS.find((p) => p.id === planId) || null;
}

export function formatPlanPrice(plan, currency = "INR") {
  if (plan.priceDisplay) return plan.priceDisplay;
  const code = String(currency || plan.currency || "INR").toUpperCase();
  if (code === "USD") {
    const usd = Number(plan.priceUsd ?? plan.price_usd ?? 0) || 0;
    return `$${usd.toLocaleString("en-US", {
      minimumFractionDigits: Number.isInteger(usd) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `₹${Number(plan.price || 0).toLocaleString("en-IN")}`;
}
