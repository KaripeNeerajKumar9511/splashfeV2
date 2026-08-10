const STORAGE_KEY = "splash_pricing_currency_pref";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const PRICING_CURRENCIES = ["INR", "USD"];

export function normalizePricingCurrency(value) {
  const code = String(value || "").toUpperCase();
  return code === "INR" ? "INR" : "USD";
}

export function getStoredPricingCurrency() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return normalizePricingCurrency(stored);
  } catch {
    return null;
  }
}

export function setStoredPricingCurrency(currency) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, normalizePricingCurrency(currency));
  } catch {
    /* ignore quota / private mode */
  }
}

export async function fetchPricingGeo() {
  try {
    const res = await fetch(`${API_BASE}/api/plans/pricing/geo/`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("geo failed");
    const data = await res.json();
    const isIndia = Boolean(data?.is_india);
    return {
      currency: normalizePricingCurrency(data?.currency || (isIndia ? "INR" : "USD")),
      isIndia,
      countryCode: data?.country_code || null,
      fallback: Boolean(data?.fallback),
    };
  } catch {
    return {
      currency: "USD",
      isIndia: false,
      countryCode: null,
      fallback: true,
    };
  }
}

export async function fetchDefaultPricingCurrency() {
  const geo = await fetchPricingGeo();
  return geo.currency;
}

/**
 * Resolve initial currency for India vs non-India.
 * Non-India visitors are locked to USD (INR never shown / never applied).
 * India visitors: URL ?currency= > stored preference > geo default (INR).
 */
export async function resolveInitialPricingCurrency(searchParamsCurrency) {
  const geo = await fetchPricingGeo();
  if (!geo.isIndia) {
    setStoredPricingCurrency("USD");
    return { currency: "USD", isIndia: false };
  }

  if (searchParamsCurrency) {
    const fromUrl = normalizePricingCurrency(searchParamsCurrency);
    setStoredPricingCurrency(fromUrl);
    return { currency: fromUrl, isIndia: true };
  }

  const stored = getStoredPricingCurrency();
  if (stored) return { currency: stored, isIndia: true };

  return { currency: geo.currency || "INR", isIndia: true };
}

export function getPlanNumericPrice(plan, currency = "INR") {
  if (!plan) return 0;
  if (normalizePricingCurrency(currency) === "USD") {
    return Number(plan.priceUsd ?? plan.price_usd ?? 0) || 0;
  }
  return Number(plan.price ?? 0) || 0;
}

export function formatMoneyAmount(amount, currency = "INR") {
  const value = Number(amount) || 0;
  if (normalizePricingCurrency(currency) === "USD") {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}
