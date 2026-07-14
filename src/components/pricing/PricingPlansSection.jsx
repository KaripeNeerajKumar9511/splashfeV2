"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchPricingData,
  getPlanAmountDisplay,
  getPlanCreditsDisplay,
  shouldShowBillingCycle,
} from "@/lib/pricingApi";
import {
  buildSignupRedirect,
  resolveBillingDestination,
} from "@/lib/billingAccess";
import { redirectToOrgPayments } from "@/lib/portalSwitch";
import { DASHBOARD_CONTACT_PATH, PUBLIC_CONTACT_PATH } from "@/lib/contactPaths";

const ICON_PROPS = { size: 20, strokeWidth: 1.5, color: "#C9A84C" };

function resolvePlanIconType(plan) {
  const slug = String(plan?.id || plan?.slug || "").toLowerCase();
  if (slug === "free") return "sparkles";

  const icon = String(plan?.icon || "").toLowerCase();
  if (icon === "growth") return "trending-up";
  if (["sparkles", "diamond", "trending-up", "crown"].includes(icon)) return icon;
  return "diamond";
}

function DiamondIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 7-10 13L2 10z" />
      <path d="M2 10h20" />
      <path d="M12 3v7" />
      <path d="M6 3l6 7 6-7" />
    </svg>
  );
}

