"use client";

import React, { useEffect, useState } from "react";
import { MoveRight, Zap, Globe2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiService } from "@/lib/api";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";

export default function AboutPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiService.getPageContent("about").then(setContent).catch(() => setContent({}));
  }, []);

  const header = content?.header || {};
  const whoWeAre = content?.who_we_are || {};
  const purposeVision = content?.purpose_vision || {};
  const platformOffers = content?.platform_offers || {};
  const howItWorks = content?.how_it_works || {};
  const whoItIsFor = content?.who_it_is_for || {};
  const closing = content?.closing || {};

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="About"
        title={header.title || "About Splash AI Studio"}
        subtitle={
          header.subtitle ||
          "Splash AI Studio is an AI-powered photoshoot replacement platform built for the fashion and apparel retail industry."
        }
      />

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-4 font-['DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A84C]">
              {whoWeAre.badge || "Who We Are"}
            </p>
            <h2 className="mb-6 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
              {whoWeAre.title || "Virtual Creative Studio"}
            </h2>
            {(whoWeAre.paragraphs || []).length > 0 ? (
              whoWeAre.paragraphs.map((p, i) => (
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
                  Splash AI Studio transforms the traditional product photography process into an
                  automated, AI-driven workflow. It enables fashion brands and D2C retailers to
                  generate high-quality product visuals, lifestyle images, and campaign assets
                  without the need for cameras, physical studios, or professional models.
                </p>
                <p className="font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  The platform functions as a virtual creative studio that simplifies visual content
                  creation while maintaining professional quality and brand consistency.
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-2 gap-4">
              {(
                whoWeAre.images || [
                  "/images/about1.jpg",
                  "/images/about2.jpg",
                  "/images/about3.jpg",
                  "/images/logo-Splash.png",
                ]
              ).map((src, i) => (
                <div
                  key={i}
                  className="h-36 sm:h-40 w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#1E1C15]"
                >
                  <img src={src} alt={`About ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(255,255,255,0.07)] bg-[#161410] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-3">
                  <Zap className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-normal text-[#F2EDD8]">
                  {purposeVision.purpose_title || "Our Purpose"}
                </h2>
              </div>
              <p className="whitespace-pre-line font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                {purposeVision.purpose_text ||
                  "The purpose of Splash AI Studio is to eliminate the limitations of traditional photoshoots — high costs, long production cycles, and limited scalability.\n\nBy leveraging artificial intelligence, the platform allows brands to create visual content instantly, reduce operational overhead, and adapt quickly to changing marketing needs."}
              </p>
            </div>
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] p-3">
                  <Globe2 className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-normal text-[#F2EDD8]">
                  {purposeVision.vision_title || "Our Vision"}
                </h2>
              </div>
              <p className="font-['DM_Sans',sans-serif] text-base sm:text-lg font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                {purposeVision.vision_text ||
                  "The vision of Splash AI Studio is to make AI-powered visual content creation accessible to every fashion retailer, regardless of team size, budget, or technical expertise."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="mb-4 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
              {platformOffers.heading || "What the Platform Offers"}
            </h2>
            <p className="mx-auto max-w-2xl font-['DM_Sans',sans-serif] text-base sm:text-lg font-light text-[rgba(242,237,216,0.58)]">
              {platformOffers.subheading ||
                "A complete suite of tools designed to replace the traditional studio workflow."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(
              platformOffers.items || [
                {
                  title: "Product Visuals",
                  description:
                    "Tools to generate individual product visuals and campaign imagery with high fidelity.",
                },
                {
                  title: "Centralized Dashboard",
                  description:
                    "A centralized dashboard to manage, organize, and retrieve all your AI-generated images.",
                },
                {
                  title: "Campaign Creation",
                  description:
                    "Support for project-based campaign creation to keep your seasonal assets organized.",
                },
                {
                  title: "Collaboration",
                  description:
                    "Built-in collaboration capabilities for growing teams and agencies.",
                },
                {
                  title: "Flexible Plans",
                  description:
                    "Flexible subscription and credit-based usage plans tailored to your needs.",
                },
                {
                  title: "Intuitive Design",
                  description:
                    "The platform is designed to be intuitive and usable by non-technical users.",
                },
              ]
            ).map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] p-6 transition-colors hover:border-[rgba(201,168,76,0.4)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="mb-3 font-['Cormorant_Garamond',serif] text-xl font-normal text-[#E8D08A]">
                  {item.title}
                </h3>
                <p className="font-['DM_Sans',sans-serif] text-sm sm:text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(255,255,255,0.07)] bg-[#161410] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="mb-8 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
                {howItWorks.heading || "How It Works"}
              </h2>
              <div className="space-y-8">
                {(
                  howItWorks.steps || [
                    {
                      title: "Upload & Select",
                      description:
                        "Users upload product images, select visual styles or themes, and generate AI-powered visuals through guided workflows.",
                    },
                    {
                      title: "Refine & Download",
                      description:
                        "Generated images can be previewed, refined, organized, and downloaded directly from the platform.",
                    },
                  ]
                ).map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] font-['DM_Sans',sans-serif] text-sm font-medium text-[#0E0D09]">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="mb-2 font-['Cormorant_Garamond',serif] text-xl font-normal text-[#E8D08A]">
                        {step.title}
                      </h3>
                      <p className="font-['DM_Sans',sans-serif] text-base font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#0E0D09] p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex h-14 w-full items-center rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#1E1C15] px-4 font-['DM_Sans',sans-serif] text-sm text-[rgba(242,237,216,0.45)]">
                  Upload Product.png
                </div>
                <div className="flex justify-center">
                  <MoveRight className="rotate-90 text-[rgba(201,168,76,0.45)]" />
                </div>
                <div className="flex h-14 w-full items-center rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#1E1C15] px-4 font-['DM_Sans',sans-serif] text-sm text-[rgba(242,237,216,0.45)]">
                  Select &quot;Studio Lighting&quot;
                </div>
                <div className="flex justify-center">
                  <MoveRight className="rotate-90 text-[rgba(201,168,76,0.45)]" />
                </div>
                <div className="flex h-40 w-full items-center justify-center rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.08)] font-['Cormorant_Garamond',serif] text-xl text-[#C9A84C]">
                  Generating...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0D09] py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 text-center">
          <h2 className="mb-10 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#F2EDD8]">
            {whoItIsFor.heading || "Who It Is For"}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {(
              whoItIsFor.items || [
                "Fashion and apparel brands",
                "D2C retailers",
                "Ecommerce businesses",
                "Creative teams and agencies",
              ]
            ).map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-[rgba(201,168,76,0.22)] bg-[#161410] px-5 py-2.5 font-['DM_Sans',sans-serif] text-sm font-medium text-[#F2EDD8]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#161410] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
          <h2 className="mb-8 font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal leading-tight tracking-tight text-[#F2EDD8]">
            {closing.title ||
              "Splash AI Studio represents a modern approach to fashion photography — combining speed, scalability, and creative flexibility through artificial intelligence."}
          </h2>
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-lg bg-[#C9A84C] px-8 py-6 text-base font-semibold text-[#0E0D09] hover:bg-[#E8D08A]"
            >
              {closing.cta_text || "Get Started"}
            </Button>
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
