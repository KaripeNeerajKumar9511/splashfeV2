"use client";

import Link from "next/link";
import MarketingPageShell, { MarketingHero } from "@/components/home/MarketingPageShell";
import { absoluteApiUrl, LANDING_TYPE_META } from "@/lib/landingPages";
import JsonLd from "@/lib/schema/JsonLd";
import { generateSchema } from "@/lib/schema/generateSchema";
import { getPublicSiteOrigin } from "@/lib/schema/siteConfig";

export default function LandingPageIndex({ typePath, pages }) {
  const meta = LANDING_TYPE_META[typePath] || LANDING_TYPE_META.products;
  const origin = getPublicSiteOrigin();
  const schema = generateSchema({
    type: "CollectionPage",
    url: `${origin}/${typePath}`,
    name: meta.title,
    description: meta.subtitle,
    items: (pages || []).map((item) => ({
      name: item.name,
      url: `${origin}${item.path}`,
      description: item.seo_description,
    })),
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: meta.label, href: `/${typePath}` },
    ],
    site: { origin },
  });

  return (
    <MarketingPageShell>
      <JsonLd schema={schema} />
      <MarketingHero eyebrow={meta.eyebrow} title={meta.title} subtitle={meta.subtitle} />
      <section className="bg-[#0E0D09] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-screen-xl">
          {pages.length === 0 ? (
            <p className="text-center font-['DM_Sans',sans-serif] text-[rgba(242,237,216,0.58)]">
              No published {meta.label.toLowerCase()} yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((item) => {
                const cover = absoluteApiUrl(item.hero_image);
                return (
                  <Link
                    key={item.slug}
                    href={item.path}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[rgba(201,168,76,0.22)] bg-[#161410] transition hover:border-[rgba(201,168,76,0.45)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0E0D09]">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-['Cormorant_Garamond',serif] text-2xl text-[#F2EDD8]">
                        {item.name}
                      </h2>
                      {item.seo_description ? (
                        <p className="mt-2 line-clamp-3 font-['DM_Sans',sans-serif] text-sm font-light leading-relaxed text-[rgba(242,237,216,0.58)]">
                          {item.seo_description}
                        </p>
                      ) : null}
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
