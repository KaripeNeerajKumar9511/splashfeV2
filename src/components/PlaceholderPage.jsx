"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Reusable placeholder for pages not yet built.
 * Replace the route's page content when the real page is ready.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <main className="min-h-screen bg-card flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">
          {description || "This page is coming soon. We're working on it."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gold-solid hover:text-gold-to font-medium"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </div>
    </main>
  );
}
