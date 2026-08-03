"use client";

import React, { useEffect, useState } from "react";
import { Eye, Target, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiService } from "@/lib/api";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";

export default function VisionMissionPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiService.getPageContent("vision_mission").then(setContent).catch(() => setContent({}));
  }, []);

  const header = content?.header || {};
  const vision = content?.vision || {};
  const mission = content?.mission || {};
  const coreValues = content?.core_values || {};
  const cta = content?.cta || {};

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Company"
        title={header.title || "Our Vision & Mission"}
        subtitle={
          header.subtitle || "Shaping the future of fashion imagery with AI-powered creativity."
        }
      />

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-3">
                <Eye className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
                {vision.title || "Our Vision"}
              </h2>
            </div>
            {(vision.paragraphs || []).length > 0 ? (
              vision.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-6 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]"
                >
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className="mb-6 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  To become the global standard for AI-powered fashion and product imagery.
                </p>
                <p className="font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  We envision a world where brands can create studio-quality visuals instantly,
                  without physical shoots, heavy costs, or production delays.
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-8 sm:p-10">
            <div className="space-y-5">
              {(
                vision.points || [
                  "Democratize professional visuals",
                  "Enable instant content creation",
                  "Remove photoshoot dependencies",
                  "Empower limitless creativity",
                ]
              ).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C9A84C]" />
                  <span className="font-['DM_Sans',sans-serif] text-base font-light text-[rgba(242,237,216,0.75)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(255,255,255,0.07)] bg-[#161410] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-3">
                <Target className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
                {mission.title || "Our Mission"}
              </h2>
            </div>
            {(mission.paragraphs || []).length > 0 ? (
              mission.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-6 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]"
                >
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className="mb-6 font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  To replace traditional fashion photoshoots with an intelligent, AI-driven creative
                  studio.
                </p>
                <p className="font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  We help brands reduce costs, move faster, and maintain consistent visual quality
                  across all digital channels.
                </p>
              </>
            )}
          </div>
          <div className="order-1 md:order-2 rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#0E0D09] p-8 sm:p-10">
            <div className="space-y-5">
              {(
                mission.bullets || [
                  { text: "Instant AI-generated visuals" },
                  { text: "Built for brands and creative teams" },
                  { text: "Scales globally with ease" },
                ]
              ).map((b, i) => (
                <div key={i} className="flex gap-4">
                  <Zap className="h-5 w-5 shrink-0 text-[#C9A84C]" />
                  <p className="font-['DM_Sans',sans-serif] text-base font-light text-[rgba(242,237,216,0.75)]">
                    {typeof b === "string" ? b : b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 text-center">
          <h2 className="mb-12 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
            {coreValues.heading || "Our Core Values"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(
              coreValues.items || [
                { title: "Innovation", desc: "Pushing boundaries with AI-driven creativity." },
                { title: "Speed", desc: "Helping brands go to market faster." },
                { title: "Accessibility", desc: "High-quality visuals for everyone." },
                { title: "Creative Freedom", desc: "Unlimited experimentation without limits." },
                { title: "Reliability", desc: "Consistent, production-ready results." },
                { title: "Customer Focus", desc: "Solving real-world fashion challenges." },
              ]
            ).map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-6 text-left transition-colors hover:border-[rgba(201,168,76,0.4)]"
              >
                <h3 className="mb-3 font-['Cormorant_Garamond',serif] text-xl font-normal text-[#E8D08A]">
                  {item.title}
                </h3>
                <p className="font-['DM_Sans',sans-serif] text-sm sm:text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#161410] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
          <h2 className="mb-8 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal leading-tight tracking-tight text-[#F2EDD8]">
            {cta.title || "Build the future of fashion visuals with Splash AI Studio."}
          </h2>
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-lg bg-[#C9A84C] px-8 py-6 text-base font-semibold text-[#0E0D09] hover:bg-[#E8D08A]"
            >
              {cta.button_text || "Get Started"}
            </Button>
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
