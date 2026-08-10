import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * FAQ accordion matching the /faqs page design.
 * Uses native <details> so items expand without JavaScript.
 */
export default function MarketingFaqList({ items = [], answerClassName = "" }) {
  if (!items?.length) return null;

  return (
    <div className="space-y-4">
      {items.map((faq, index) => (
        <details
          key={faq.id || faq.question || index}
          className="group rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-5 transition-colors hover:border-[rgba(201,168,76,0.4)] sm:p-6 md:p-8"
        >
          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 text-left sm:gap-6 [&::-webkit-details-marker]:hidden">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="shrink-0 rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-2 text-[#C9A84C]">
                <HelpCircle className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-lg font-normal text-[#F2EDD8] sm:text-xl">
                {faq.question}
              </h3>
            </div>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-[rgba(242,237,216,0.45)] transition-transform group-open:rotate-180 group-open:text-[#C9A84C]"
              aria-hidden
            />
          </summary>

          {faq.answerHtml ? (
            <div
              className={`mt-5 pl-0 font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:pl-14 ${answerClassName}`.trim()}
              dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
            />
          ) : (
            <p className="mt-5 pl-0 font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)] sm:pl-14">
              {faq.answer}
            </p>
          )}
        </details>
      ))}
    </div>
  );
}
