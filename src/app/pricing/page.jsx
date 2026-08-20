"use client";

import MarketingNav from "@/components/home/MarketingNav";
import MarketingFooter from "@/components/home/MarketingFooter";
import PricingPlansSection from "@/components/home/PricingPlansSection";

export default function PricingPage() {
  return (
    <div className="splash-page splash-page--pricing">
      <MarketingNav />
      <style>{`
.splash-page--pricing{
  --nav-h:64px;
  width:100%;max-width:100%;overflow-x:clip;
  padding-top:var(--nav-h);position:relative;isolation:isolate;
  background:#0E0D09;min-height:100dvh;
}
@media(max-width:768px){.splash-page--pricing{--nav-h:56px}}
      `}</style>
      <PricingPlansSection fullPage />
      <MarketingFooter />
    </div>
  );
}
