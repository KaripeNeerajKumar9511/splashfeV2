"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

import AuthPageShell from "@/components/auth/AuthPageShell";
import PortalDeviceGuard from "@/components/portal/PortalDeviceGuard";

const inputClassName =
    "w-full min-h-11 pl-10 pr-4 py-3 text-base sm:text-sm bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiService.forgotPassword(email);
            setSubmitted(true);
            toast.success("Password reset link sent to your email!");
        } catch (error) {
            toast.error(error.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortalDeviceGuard>
            <AuthPageShell>
                <div className="w-full">
                    {!submitted ? (
                        <>
                            <div className="mb-6 sm:mb-8 text-left">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    Forgot Password?
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                                    Enter your email address and we&apos;ll send you a link to reset
                                    your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-foreground"
                                    >
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Example@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            inputMode="email"
                                            className={inputClassName}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="brand"
                                    className="w-full min-h-11 py-3 h-auto rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>

                            <div className="mt-6 sm:mt-8 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-gold-solid hover:brightness-110 transition-opacity touch-manipulation"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-solid/15 border border-gold-muted/40">
                                <Mail className="h-8 w-8 text-gold-solid" />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                Check Your Email
                            </h2>

                            <p className="text-sm sm:text-base text-muted-foreground mb-2">
                                We&apos;ve sent a password reset link to{" "}
                                <span className="font-semibold text-foreground">{email}</span>
                            </p>

                            <p className="text-sm text-muted-foreground mb-8">
                                Please check your inbox and click the link to reset your password.
                            </p>

                            <div className="space-y-4">
                                <p className="text-sm text-foreground/80">
                                    Didn&apos;t receive the email? Check spam or try again.
                                </p>

                                <Button
                                    onClick={() => setSubmitted(false)}
                                    variant="outline"
                                    className="w-full min-h-11 rounded-full border-2 border-gold-muted bg-card/80 text-foreground font-semibold hover:bg-gold-solid/10 hover:border-gold-solid hover:text-foreground"
                                >
                                    Try Another Email
                                </Button>

                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gold-solid hover:brightness-110 transition-opacity touch-manipulation"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </AuthPageShell>
        </PortalDeviceGuard>
    );
}
