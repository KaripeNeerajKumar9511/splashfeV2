"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

import AuthPageShell from "@/components/auth/AuthPageShell";
import PortalDeviceGuard from "@/components/portal/PortalDeviceGuard";

const inputClassName =
    "w-full min-h-11 pl-10 pr-10 py-3 text-base sm:text-sm bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            toast.error("Invalid reset link. Please request a new one.");
        }
    }, [searchParams]);

    const validatePassword = (pwd) => pwd.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset link.");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await apiService.resetPassword(token, password);
            setSuccess(true);
            toast.success("Password reset successfully!");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <PortalDeviceGuard>
                <AuthPageShell>
                    <div className="w-full text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            <CheckCircle className="h-8 w-8 text-emerald-400" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            Password Reset Successful!
                        </h2>

                        <p className="text-sm sm:text-base text-muted-foreground mb-8">
                            Your password has been reset successfully. Redirecting you to login…
                        </p>

                        <Link href="/login">
                            <Button
                                variant="brand"
                                className="w-full min-h-11 py-3 h-auto rounded-full font-semibold text-base sm:text-sm"
                            >
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </AuthPageShell>
            </PortalDeviceGuard>
        );
    }

    return (
        <PortalDeviceGuard>
            <AuthPageShell>
                <div className="w-full">
                    <div className="mb-6 sm:mb-8 text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Reset Password
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-semibold text-foreground"
                            >
                                New Password
                            </label>

                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClassName}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={inputClassName}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={
                                        showConfirmPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="brand"
                            disabled={loading || !token}
                            className="w-full min-h-11 py-3 h-auto rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
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
                </div>
            </AuthPageShell>
        </PortalDeviceGuard>
    );
}
