"use client";

import MarketingNav from "@/components/home/MarketingNav";
import ContactPageContent from "@/components/contact/ContactPageContent";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_CONTACT_PATH } from "@/lib/contactPaths";

export default function ContactPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="marketing-page min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#0E0D09] text-[#F2EDD8] [--nav-h:64px] pt-[var(--nav-h)] max-md:[--nav-h:56px]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <MarketingNav />
      <div className="min-h-[calc(100dvh-var(--nav-h))]">
        {isAuthenticated && (
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6">
            <p className="text-sm text-[rgba(242,237,216,0.65)]">
              You&apos;re signed in. You can also use the{" "}
              <Link href={DASHBOARD_CONTACT_PATH} className="text-[#C9A84C] hover:text-[#E8D08A] underline underline-offset-2">
                dashboard contact page
              </Link>
              .
            </p>
          </div>
        )}
        <ContactPageContent variant="marketing" />
      </div>
    </div>
  );
}

