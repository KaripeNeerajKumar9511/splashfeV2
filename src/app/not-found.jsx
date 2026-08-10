import Link from "next/link";
import MarketingPageShell from "@/components/home/MarketingPageShell";

export const metadata = {
  title: "Page not found | Splash AI Studio",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * Site-wide 404 — used by Next.js for unknown routes and notFound().
 * Returns HTTP 404 when rendered via the App Router not-found boundary.
 */
export default function NotFound() {
  return (
    <MarketingPageShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        <p className="font-['DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A84C]">
          Error 404
        </p>
        <h1 className="max-w-xl font-['Cormorant_Garamond',serif] text-4xl font-normal tracking-tight text-[#F2EDD8] sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-md font-['DM_Sans',sans-serif] text-sm font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:text-base">
          This page doesn&apos;t exist or the link may be broken. Check the URL, or head back to explore Splash.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-[#C9A84C] px-5 py-2.5 font-['DM_Sans',sans-serif] text-sm font-medium text-[#0E0D09] transition hover:bg-[#d4b45c]"
          >
            Go to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-md border border-[rgba(201,168,76,0.35)] px-5 py-2.5 font-['DM_Sans',sans-serif] text-sm text-[#F2EDD8] transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
