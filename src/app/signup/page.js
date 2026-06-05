"use client";

import SignupForm from "@/components/signup-form";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function SignupPage() {
    return (
        <AuthPageShell>
            <SignupForm />
        </AuthPageShell>
    );
}
