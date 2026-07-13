"use client";

import MarketingNav from "@/components/home/MarketingNav";
import PricingPlansSection from "@/components/home/PricingPlansSection";

export default function PricingPage() {
  return (
    <div className="splash-page splash-page--pricing">
      <MarketingNav />
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
.splash-page--pricing{
  --nav-h:64px;
  width:100%;max-width:100%;overflow-x:clip;
  padding-top:var(--nav-h);position:relative;isolation:isolate;
  background:#0E0D09;min-height:100dvh;
}
@media(max-width:768px){.splash-page--pricing{--nav-h:56px}}
      `}</style>
      <PricingPlansSection fullPage />
    </div>
  );
}
