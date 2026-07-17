"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldAlert, Mail } from "lucide-react";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PricingPlansSection from "@/components/pricing/PricingPlansSection";
import BillingDetailsModal from "@/components/pricing/BillingDetailsModal";
import {
  userBelongsToOrganization,
  isOrganizationOwner,
  buildSignupRedirect,
} from "@/lib/billingAccess";
import { redirectToOrgPayments } from "@/lib/portalSwitch";
import { getPlanById } from "@/lib/pricingPlans";
import { fetchPricingData, getPlanFromList } from "@/lib/pricingApi";
import toast from "react-hot-toast";

function OrgMemberBlocked({ orgName, ownerEmail }) {
  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
        <ShieldAlert className="w-7 h-7 text-amber-400" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-3">Payment access restricted</h1>
      <p className="text-muted-foreground text-sm leading-relaxed mb-2">
        You don&apos;t have access to make payments
        {orgName ? ` for ${orgName}` : ""}.
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        Please contact your organization owner to upgrade or purchase credits.
      </p>
      {ownerEmail && (
        <div className="inline-flex items-center gap-2 text-sm text-gold-solid bg-accent border border-gold-muted/30 rounded-lg px-4 py-2">
          <Mail className="w-4 h-4" />
          {ownerEmail}
        </div>
      )}
    </div>
  );
}

function BillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  const initialPlan = searchParams.get("plan") || "starter";
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState("individual");
  const [orgName, setOrgName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [creditBalance, setCreditBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [taxConfig, setTaxConfig] = useState(null);

  useEffect(() => {
    fetchPricingData().then((data) => {
      setPricingPlans(data.plans);
      setTaxConfig(data.taxConfig);
    });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    if (!token || !user) {
      router.replace(buildSignupRedirect(initialPlan));
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const userProfile = await apiService.getUserProfile(token);
        const currentUser = userProfile?.user;
        if (!currentUser) return;

        setProfile(currentUser);

        if (userBelongsToOrganization(currentUser)) {
          if (isOrganizationOwner(currentUser)) {
            redirectToOrgPayments(initialPlan);
            return;
          }

          setAccessType("org_member");
          const orgId =
            typeof currentUser.organization === "object"
              ? currentUser.organization?.id
              : currentUser.organization;

          if (orgId) {
            const orgData = await apiService.getOrganization(orgId, token);
            setOrgName(orgData?.name || "");
            setOwnerEmail(orgData?.owner_email || "");
            setCreditBalance(orgData?.credit_balance || 0);
          }
        } else {
          setAccessType("individual");
          setCreditBalance(currentUser.credit_balance || 0);
        }
      } catch (error) {
        console.error("Failed to load billing page:", error);
        toast.error("Failed to load billing information.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user, router, initialPlan]);

  useEffect(() => {
    setSelectedPlanId(initialPlan);
  }, [initialPlan]);

  const resolvePlan = useCallback(
    (planId) => getPlanFromList(pricingPlans, planId) || getPlanById(planId),
    [pricingPlans]
  );

  const handlePlanSelect = useCallback((planId) => {
    const plan = resolvePlan(planId);
    if (!plan || plan.ctaHref) return;
    setSelectedPlanId(planId);
    router.replace(`/dashboard/my-account/billing?plan=${planId}`, { scroll: false });
    setModalOpen(true);
  }, [router, resolvePlan]);

  const handleProceedToPay = async (billingDetails, tax) => {
    const plan = resolvePlan(selectedPlanId);
    if (!token || !plan || !razorpayLoaded) {
      toast.error("Payment gateway is still loading. Please wait.");
      return;
    }

    setProcessingPayment(true);
    try {
      const orderData = await apiService.createRazorpayOrder(token, {
        amount: plan.price,
        credits: plan.creditsNumeric ?? plan.credits,
        planSlug: plan.id,
        billingDetails: {
          ...billingDetails,
          tax_rate: tax.taxRate,
          cgst_rate: tax.cgstRate,
          sgst_rate: tax.sgstRate,
          cgst_amount: tax.cgstAmount,
          sgst_amount: tax.sgstAmount,
        },
      });

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: orderData.key_id,
        amount: (orderData.total_amount || tax.totalAmount) * 100,
        currency: "INR",
        name: "Splash AI Studio",
        description: `Subscribe to ${plan.name} plan`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const verifyData = await apiService.verifyRazorpayPayment(
              token,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyData.success) {
              toast.success(`${plan.credits} credits added to your account!`);
              setModalOpen(false);
              router.push("/dashboard");
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          email: billingDetails.billing_email,
          contact: billingDetails.billing_phone,
          name: billingDetails.billing_name,
        },

        theme: { color: "#C9A84C" },
        config: {
          display: {
            hide: [
              {
                method: "emi",
              },
            ],
          },
        },
        modal: { ondismiss: () => setProcessingPayment(false) },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to initiate payment.");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold-solid" />
      </div>
    );
  }

  if (accessType === "org_member") {
    return <OrgMemberBlocked orgName={orgName} ownerEmail={ownerEmail} />;
  }

  return (
    <div className="space-y-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-sidebar-border pb-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-gold-solid font-medium">Subscription & Billing</p>
          <h1 className="text-2xl font-semibold text-foreground mt-1">Choose a plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your balance: <span className="text-gold-solid font-semibold">{creditBalance.toLocaleString()} credits</span>
          </p>
        </div>
      </div>

      <PricingPlansSection
        embedded
        cardsOnly
        showHeader={false}
        dashboard
        plans={pricingPlans}
        onPlanSelect={handlePlanSelect}
      />

      <BillingDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        planId={selectedPlanId}
        plan={resolvePlan(selectedPlanId)}
        taxConfig={taxConfig}
        defaultEmail={profile?.email || user?.email || ""}
        defaultName={profile?.full_name || profile?.username || ""}
        processing={processingPayment}
        onProceed={handleProceedToPay}
      />
    </div>
  );
}

export default function SubscriptionBilling() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gold-solid" />
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}
