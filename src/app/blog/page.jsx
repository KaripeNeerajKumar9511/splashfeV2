"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { buildMediaUrl } from "@/utils/imagehelper";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";

function mediaSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return buildMediaUrl(src);
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiService
      .getBlogPosts()
      .then((list) => {
        if (!cancelled) setPosts(Array.isArray(list) ? list : []);
      })
      .catch((e) => {
        if (!cancelled) {
          setPosts([]);
          setError(e?.message || "Could not load blogs");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Our Blog"
        title="Insights & Updates"
        subtitle="Latest news, trends, and insights on AI, fashion photography, and digital retail."
      />

      <section className="bg-[#0E0D09] py-10 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-3 sm:px-6">
          {loading ? (
            <p className="text-center font-['DM_Sans',sans-serif] text-[rgba(242,237,216,0.58)]">
              Loading posts…
            </p>
          ) : error ? (
            <p className="text-center font-['DM_Sans',sans-serif] text-[rgba(242,237,216,0.58)]">
              {error}
            </p>
          ) : posts.length === 0 ? (
            <p className="text-center font-['DM_Sans',sans-serif] text-[rgba(242,237,216,0.58)]">
              No published posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {posts.map((post) => {
                const cover = mediaSrc(post.image || post.image_url);
                return (
                  <Link
                    key={post.slug || post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] transition duration-300 hover:border-[rgba(201,168,76,0.45)] hover:bg-[#1a1812]"
                  >
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-[rgba(201,168,76,0.14)] bg-[#0E0D09]">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={post.title || ""}
                          className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <span className="font-['Cormorant_Garamond',serif] text-2xl text-[rgba(201,168,76,0.35)]">
                          Splash
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      {post.is_trending ? (
                        <p className="mb-2 font-['DM_Sans',sans-serif] text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
                          Trending
                        </p>
                      ) : null}
                      <h2 className="mb-3 font-['Cormorant_Garamond',serif] text-xl font-normal leading-snug tracking-tight text-[#F2EDD8] transition group-hover:text-[#C9A84C] sm:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mb-5 line-clamp-3 flex-1 font-['DM_Sans',sans-serif] text-sm font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                        {post.excerpt || post.short_content || ""}
                      </p>
                      <p className="mt-auto border-t border-[rgba(255,255,255,0.06)] pt-4 font-['DM_Sans',sans-serif] text-xs text-[rgba(242,237,216,0.42)]">
                        {[post.author, post.date, post.read_time].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MarketingPageShell>
  );
}
