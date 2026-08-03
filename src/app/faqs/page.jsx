"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { FAQS_PAGE_DEFAULTS, resolveFaqsContent } from "@/lib/pageContentDefaults";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);
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
        <div className="mx-auto max-w-screen-md space-y-4 px-4 sm:px-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question || index}
                className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-5 sm:p-6 md:p-8 transition-colors hover:border-[rgba(201,168,76,0.4)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 text-left sm:gap-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="shrink-0 rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-2 text-[#C9A84C]">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-['Cormorant_Garamond',serif] text-lg sm:text-xl font-normal text-[#F2EDD8]">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[rgba(242,237,216,0.45)] transition-transform ${
                      isOpen ? "rotate-180 text-[#C9A84C]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-5 pl-0 sm:pl-14 font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
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
