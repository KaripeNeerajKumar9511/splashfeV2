"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Database, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";

const iconMap = [ShieldCheck, Lock, Database, UserCheck];

export default function SecurityPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiService.getPageContent("security").then(setContent).catch(() => setContent({}));
  }, []);

  const header = content?.header || {};
  const cards = content?.cards || [
    {
      title: "Infrastructure Security",
      description:
        "Splash AI Studio runs on secure, cloud-based infrastructure with industry-standard firewalls, network isolation, and continuous monitoring to prevent unauthorized access.",
    },
    {
      title: "Data Encryption",
      description:
        "All data is encrypted in transit using HTTPS/TLS and encrypted at rest using modern encryption standards to ensure confidentiality and integrity.",
    },
    {
      title: "Data Ownership",
      description:
        "You retain full ownership of all images, uploads, and generated assets. Splash AI never sells or shares your content with third parties.",
    },
    {
      title: "Access Control",
      description:
        "Role-based access controls allow teams to collaborate securely with defined permissions for Owners, Editors, and Viewers.",
    },
  ];
  const compliance = content?.compliance || {};
  const cta = content?.cta || {};

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Trust"
        title={header.title || "Security & Data Protection"}
        subtitle={
          header.subtitle ||
          "Your data, designs, and intellectual property are protected with enterprise-grade security at every level."
        }
      />

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card, i) => {
            const Icon = iconMap[i] || ShieldCheck;
            return (
              <div
                key={i}
                className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-6 sm:p-8 transition-colors hover:border-[rgba(201,168,76,0.4)]"
              >
                <Icon className="mb-4 h-9 w-9 text-[#C9A84C]" />
                <h3 className="mb-3 font-['Cormorant_Garamond',serif] text-2xl font-normal text-[#E8D08A]">
                  {card.title}
                </h3>
                <p className="font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[rgba(255,255,255,0.07)] bg-[#161410] py-14 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 text-center">
          <h2 className="mb-6 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
            {compliance.heading || "Compliance & Best Practices"}
          </h2>
          {(
            compliance.paragraphs || [
              "Splash AI Studio follows globally recognized best practices for data protection, privacy, and secure software development.",
              "We continuously review and improve our security posture to stay aligned with evolving industry standards.",
            ]
          ).map((p, i) => (
            <p
              key={i}
              className="mb-4 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-[#0E0D09] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <h2 className="mb-4 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
            {cta.title || "Have security questions?"}
          </h2>
          <p className="mb-8 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light text-[rgba(242,237,216,0.58)]">
            {cta.subtitle ||
              "Our team is happy to answer any security or compliance questions you may have."}
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-8 py-3.5 font-['DM_Sans',sans-serif] text-base font-semibold text-[#0E0D09] transition-colors hover:bg-[#E8D08A]"
          >
            {cta.button_text || "Contact Security Team"}
          </button>
        </div>
      </section>
    </MarketingPageShell>
  );
}
