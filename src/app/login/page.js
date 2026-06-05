"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/login-form";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <main className="dark min-h-screen min-h-[100dvh] bg-surface-gradient flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-solid mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </main>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <AuthPageShell>
            <LoginForm />
        </AuthPageShell>
    );
}
