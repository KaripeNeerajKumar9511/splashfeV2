export const PUBLIC_CONTACT_PATH = "/contact";
export const DASHBOARD_CONTACT_PATH = "/dashboard/help/contact";

/** Contact page for visitors vs logged-in dashboard users */
export function getContactPath(isAuthenticated = false) {
  return isAuthenticated ? DASHBOARD_CONTACT_PATH : PUBLIC_CONTACT_PATH;
}
