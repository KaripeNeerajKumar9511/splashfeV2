import Link from "next/link";
import MarketingPageShell from "@/components/home/MarketingPageShell";
import MarketingFaqList from "@/components/home/MarketingFaqList";
import {
  BLOG_RENDERED_CONTENT_PORTAL_CLASS,
  BLOG_RENDERED_CONTENT_PORTAL_CSS,
} from "@/lib/blogContentStyles";
import { adaptBlogHtmlForPortal } from "@/lib/adaptBlogHtmlForPortal";
import { buildMediaUrl } from "@/utils/imagehelper";

function mediaSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return buildMediaUrl(src);
}

export default function BlogPostView({ post }) {
  const bodyHtml = adaptBlogHtmlForPortal(post?.body || post?.content || "");

  const faqs = Array.isArray(post?.faqs) ? post.faqs : [];
  const faqItems = faqs.map((faq) => ({
    ...faq,
    answerHtml: adaptBlogHtmlForPortal(faq.answer || ""),
  }));

  const cover = mediaSrc(post.image || post.image_url);
  const short = post.excerpt || post.short_content || "";

  return (
    <MarketingPageShell>
      <style>{BLOG_RENDERED_CONTENT_PORTAL_CSS}</style>

      <div className="bg-[#0E0D09] px-3 py-8 sm:px-6 sm:py-14 md:py-16">
        <div className="mx-auto max-w-screen-xl space-y-5 sm:space-y-6">
          <div>
            <Link
              href="/blog"
              className="mb-3 inline-flex items-center gap-1.5 font-['DM_Sans',sans-serif] text-sm text-[rgba(242,237,216,0.5)] transition hover:text-[#C9A84C]"
            >
              ← Back to blogs
            </Link>
            <h1 className="font-['Cormorant_Garamond',serif] text-[1.75rem] font-normal leading-tight tracking-tight text-[#F2EDD8] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-2 font-['DM_Sans',sans-serif] text-xs text-[rgba(242,237,216,0.48)] sm:text-sm">
              {[post.author || "Splash Team", post.date, post.read_time].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410]">
            {cover ? (
              <div className="flex items-center justify-center border-b border-[rgba(201,168,76,0.14)] bg-[#0E0D09] px-2 py-2 sm:px-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={post.title || ""}
                  className="h-auto w-full max-w-full object-contain"
                  style={{ maxHeight: 480 }}
                />
              </div>
            ) : null}

            <div className="overflow-x-hidden p-4 sm:p-8 md:px-10 md:py-9 lg:px-12">
              {short ? (
                <p className="mb-5 font-['DM_Sans',sans-serif] text-sm font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:mb-6 sm:text-base sm:text-lg">
                  {short}
                </p>
              ) : null}

              <div
                className={`${BLOG_RENDERED_CONTENT_PORTAL_CLASS} max-w-full`}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {faqItems.length > 0 ? (
                <section className="mt-8 border-t border-[rgba(255,255,255,0.08)] pt-8">
                  <div className="mx-auto max-w-screen-md">
                    <h2 className="mb-5 font-['Cormorant_Garamond',serif] text-2xl font-normal tracking-tight text-[#F2EDD8] sm:mb-6 sm:text-3xl">
                      FAQs
                    </h2>
                    <MarketingFaqList
                      items={faqItems}
                      answerClassName={BLOG_RENDERED_CONTENT_PORTAL_CLASS}
                    />
                  </div>
                </section>
              ) : null}            </div>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
