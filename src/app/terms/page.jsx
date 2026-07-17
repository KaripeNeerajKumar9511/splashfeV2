"use client";

import LegalDocumentPage from "@/components/legal/LegalDocumentPage";

export default function TermsPage() {
  return (
    <LegalDocumentPage
      type="terms"
      fallbackTitle="Terms & Conditions"
      subtitle="Please read these terms carefully before using Splash AI Studio."
      eyebrow="Terms"
    />
  );
}
