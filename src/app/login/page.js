"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/login-form"
import LoginImage from "@/components/login-image"
import Navigation from "@/components/home/Navigation";
import PortalDeviceGuard from "@/components/portal/PortalDeviceGuard";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // Redirect to dashboard if user is already authenticated
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <main className="dark min-h-screen bg-surface-gradient flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-solid mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </main>
        );
    }

    // If authenticated, don't render the login page (redirect will happen)
    if (isAuthenticated) {
        return null;
    }

    return (
        <PortalDeviceGuard>
            <div className="dark min-h-screen bg-surface-gradient">
                <Navigation />
                <main className="pt-20 pb-8 flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <LoginForm />

                        <div className="hidden md:block">
                            <LoginImage />
                        </div>
                    </div>
                </main>
            </div>
        </PortalDeviceGuard>
    )
}
