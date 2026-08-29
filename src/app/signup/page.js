"use client";

import { Suspense } from "react";
import SignupForm from "@/components/signup-form";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { prefetchAuthPageContent } from "@/components/auth/AuthPageContent";

if (typeof window !== "undefined") {
    prefetchAuthPageContent();
}

function SignupFormWrapper() {
    return <SignupForm />;
}

export default function SignupPage() {
    return (
        <AuthPageShell>
            <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                <SignupFormWrapper />
            </Suspense>
        </AuthPageShell>
    );
}
