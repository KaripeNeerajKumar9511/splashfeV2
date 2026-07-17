"use client";

import LegalDocumentPage from "@/components/legal/LegalDocumentPage";

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      type="privacy"
      fallbackTitle="Privacy Policy"
      subtitle="Your privacy matters to us. Learn how Splash AI Studio collects, uses, and protects your information."
      eyebrow="Privacy"
    />
  );
}
