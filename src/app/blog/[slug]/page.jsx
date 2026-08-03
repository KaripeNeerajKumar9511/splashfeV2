"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiService } from "@/lib/api";
import MarketingPageShell from "@/components/home/MarketingPageShell";
import {
  BLOG_RENDERED_CONTENT_PORTAL_CLASS,
  BLOG_RENDERED_CONTENT_PORTAL_CSS,
} from "@/lib/blogContentStyles";
import { adaptBlogHtmlForPortal } from "@/lib/adaptBlogHtmlForPortal";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    apiService
      .getBlogPost(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const bodyHtml = useMemo(
    () => adaptBlogHtmlForPortal(post?.body || post?.content || ""),
    [post]
  );

  const faqItems = useMemo(() => {
    const faqs = Array.isArray(post?.faqs) ? post.faqs : [];
    return faqs.map((faq) => ({
      ...faq,
      answerHtml: adaptBlogHtmlForPortal(faq.answer || ""),
    }));
  }, [post]);

  if (loading) {
    return (
      <MarketingPageShell>
        <div className="flex min-h-[50vh] items-center justify-center px-6">
          <p className="font-['DM_Sans',sans-serif] text-[rgba(242,237,216,0.58)]">Loading…</p>
        </div>
      </MarketingPageShell>
    );
  }

  if (!post) {
    return (
      <MarketingPageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl text-[#F2EDD8]">Post not found</h1>
          <Link
            href="/blog"
            className="font-['DM_Sans',sans-serif] text-sm text-[#C9A84C] underline-offset-4 hover:underline"
          >
            Back to Blog
          </Link>
        </div>
      </MarketingPageShell>
    );
  }

  const cover = post.image || post.image_url;
  const short = post.excerpt || post.short_content || "";

  return (
    <MarketingPageShell>
      <style>{BLOG_RENDERED_CONTENT_PORTAL_CSS}</style>

      {/* Wide sheet aligned to marketing page margins (screen-xl) */}
      <div className="bg-[#0E0D09] px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        <div className="mx-auto max-w-screen-xl space-y-6">
          <div>
            <Link
              href="/blog"
              className="mb-3 inline-flex items-center gap-1.5 font-['DM_Sans',sans-serif] text-sm text-[rgba(242,237,216,0.5)] transition hover:text-[#C9A84C]"
            >
              ← Back to blogs
            </Link>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-normal tracking-tight text-[#F2EDD8] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-2 font-['DM_Sans',sans-serif] text-sm text-[rgba(242,237,216,0.48)]">
              {[post.author || "Splash Team", post.date, post.read_time].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410]">
            {cover ? (
              <div className="flex items-center justify-center border-b border-[rgba(201,168,76,0.14)] bg-[#0E0D09] px-2 py-2 sm:px-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt=""
                  className="h-auto w-full max-w-full object-contain"
                  style={{ maxHeight: 480 }}
                />
              </div>
            ) : null}

            <div className="p-5 sm:p-8 md:px-10 md:py-9 lg:px-12">
              {short ? (
                <p className="mb-6 font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:text-lg">
                  {short}
                </p>
              ) : null}

              <div
                className={BLOG_RENDERED_CONTENT_PORTAL_CLASS}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {faqItems.length > 0 ? (
                <section className="mt-8 border-t border-[rgba(255,255,255,0.08)] pt-6">
                  <h2 className="mb-4 font-['Cormorant_Garamond',serif] text-xl font-normal text-[#F2EDD8]">
                    FAQs
                  </h2>
                  <div className="space-y-4">
                    {faqItems.map((faq, i) => (
                      <div key={faq.id || i}>
                        <h3 className="font-['Cormorant_Garamond',serif] text-lg font-normal text-[#F2EDD8]">
                          {faq.question}
                        </h3>
                        <div
                          className={`mt-1 ${BLOG_RENDERED_CONTENT_PORTAL_CLASS}`}
                          dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
