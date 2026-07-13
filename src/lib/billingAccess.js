import { BILLING_PAGE } from "@/lib/pricingPlans";

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

export function buildBillingPath(planId = "starter") {
  return `${BILLING_PAGE}?plan=${planId}`;
}

export function buildSignupRedirect(planId = "starter") {
  return `/signup?redirect=${encodeURIComponent(buildBillingPath(planId))}`;
}

/**
 * Where to send user after auth when pursuing a plan purchase.
 */
export function resolveBillingDestination(user, planId = "starter") {
  if (!userBelongsToOrganization(user)) {
    return { type: "individual", path: buildBillingPath(planId) };
  }
  if (isOrganizationOwner(user)) {
    return { type: "org_owner", planId };
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