function PlanIcon({ type }) {
  if (type === "sparkles") return <Sparkles {...ICON_PROPS} />;
  if (type === "trending-up") return <TrendingUp {...ICON_PROPS} />;
  if (type === "crown") return <Crown {...ICON_PROPS} />;
  return <DiamondIcon />;
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C" stroke="none">
      <path d="M12 2l2.9 6.9L22 9.8l-5.2 4.5 1.6 7.1L12 17.8 5.6 21.4 7.2 14.3 2 9.8l7.1-.9z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="pricing-check" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

function isFreePlan(plan) {
  const slug = String(plan?.id || plan?.slug || "").toLowerCase();
  const name = String(plan?.name || "").toLowerCase();
  return slug === "free" || name === "free";
}

const PRICING_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
.pricing-section{
  --gold:#C9A84C;--gold-l:#E8D08A;--gold-dim:rgba(201,168,76,0.1);--gold-b:rgba(201,168,76,0.22);
  --d1:#0E0D09;--t1:#F2EDD8;--t2:rgba(242,237,216,0.58);--t3:rgba(242,237,216,0.38);
  padding:3.5rem clamp(1rem,4vw,5%) 3rem;
  background:var(--d1);
  text-align:center;
  position:relative;
}
.pricing-section--full{padding:1rem clamp(.75rem,2.5vw,3%) 1.25rem}
.pricing-section--dashboard{padding:1.5rem 1rem 2rem;background:transparent}
.pricing-section--cards-only{padding:0;background:transparent}
.pricing-section--cards-only .pricing-glow{display:none}
.pricing-section--embedded{
  padding:0;background:transparent;text-align:left;
}
.pricing-section--embedded .pricing-grid{
  grid-template-columns:repeat(4,1fr);
  max-width:none;gap:1rem;margin:0;
}
.pricing-section--dashboard.pricing-section--embedded .pricing-grid{
  grid-template-columns:repeat(3,1fr);
}
@media(max-width:1024px){
  .pricing-section--embedded .pricing-grid{grid-template-columns:repeat(2,1fr)}
  .pricing-section--dashboard.pricing-section--embedded .pricing-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .pricing-section--embedded .pricing-grid{grid-template-columns:1fr;max-width:360px}
}
.pricing-section--embedded .pricing-card{
  background:var(--sidebar-accent, rgba(28,26,20,0.65));
  border-color:rgba(201,168,76,0.2);
  height:100%;
}
.pricing-section--dashboard.pricing-section--embedded .pricing-card{
  background:linear-gradient(165deg,rgba(28,26,20,0.98) 0%,rgba(18,16,13,0.99) 100%);
  border:.5px solid rgba(201,168,76,0.18);
  box-shadow:none;
  transform:none;
}
.pricing-section--dashboard.pricing-section--embedded .pricing-card.featured{
  border-color:rgba(201,168,76,0.5);
  box-shadow:0 0 0 1px rgba(201,168,76,0.12),0 0 48px rgba(201,168,76,0.12),0 16px 40px rgba(0,0,0,0.35);
  transform:scale(1.02);
}
@media(max-width:768px){
  .pricing-section--dashboard.pricing-section--embedded .pricing-card.featured{transform:none}
}
.pricing-embedded .pricing-grid{
  grid-template-columns:repeat(4,1fr);
  max-width:1100px;
}
@media(max-width:1024px){
  .pricing-embedded .pricing-grid{grid-template-columns:repeat(2,1fr);max-width:760px}
}
@media(max-width:768px){
  .pricing-embedded .pricing-grid{grid-template-columns:1fr;max-width:360px}
}
.pricing-glow{
  position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);
  width:min(420px,70vw);height:min(420px,50vh);
  background:radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 70%);
  pointer-events:none;z-index:0;
}
.pricing-section > *:not(.pricing-glow){position:relative;z-index:1}
.pricing-hero{margin-bottom:clamp(.85rem,1.8vw,1.5rem)}
.pricing-badge{
  display:inline-flex;align-items:center;gap:6px;
  border:.5px solid var(--gold-b);padding:4px 12px;border-radius:20px;
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;
  letter-spacing:.16em;text-transform:uppercase;color:var(--gold-l);
  background:var(--gold-dim);margin-bottom:.7rem;
}
.pricing-heading{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(30px,3.8vw,48px);font-weight:300;line-height:1.1;
  color:var(--t1);max-width:720px;margin:0 auto .5rem;
}
.pricing-heading-line{display:block}
.pricing-heading em{font-style:italic;color:var(--gold-l)}
.pricing-sub{
  font-family:'DM Sans',sans-serif;font-size:clamp(12px,1.4vw,13px);font-weight:300;
  color:var(--t2);max-width:460px;margin:0 auto;line-height:1.55;
}
.pricing-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:12px;
  max-width:980px;margin:0 auto;text-align:left;align-items:stretch;
}
.pricing-card{
  position:relative;display:flex;flex-direction:column;
  background:linear-gradient(165deg,rgba(28,26,20,0.98) 0%,rgba(18,16,13,0.99) 100%);
  border:.5px solid rgba(201,168,76,0.18);border-radius:14px;
  padding:1.15rem 1.05rem 1rem;
}
.pricing-card.featured{
  border-color:rgba(201,168,76,0.5);
  box-shadow:0 0 0 1px rgba(201,168,76,0.12),0 0 48px rgba(201,168,76,0.12),0 16px 40px rgba(0,0,0,0.35);
  transform:scale(1.02);z-index:2;
}
.pricing-popular{
  position:absolute;top:-11px;left:50%;transform:translateX(-50%);
  background:linear-gradient(135deg,#C9A84C,#E8D08A);color:var(--d1);
  font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;padding:5px 14px;border-radius:20px;white-space:nowrap;
}
.pricing-icon{
  width:44px;height:44px;border-radius:50%;
  background:var(--gold-dim);border:.5px solid var(--gold-b);
  display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;
}
.pricing-name{
  font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;
  color:var(--gold-l);margin-bottom:.2rem;line-height:1.15;
}
.pricing-desc{
  font-family:'DM Sans',sans-serif;font-size:.76rem;color:var(--t3);
  line-height:1.45;margin-bottom:.85rem;
}
.pricing-amount{
  margin-bottom:.85rem;line-height:1.1;
  display:flex;align-items:baseline;flex-wrap:wrap;gap:.2rem;
}
.pricing-amount-value{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(1.7rem,2.4vw,2rem);
  font-weight:400;
  color:var(--t1);
  font-variant-numeric:tabular-nums;
  letter-spacing:0.01em;
  line-height:1.15;
}
.pricing-amount-cycle{
  font-family:'DM Sans',sans-serif;
  font-size:.78rem;
  color:var(--t2);
  font-weight:400;
}
.pricing-credits{
  background:rgba(8,7,5,0.55);border:.5px solid rgba(201,168,76,0.16);border-radius:10px;
  padding:.7rem .8rem;margin-bottom:.75rem;
}
.pricing-credits-hdr{display:flex;align-items:center;gap:7px;margin-bottom:.2rem}
.pricing-credits-hdr strong{
  font-family:'Cormorant Garamond',serif;
  font-size:.92rem;
  font-weight:400;
  color:var(--gold-l);
  font-variant-numeric:tabular-nums;
  letter-spacing:0.02em;
}
.pricing-credits p{font-family:'DM Sans',sans-serif;font-size:.7rem;color:var(--t3);line-height:1.4;margin:0}
.pricing-features{list-style:none;padding:0;margin:0 0 .65rem;flex:1}
.pricing-features li{
  display:flex;align-items:flex-start;gap:8px;
  font-family:'DM Sans',sans-serif;font-size:.72rem;color:var(--t2);
  line-height:1.3;margin-bottom:.35rem;
}
.pricing-check{
  width:16px;height:16px;border-radius:50%;
  background:rgba(201,168,76,0.12);border:.5px solid rgba(201,168,76,0.3);
  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;
}
.pricing-btn{
  display:flex;align-items:center;justify-content:center;gap:6px;
  width:100%;min-height:40px;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;
  cursor:pointer;transition:opacity .2s,transform .15s,border-color .2s;
  border:none;margin-top:auto;
}
.pricing-btn:hover{opacity:.92;transform:translateY(-1px)}
.pricing-btn.outline{background:transparent;border:.5px solid var(--gold-b);color:var(--gold-l)}
.pricing-btn.outline:hover{border-color:var(--gold);color:var(--t1)}
.pricing-btn.solid{background:var(--gold);color:var(--d1);border:.5px solid var(--gold)}
@media(max-width:768px){
  .pricing-grid{grid-template-columns:1fr;max-width:360px;gap:16px}
  .pricing-card.featured{transform:none;order:-1}
}
`;

export default function PricingPlansSection({
  showHeader = true,
  cardsOnly = false,
  embedded = false,
  className = "",
  fullPage = false,
  dashboard = false,
  onPlanSelect,
  plans: plansProp,
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [plans, setPlans] = useState(plansProp || []);
  const [loading, setLoading] = useState(!plansProp?.length);

  useEffect(() => {
    if (plansProp?.length) {
      setPlans(plansProp);
      setLoading(false);
      return;
    }
    let active = true;
    fetchPricingData().then((data) => {
      if (!active) return;
      setPlans(data.plans);
      setLoading(false);
    });
    return () => { active = false; };
  }, [plansProp]);

  const visiblePlans = useMemo(() => {
    if (!dashboard) return plans;
    return plans.filter((plan) => !isFreePlan(plan));
  }, [plans, dashboard]);

  const resolvePlanCtaHref = (plan) => {
    const href = plan.ctaHref || PUBLIC_CONTACT_PATH;
    const isContactLink =
      href === PUBLIC_CONTACT_PATH ||
      href === DASHBOARD_CONTACT_PATH ||
      href.endsWith("/contact") ||
      href.includes("/help/contact");

    if (isContactLink && (isAuthenticated || dashboard)) {
      return DASHBOARD_CONTACT_PATH;
    }

    return href.startsWith("/") ? href : PUBLIC_CONTACT_PATH;
  };

  const handlePlanAction = (plan) => {
    if (plan.ctaHref) {
      router.push(resolvePlanCtaHref(plan));
      return;
    }

    if (onPlanSelect) {
      onPlanSelect(plan.id);
      return;
    }

    if (!isAuthenticated) {
      router.push(buildSignupRedirect(plan.id));
      return;
    }

    const dest = resolveBillingDestination(user, plan.id);
    if (dest.type === "org_owner") {
      redirectToOrgPayments(plan.id);
      return;
    }
    if (dest.blocked) {
      router.push("/dashboard/my-account/billing");
      return;
    }
    router.push(dest.path);
  };

  const hideChrome = cardsOnly || !showHeader;

  const sectionClass = [
    "pricing-section",
    fullPage ? "pricing-section--full" : "",
    dashboard ? "pricing-section--dashboard" : "",
    cardsOnly ? "pricing-section--cards-only" : "",
    embedded ? "pricing-section--embedded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gold-solid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className={sectionClass} id={cardsOnly ? undefined : "pricing"}>
      <style>{PRICING_CSS}</style>
      {!hideChrome && <div className="pricing-glow" aria-hidden="true" />}

      {showHeader && (
        <div className="pricing-hero">
          <div className="pricing-badge">✦ PRICING PLANS ✦</div>
          <h2 className="pricing-heading">
            <span className="pricing-heading-line">Simple Pricing.</span>
            <span className="pricing-heading-line">
              <em>Luxury Visuals</em> Without Studio Costs.
            </span>
          </h2>
          <p className="pricing-sub">
            Choose the perfect plan for your jewelry brand. Upgrade, downgrade, or cancel anytime — no long-term commitments.
          </p>
        </div>
      )}

      <div className="pricing-grid">
        {visiblePlans.map((plan) => (
          <div key={plan.id} className={`pricing-card${plan.featured ? " featured" : ""}`}>
            {plan.badge && <div className="pricing-popular">✦ {plan.badge}</div>}
            <div className="pricing-icon">
              <PlanIcon type={resolvePlanIconType(plan)} />
            </div>
            <h3 className="pricing-name">{plan.name}</h3>
            <p className="pricing-desc">{plan.description}</p>
            <div className="pricing-amount">
              <span className="pricing-amount-value">{getPlanAmountDisplay(plan)}</span>
              {shouldShowBillingCycle(plan) && (
                <span className="pricing-amount-cycle">/{plan.billingCycle}</span>
              )}
            </div>
            <div className="pricing-credits">
              <div className="pricing-credits-hdr">
                <StarIcon />
                <strong>{getPlanCreditsDisplay(plan)}</strong>
              </div>
              <p>{plan.imagesNote}</p>
            </div>
            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`pricing-btn ${plan.ctaVariant}`}
              onClick={() => handlePlanAction(plan)}
            >
              {plan.cta} →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
