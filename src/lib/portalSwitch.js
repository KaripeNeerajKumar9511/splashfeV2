/**
 * Utility functions for switching between frontend and organization portals
 */

export function isOrganizationOwner(user) {
  if (!user) return false;

  if (typeof user === "string") {
    try {
      user = JSON.parse(user);
    } catch {
      return false;
    }
  }

  return user.organization_role === "owner";
}

/**
 * Switch to organization portal from frontend
 */
export function switchToOrganizationPortal() {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token) {
    console.error("No token found");
    return;
  }

  const orgPortalUrl =
    process.env.NEXT_PUBLIC_ORGANIZATION_PORTAL_URL || "http://localhost:3001";
  const encodedToken = encodeURIComponent(token);
  const encodedUser = encodeURIComponent(user || "");

  window.location.href = `${orgPortalUrl}/dashboard?token=${encodedToken}&user=${encodedUser}&from=frontend`;
}

/**
 * Redirect org owner to organization payments with optional plan
 */
export function redirectToOrgPayments(planId = "starter") {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token) {
    console.error("No token found");
    return;
  }

  const orgPortalUrl =
    process.env.NEXT_PUBLIC_ORGANIZATION_PORTAL_URL || "http://localhost:3001";
  const encodedToken = encodeURIComponent(token);
  const encodedUser = encodeURIComponent(user || "");
  const planQuery = planId ? `&plan=${encodeURIComponent(planId)}` : "";

  if (planId) {
    sessionStorage.setItem("splash_selected_plan", planId);
  }

  window.location.href = `${orgPortalUrl}/dashboard/payments?token=${encodedToken}&user=${encodedUser}&from=frontend${planQuery}`;
}

/**
 * Switch to frontend portal from organization portal
 */
export function switchToFrontendPortal() {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("org_auth_token");
  const user = localStorage.getItem("org_user");

  if (!token) {
    console.error("No token found");
    return;
  }

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  const encodedToken = encodeURIComponent(token);
  const encodedUser = encodeURIComponent(user || "");

  window.location.href = `${frontendUrl}/dashboard?token=${encodedToken}&user=${encodedUser}&from=org`;
}
