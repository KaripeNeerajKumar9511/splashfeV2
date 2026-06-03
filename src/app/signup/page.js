"use client";

import SignupForm from "@/components/signup-form"
import LoginImage from "@/components/login-image"
import Navigation from "@/components/home/Navigation";
import PortalDeviceGuard from "@/components/portal/PortalDeviceGuard";

export default function SignupPage() {
    return (
        <PortalDeviceGuard>
            <div className="dark min-h-screen bg-surface-gradient">
                <Navigation />
                <main className="pt-20 pb-8 flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <SignupForm />

                        <div className="hidden md:block">
                            <LoginImage />
                        </div>
                    </div>
                </main>
            </div>
        </PortalDeviceGuard>
    )
}
