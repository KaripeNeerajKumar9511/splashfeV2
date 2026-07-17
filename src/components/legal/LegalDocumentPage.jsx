"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MarketingNav from "@/components/home/MarketingNav";
import { apiService } from "@/lib/api";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');";

export default function LegalDocumentPage({
  type,
  fallbackTitle,
  subtitle,
  eyebrow = "Legal",
}) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchContent = async () => {
      try {
        const res = await apiService.getLegalContent(type);
        if (cancelled) return;
        if (res?.content) {
          setContent(res.content);
        } else {
          setError("Failed to load content.");
        }
      } catch {
        if (!cancelled) setError("An error occurred while loading content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const title = content?.title || fallbackTitle;
  const updatedLabel = content?.updated_at
    ? new Date(content.updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  let body = null;
  if (loading) {
    body = (
      <div className="flex min-h-[calc(100dvh-var(--nav-h))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  } else if (error) {
    body = (
      <div className="flex min-h-[calc(100dvh-var(--nav-h))] items-center justify-center px-6">
        <p className="font-['DM_Sans',sans-serif] text-sm text-red-400">{error}</p>
      </div>
    );
  } else {
    body = (
      <>
        <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.07)] bg-[#161410]">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[min(640px,90vw)] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20">
            <p className="mb-4 font-['DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A84C]">
              {eyebrow}
            </p>
            <h1 className="mb-4 font-['Cormorant_Garamond',serif] text-4xl font-normal tracking-tight text-[#F2EDD8] sm:text-5xl md:text-[3.25rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-xl font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:text-lg">
              {subtitle}
            </p>
            {/* {updatedLabel ? (
              // <p className="mt-5 font-['DM_Sans',sans-serif] text-xs text-[rgba(242,237,216,0.32)]">
              //   Last updated {updatedLabel}
              // </p>
            ) : null} */}
          </div>
        </section>

        <section className="bg-[#0E0D09] py-10 sm:py-14 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <article className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-6 sm:p-8 md:p-10">
              <div
                className="legal-prose font-['DM_Sans',sans-serif] text-[15px] font-light leading-relaxed text-white sm:text-base
                  [&_h1]:mb-4 [&_h1]:mt-0 [&_h1]:font-['Cormorant_Garamond',serif] [&_h1]:text-3xl [&_h1]:font-normal [&_h1]:tracking-tight [&_h1]:text-[#C9A84C]
                  [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-['Cormorant_Garamond',serif] [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-[#C9A84C]
                  [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-['Cormorant_Garamond',serif] [&_h3]:text-xl [&_h3]:font-normal [&_h3]:text-[#E8D08A]
                  [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-['DM_Sans',sans-serif] [&_h4]:text-base [&_h4]:font-medium [&_h4]:text-[#E8D08A]
                  [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-white
                  [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
                  [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5
                  [&_li]:leading-relaxed [&_li]:text-white
                  [&_strong]:font-medium [&_strong]:text-white
                  [&_a]:text-[#C9A84C] [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-[#E8D08A]
                  [&_hr]:my-8 [&_hr]:border-[rgba(255,255,255,0.07)]
                  [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C9A84C] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[rgba(242,237,216,0.58)]
                  [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse
                  [&_th]:border [&_th]:border-[rgba(255,255,255,0.1)] [&_th]:bg-[#1E1C15] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-[#F2EDD8]
                  [&_td]:border [&_td]:border-[rgba(255,255,255,0.1)] [&_td]:px-3 [&_td]:py-2"
                dangerouslySetInnerHTML={{ __html: content?.content || "" }}
              />
            </article>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="legal-page min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#0E0D09] text-[#F2EDD8] [--nav-h:64px] pt-[var(--nav-h)] max-md:[--nav-h:56px]">
      <style>{FONT_IMPORT}</style>
      <MarketingNav />
      {body}
    </div>
  );
}
