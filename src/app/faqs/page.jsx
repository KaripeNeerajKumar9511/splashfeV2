"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/home/Navigation";
import { apiService } from "@/lib/api";
import { FAQS_PAGE_DEFAULTS, resolveFaqsContent } from "@/lib/pageContentDefaults";

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
    <>
      <Navigation />
      <div className="min-h-screen bg-white text-[#0c1421]">
        <section className="relative py-20 md:py-32 overflow-hidden bg-[#f8f9fc]">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-500">
              {header.title}
            </h1>
            <p className="text-lg md:text-xl text-[#313957] max-w-2xl mx-auto leading-relaxed">
              {header.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-screen-md mx-auto px-6 space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question || index}
                  className="bg-white border border-[#e6e6e6] rounded-2xl p-6 md:p-8 transition-shadow hover:shadow-lg"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[#f0f2f5] text-[#5533ff]">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="mt-6 text-[#313957] text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-20 bg-[#0c1421] text-white text-center">
          <div className="max-w-screen-md mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {cta.title}
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              {cta.subtitle}
            </p>
            <button
              onClick={() => router.push(cta.button_href || "/contact")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#5533ff] font-bold text-lg hover:bg-gray-100 transition"
            >
              {cta.button_text}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
