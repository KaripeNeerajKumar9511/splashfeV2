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

export async function fetchDefaultPricingCurrency() {
  try {
    const res = await fetch(`${API_BASE}/api/plans/pricing/geo/`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("geo failed");
    const data = await res.json();
    return normalizePricingCurrency(data?.currency || "USD");
  } catch {
    return "USD";
  }
}

/**
 * Resolve initial currency: URL ?currency= > manual preference > geo API (fallback USD).
 * Geo results are not persisted — only explicit user toggles / URL params are.
 */
export async function resolveInitialPricingCurrency(searchParamsCurrency) {
  if (searchParamsCurrency) {
    const fromUrl = normalizePricingCurrency(searchParamsCurrency);
    setStoredPricingCurrency(fromUrl);
    return fromUrl;
  }
  const stored = getStoredPricingCurrency();
  if (stored) return stored;
  return fetchDefaultPricingCurrency();
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
