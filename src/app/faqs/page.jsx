"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { FAQS_PAGE_DEFAULTS, resolveFaqsContent } from "@/lib/pageContentDefaults";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";
import MarketingFaqList from "@/components/home/MarketingFaqList";

export default function FAQsPage() {
  const [pageContent, setPageContent] = useState({});
  const router = useRouter();

  useEffect(() => {
    apiService
      .getPageContent("faqs")
      .then((data) => setPageContent(data || {}))
      .catch(() => setPageContent({}));
  }, []);

  const content = useMemo(() => resolveFaqsContent(pageContent), [pageContent]);
  const { header, items, cta } = content;
  const faqs = items?.length ? items : FAQS_PAGE_DEFAULTS.items;

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Help"
        title={header.title}
        subtitle={header.subtitle}
      />

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <MarketingFaqList items={faqs} />
        </div>
      </section>

      <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#161410] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <h2 className="mb-4 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
            {cta.title}
          </h2>
          <p className="mb-8 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light text-[rgba(242,237,216,0.58)]">
            {cta.subtitle}
          </p>
          <button
            type="button"
            onClick={() => router.push(cta.button_href || "/contact")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-8 py-3.5 font-['DM_Sans',sans-serif] text-base font-semibold text-[#0E0D09] transition-colors hover:bg-[#E8D08A]"
          >
            {cta.button_text}
          </button>
        </div>
      </section>
    </MarketingPageShell>
  );
}
