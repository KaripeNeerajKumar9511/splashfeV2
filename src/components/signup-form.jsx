"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { resolveBillingDestination } from "@/lib/billingAccess";
import { redirectToOrgPayments } from "@/lib/portalSwitch";
import { useLanguage } from "@/context/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const inputClassName =
    "w-full min-h-11 px-4 py-3 text-base sm:text-sm bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function SignupForm() {
    const { language, changeLanguage, t } = useLanguage();
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        acceptTerms: false,
        acceptPrivacy: false,
        acceptGDPR: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [legalContent, setLegalContent] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { establishSession } = useAuth();
    const [step, setStep] = useState("signup");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const formatContent = (content) => {
        if (!content) return '';

        // Check if content is already HTML (contains HTML tags)
        const isHTML = /<[a-z][\s\S]*>/i.test(content);

        if (isHTML) {
            // Content is already HTML, return as-is
            return content;
        } else {
            // Content is plain text, convert line breaks to HTML
            // Convert double line breaks to paragraphs
            let formatted = content
                .split(/\n\n+/)
                .map(paragraph => paragraph.trim())
                .filter(paragraph => paragraph.length > 0)
                .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`)
                .join('');

            // If no paragraphs were created, treat single line breaks as <br>
            if (!formatted) {
                formatted = content.replace(/\n/g, '<br/>');
            }

            return formatted;
        }
    };

    const handleViewContent = async (contentType, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const titleKey =
            contentType === "terms"
                ? t("signup.termsAndConditions")
                : t("signup.privacyPolicy");

        setSelectedContent({
            type: contentType,
            title: titleKey,
            content: null,
        });
        setIsDialogOpen(true);
        setMessage("");

        try {
            const response = await apiService.getLegalContent(contentType);
            if (response && response.success && response.content) {
                setSelectedContent({
                    type: contentType,
                    title: response.content.title,
                    content: response.content.content,
                });
            } else {
                throw new Error("No content returned");
            }
        } catch (err) {
            console.error("Failed to fetch legal content:", err);
            setSelectedContent({
                type: contentType,
                title: titleKey,
                content: null,
                error: t("legal.failedToLoad"),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (formData.password !== formData.confirm_password) {
            setMessage(t("auth.passwordsNotMatch"));
            setLoading(false);
            return;
        }

        if (!formData.acceptTerms) {
            setMessage(t("auth.acceptAllTerms") || "Please accept all terms and conditions to continue");
            setLoading(false);
            return;
        }

        try {
            const redirectTo = searchParams.get("redirect");
            const fromPricing = Boolean(
                redirectTo &&
                (redirectTo.includes("/dashboard/my-account/billing") || /[?&]plan=/.test(redirectTo))
            );

            const response = await apiService.register(
                formData.full_name,
                formData.username,
                formData.email,
                formData.password,
                fromPricing ? "pricing" : "direct"
            );

            setStep("otp");
            setMessage(
                response?.email_sent === false
                    ? (response?.message || "Account created, but we couldn't send the verification email. Use Resend OTP to try again.")
                    : (response?.message || t("auth.otpSent"))
            );

        } catch (err) {
            const msg = err.message || "";
            if (msg.toLowerCase().includes("already exists") && msg.toLowerCase().includes("log in")) {
                setMessage(msg);
            } else if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("already taken")) {
                setMessage(`${msg} Try logging in or use a different email/username.`);
            } else {
                setMessage(msg || "Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setMessage(t("auth.pleaseEnterValidOtp") || "Please enter a valid 6-digit OTP");
            return;
        }

        setOtpLoading(true);
        setMessage("");

        try {
            const response = await apiService.verifyEmailOtp(
                formData.email,
                otp
            );

            if (response?.token && response?.user) {
                setMessage(response.message || t("auth.emailVerified") || "Email verified successfully!");
                const sessionUser = establishSession(response.token, response.user, { message: "Account created successfully!" });

                const redirectTo = searchParams.get("redirect");
                const planMatch = redirectTo?.match(/[?&]plan=([^&]+)/);
                const planId = planMatch?.[1] || "starter";

                setTimeout(() => {
                    if (!sessionUser.profile_completed) {
                        router.push("/complete-profile");
                        return;
                    }

                    const dest = resolveBillingDestination(sessionUser, planId);
                    if (dest.type === "org_owner") {
                        redirectToOrgPayments(planId);
                    } else if (dest.blocked) {
                        router.push("/dashboard/my-account/billing");
                    } else if (redirectTo && redirectTo.startsWith("/")) {
                        router.push(redirectTo);
                    } else {
                        router.push(dest.path);
                    }
                }, 800);
            } else if (response && response.message) {
                throw new Error(response.error || t("auth.invalidOtp") || "Invalid OTP");
            } else {
                throw new Error(response?.error || t("auth.invalidOtp") || "Invalid OTP");
            }

        } catch (err) {
            console.error("OTP verification error:", err);
            const errorMessage = err.message || err.response?.data?.error || t("auth.invalidOtp") || "Failed to verify OTP. Please try again.";
            setMessage(errorMessage);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtpLoading(true);
        setMessage("");

        try {
            const response = await apiService.resendEmailOtp(formData.email);

            if (response && (response.success || response.message)) {
                setMessage(response.message || t("auth.otpResent") || "OTP has been resent to your email");
                // Clear the OTP input
                setOtp("");
            } else {
                throw new Error(response?.error || t("auth.failedToResendOtp") || "Failed to resend OTP");
            }
        } catch (err) {
            console.error("Resend OTP error:", err);
            const errorMessage = err.message || err.response?.data?.error || t("auth.failedToResendOtp") || "Failed to resend OTP. Please try again.";
            setMessage(errorMessage);
        } finally {
            setOtpLoading(false);
        }
    };



    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-8 text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">{t("auth.signup")}</h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t("auth.createAccount")}</p>
            </div>

            {/* Language Selector */}
            {/* <div className="mb-6">
                <Label className="block text-sm font-semibold text-foreground mb-2">
                    {t("signup.selectLanguage")}
                </Label>
                <Select value={language} onValueChange={changeLanguage}>
                    <SelectTrigger className="w-full bg-input border border-input">
                        <SelectValue placeholder={t("signup.selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">{t("common.english")}</SelectItem>
                        <SelectItem value="es">{t("common.spanish")}</SelectItem>
                    </SelectContent>
                </Select>
            </div> */}
            {step === "signup" ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{t("auth.fullName")}</label>
                        <Input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder={t("auth.johnDoe")}
                            autoComplete="name"
                            required
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{t("auth.username")}</label>
                        <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder={t("auth.johndoe123")}
                            autoComplete="username"
                            required
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{t("auth.email")}</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("auth.exampleEmail")}
                            autoComplete="email"
                            inputMode="email"
                            required
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{t("auth.password")}</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t("auth.atLeast8Chars")}
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className={inputClassName}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{t("auth.confirmPassword")}</label>
                        <Input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder={t("auth.confirmYourPassword")}
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className={inputClassName}
                        />
                    </div>

                    {/* Legal Compliance */}
                    <div className="pt-2">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                required
                                className="mt-0.5 h-5 w-5 shrink-0 accent-[#cd9639] border-border rounded focus:ring-ring"
                            />
                            <div className="min-w-0 text-sm text-muted-foreground leading-relaxed">
                                <label htmlFor="acceptTerms" className="cursor-pointer">
                                    {t("signup.agreeTo")}
                                </label>{" "}
                                <button
                                    type="button"
                                    onClick={(e) => handleViewContent("terms", e)}
                                    className="text-gold-solid font-semibold underline underline-offset-2 touch-manipulation py-0.5"
                                >
                                    {t("signup.termsAndConditions")}
                                </button>{" "}
                                <span className="text-muted-foreground">&</span>{" "}
                                <button
                                    type="button"
                                    onClick={(e) => handleViewContent("privacy", e)}
                                    className="text-gold-solid font-semibold underline underline-offset-2 touch-manipulation py-0.5"
                                >
                                    {t("signup.privacyPolicy")}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="brand"
                        disabled={loading}
                        className="w-full min-h-11 py-3 h-auto font-semibold rounded-full text-base sm:text-sm"
                    >
                        {loading ? t("auth.signingUp") : t("auth.signup")}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {t("auth.verifyEmail")}
                    </h2>

                    <p className="text-sm text-muted-foreground break-words">
                        {t("auth.otpSentTo")} <strong>{formData.email}</strong>
                    </p>

                    <Input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        placeholder={t("auth.enterOtp")}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className={`${inputClassName} text-center tracking-widest text-lg`}
                        required
                    />

                    <Button
                        type="submit"
                        variant="brand"
                        disabled={otpLoading || otp.length !== 6}
                        className="w-full min-h-11 py-3 h-auto font-semibold rounded-full text-base sm:text-sm"
                    >
                        {otpLoading ? t("auth.verifying") : t("auth.verifyOtp")}
                    </Button>

                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpLoading}
                        className="text-sm text-gold-solid hover:underline block mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {otpLoading ? t("auth.sending") || "Sending..." : t("auth.resendOtp") || "Resend OTP"}
                    </button>
                </form>
            )}

            {message && (
                <p className={`mt-4 text-center text-sm break-words px-1 ${message.includes("successfully") || message.includes("sent") || message.includes("verified")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}>
                    {message}
                </p>
            )}

            {step === "signup" && (
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    {t("auth.alreadyHaveAccount")}{" "}
                    <Link href="/login" className="font-semibold text-gold-solid hover:opacity-80">
                        {t("auth.login")}
                    </Link>
                </p>
            </div>
            )}

            {/* Legal Content Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="z-[200] w-[calc(100vw-2rem)] max-w-3xl max-h-[min(85dvh,720px)] overflow-y-auto bg-card border-border p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-left pr-8">
                            {selectedContent?.title || t("legal.legalDocument")}
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            {t("legal.readCarefully")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 sm:mt-4">
                        {selectedContent?.error ? (
                            <p className="text-sm text-red-400">{selectedContent.error}</p>
                        ) : selectedContent?.content ? (
                            <div
                                className="prose prose-sm max-w-none text-muted-foreground prose-invert prose-p:leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: formatContent(selectedContent.content),
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-muted border-t-gold-solid" />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
