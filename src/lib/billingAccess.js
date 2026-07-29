import { BILLING_PAGE } from "@/lib/pricingPlans";
import { normalizePricingCurrency } from "@/lib/pricingCurrency";

export function userBelongsToOrganization(user) {
  if (!user) return false;

  const orgId = user.organization_id;
  if (
    orgId &&
    orgId !== null &&
    orgId !== "null" &&
    orgId !== "undefined"
  ) {
    return true;
  }

  if (!user.organization) return false;
  const org = user.organization;
  if (typeof org === "object" && org !== null) {
    if (org.id) return true;
    return Object.keys(org).length > 0;
  }
  if (typeof org === "string") return org.trim() !== "";
  return false;
}

export function isOrganizationOwner(user) {
  return user?.organization_role === "owner";
}

export function buildBillingPath(planId = "starter", currency = "INR") {
  const code = normalizePricingCurrency(currency);
  return `${BILLING_PAGE}?plan=${planId}&currency=${code}`;
}

export function buildSignupRedirect(planId = "starter", currency = "INR") {
  return `/signup?redirect=${encodeURIComponent(buildBillingPath(planId, currency))}`;
}

/**
 * Where to send user after auth when pursuing a plan purchase.
 */
export function resolveBillingDestination(user, planId = "starter", currency = "INR") {
  if (!userBelongsToOrganization(user)) {
    return { type: "individual", path: buildBillingPath(planId, currency) };
  }
  if (isOrganizationOwner(user)) {
    return { type: "org_owner", planId, currency: normalizePricingCurrency(currency) };
  }
  return { type: "org_member", blocked: true };
}

export function getOrganizationId(user) {
  if (!user?.organization) return null;
  if (typeof user.organization === "object" && user.organization.id) {
    return user.organization.id;
  }
  if (typeof user.organization === "string") return user.organization;
  return null;
}
