/** Routes that must wait for client auth bootstrap before rendering (dashboard shell). */
export function requiresAuthBootstrap(pathname) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/complete-profile")
  );
}
