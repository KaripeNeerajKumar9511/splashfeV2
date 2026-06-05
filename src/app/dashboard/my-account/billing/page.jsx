"use client";

import { useState, useEffect } from "react";
import { Loader2, MessageCircle, Coins } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export const SubscriptionBilling = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState(0);
  const [isOrganizationUser, setIsOrganizationUser] = useState(false);

  useEffect(() => {
    fetchCreditBalance();
  }, [token, user]);

  const fetchCreditBalance = async () => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userProfile = await apiService.getUserProfile(token);
      if (!userProfile?.success || !userProfile?.user) return;

      const currentUser = userProfile.user;
      let organizationId = null;

      if (currentUser?.organization) {
        if (typeof currentUser.organization === "object" && currentUser.organization.id) {
          organizationId = currentUser.organization.id;
        } else if (typeof currentUser.organization === "string") {
          organizationId = currentUser.organization;
        }
      }

      if (organizationId) {
        setIsOrganizationUser(true);
        const orgData = await apiService.getOrganization(organizationId, token);
        if (orgData) {
          setCreditBalance(orgData.credit_balance || 0);
        }
      } else {
        setIsOrganizationUser(false);
        setCreditBalance(currentUser.credit_balance || 0);
      }
    } catch (error) {
      console.error("Failed to fetch credit balance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold-solid" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">
          Need pricing details? Let&apos;s talk.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="p-3 rounded-xl bg-accent border border-gold-muted/30">
            <Coins className="w-6 h-6 text-gold-solid" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {isOrganizationUser ? "Organization credits" : "Your credits"}
            </p>
            <p className="text-2xl font-bold text-foreground">{creditBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto text-center rounded-2xl border border-gold-muted/30 bg-card shadow-lg px-8 py-10">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent border border-gold-muted/30 flex items-center justify-center">
          <MessageCircle className="w-7 h-7 text-gold-solid" strokeWidth={1.75} />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">
          To get more details, please contact us
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-7">
          We&apos;ll help you choose the right plan based on your image volume,
          team size, and business needs.
        </p>

        <Link
          href="/dashboard/help/contact"
          className="inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-gold-gradient text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-md"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBilling;
