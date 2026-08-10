import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function isSitemapOrRobotsPath(pathname) {
  return (
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xsl" ||
    pathname.startsWith("/sitemap/")
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Sitemap / robots / XSL must never be rewritten or auth-gated
  if (isSitemapOrRobotsPath(pathname)) {
    return NextResponse.next();
  }

  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = decodeURIComponent(match[1] || "").trim();
  if (!slug) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/homepage/blog/${encodeURIComponent(slug)}/`,
      { cache: "no-store" }
    );
    if (res.status === 404) {
      return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
    }
  } catch {
    /* Page component handles API errors */
  }

  return NextResponse.next();
}

// Only blog slug rewrites run through middleware.
// /sitemap, /sitemap.xml, /robots.txt, /sitemap.xsl are excluded by matcher.
export const config = {
  matcher: ["/blog/:slug+"],
};
