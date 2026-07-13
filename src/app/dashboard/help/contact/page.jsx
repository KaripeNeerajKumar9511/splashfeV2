"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import ContactPageContent from "@/components/contact/ContactPageContent";

export default function DashboardContactPage() {
  const { token, user } = useAuth();
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiService
      .getUserProfile(token)
      .then((res) => {
        const u = res?.user;
        setProfileName(u?.full_name || u?.username || "");
        setProfileEmail(u?.email || "");
      })
      .catch(() => {
        setProfileName(user?.full_name || user?.username || "");
        setProfileEmail(user?.email || "");
      })
      .finally(() => setLoading(false));
  }, [token, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold-solid" />
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div className="border-b border-sidebar-border pb-5 mb-2">
        <p className="text-xs uppercase tracking-wider text-gold-solid font-medium">Help & Learning</p>
        <h1 className="text-2xl font-semibold text-foreground mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Contact Us
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reach out for custom plans, support, or enterprise inquiries.
        </p>
      </div>
      <ContactPageContent
        variant="portal"
        showHeader={false}
        defaultName={profileName}
        defaultEmail={profileEmail}
      />
    </div>
  );
}
