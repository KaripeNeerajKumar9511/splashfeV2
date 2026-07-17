"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { resolveBillingDestination } from "@/lib/billingAccess";
import { redirectToOrgPayments } from "@/lib/portalSwitch";
import { useLanguage } from "@/context/LanguageContext";
import PhoneCountryInput from "@/components/PhoneCountryInput";
import { SIGNUP_COUNTRIES, buildE164 } from "@/lib/signupCountries";
import {
    clearPersistedMsg91ReqId,
    ensureMsg91Ready,
    hideCaptchaHost,
    isMsg91FrontendConfigured,
    isValidMsg91Mobile,
    mountCaptchaHostInto,
    persistMsg91ReqId,
    readPersistedMsg91ReqId,
    retryMsg91Otp,
    sendMsg91Otp,
    showCaptchaHost,
    toMsg91Identifier,
    verifyMsg91Otp,
} from "@/lib/msg91Otp";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const inputClassName =
    "w-full min-h-11 px-4 py-3 text-base sm:text-sm bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function formatCountdown(seconds) {
    const s = Math.max(0, Number(seconds) || 0);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}

export default function SignupForm() {
    const { t } = useLanguage();
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
    const [country, setCountry] = useState(SIGNUP_COUNTRIES[0]);
    const [phoneNational, setPhoneNational] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [legalContent, setLegalContent] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { establishSession } = useAuth();
    const [step, setStep] = useState("signup");

    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
    const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);
    const [phoneSendLoading, setPhoneSendLoading] = useState(false);
    const [completeLoading, setCompleteLoading] = useState(false);
    const [emailResendIn, setEmailResendIn] = useState(0);
    const [phoneResendIn, setPhoneResendIn] = useState(0);
    const [msg91ReqId, setMsg91ReqId] = useState(null);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);

    useEffect(() => {
        if (emailResendIn <= 0) return undefined;
        const id = setTimeout(() => setEmailResendIn((v) => Math.max(0, v - 1)), 1000);
        return () => clearTimeout(id);
    }, [emailResendIn]);

    useEffect(() => {
        if (phoneResendIn <= 0) return undefined;
        const id = setTimeout(() => setPhoneResendIn((v) => Math.max(0, v - 1)), 1000);
        return () => clearTimeout(id);
    }, [phoneResendIn]);

    // Do not init MSG91 in an effect — init only when Send OTP is clicked.
    // MSG91's script patches timers and breaks Fast Refresh useEffect deps.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const applyStatus = (data = {}) => {
        if (typeof data.is_email_verified === "boolean") setEmailVerified(data.is_email_verified);
        if (typeof data.is_phone_verified === "boolean") setPhoneVerified(data.is_phone_verified);
        if (typeof data.email_resend_available_in === "number") {
            setEmailResendIn(data.email_resend_available_in);
        }
    };

    const getMsg91Mobile = () =>
        toMsg91Identifier(buildE164(country.dial, phoneNational) || phoneNational, country.dial);

    const formatContent = (content) => {
        if (!content) return "";
        const isHTML = /<[a-z][\s\S]*>/i.test(content);
        if (isHTML) return content;
        return content
            .split(/\n\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br/>")}</p>`)
            .join("");
    };

    const handleViewContent = async (type, e) => {
        e?.preventDefault?.();
        setIsDialogOpen(true);
        if (legalContent[type]) {
            setSelectedContent(legalContent[type]);
            return;
        }
        setSelectedContent(null);
        try {
            const data = await apiService.getLegalContent(type);
            const payload = data?.data || data || { title: type, content: "", error: "Unable to load" };
            setLegalContent((prev) => ({ ...prev, [type]: payload }));
            setSelectedContent(payload);
        } catch (err) {
            console.error("Failed to fetch legal content:", err);
            setSelectedContent({ title: type, error: "Unable to load document" });
        }
    };

    const finishLogin = (response) => {
        if (!response?.token || !response?.user) {
            throw new Error(response?.error || "Signup failed. Please try again.");
        }
        setMessage(response.message || "Account created successfully!");
        const sessionUser = establishSession(response.token, response.user, {
            message: "Account created successfully!",
        });

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
    };

    const preparePhoneCaptcha = async () => {
        if (!isMsg91FrontendConfigured()) return;
        const slot = document.getElementById("msg91-captcha-slot");
        if (slot) mountCaptchaHostInto(slot);
        await ensureMsg91Ready();
        showCaptchaHost();
    };

    const sendPhoneOtpViaMsg91 = async () => {
        if (!isMsg91FrontendConfigured()) {
            throw new Error(
                "Phone verification is not configured. Add NEXT_PUBLIC_MSG91_WIDGET_ID and NEXT_PUBLIC_MSG91_TOKEN."
            );
        }
        const mobile = getMsg91Mobile();
        if (!isValidMsg91Mobile(mobile)) {
            throw new Error("Please enter a valid mobile number");
        }
        setPhoneSendLoading(true);
        try {
            await preparePhoneCaptcha();
            const { reqId } = await sendMsg91Otp(mobile);
            setMsg91ReqId(reqId);
            persistMsg91ReqId(reqId);
            setPhoneOtpSent(true);
            setPhoneResendIn(120);
            setPhoneOtp("");
            hideCaptchaHost();
            return reqId;
        } finally {
            setPhoneSendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

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
        if (!country?.dial || !phoneNational) {
            setMessage("Please enter a valid mobile number with country code");
            setLoading(false);
            return;
        }

        const phone_e164 = buildE164(country.dial, phoneNational);
        if (!phone_e164 || phone_e164.length < 8) {
            setMessage("Please enter a valid mobile number");
            setLoading(false);
            return;
        }

        const msg91Mobile = getMsg91Mobile();
        if (!isValidMsg91Mobile(msg91Mobile)) {
            setMessage("Please enter a valid mobile number");
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
                fromPricing ? "pricing" : "direct",
                {
                    phone_e164,
                    phone_country_code: country.dial,
                    phone_national: phoneNational,
                }
            );

            applyStatus(response);
            setStep("otp");
            setMsg91ReqId(null);
            setPhoneOtpSent(false);
            if (!response?.is_email_verified) setEmailResendIn(response?.email_resend_available_in || 120);

            setMessage(
                response?.is_email_verified
                    ? "Complete phone verification to continue."
                    : "Email OTP sent. Complete captcha and send OTP to your phone."
            );

            // Mount captcha for the phone row (do not auto-send — user clicks Send OTP)
            await new Promise((resolve) => {
                const start = Date.now();
                const tick = () => {
                    if (document.getElementById("msg91-captcha-slot") || Date.now() - start > 3000) {
                        resolve();
                        return;
                    }
                    setTimeout(tick, 40);
                };
                setTimeout(tick, 40);
            });
            try {
                await preparePhoneCaptcha();
            } catch (captchaErr) {
                console.warn("MSG91 captcha prepare failed:", captchaErr);
            }
        } catch (err) {
            const msg = err.message || "";
            if (
                msg.toLowerCase().includes("already exists") ||
                msg.toLowerCase().includes("already taken") ||
                msg.toLowerCase().includes("already registered")
            ) {
                setMessage(msg);
            } else {
                setMessage(msg || "Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!emailOtp || emailOtp.length !== 6) {
            setMessage("Please enter a valid 6-digit email OTP");
            return;
        }
        setEmailVerifyLoading(true);
        setMessage("");
        try {
            const response = await apiService.verifyEmailOtp(formData.email, emailOtp);
            applyStatus(response);
            setMessage(response.message || "Email verified successfully");
        } catch (err) {
            setMessage(err.message || "Failed to verify email OTP");
        } finally {
            setEmailVerifyLoading(false);
        }
    };

    const handleVerifyPhone = async () => {
        const code = String(phoneOtp || "").trim();
        if (!code || code.length < 4 || code.length > 8) {
            setMessage("Please enter the phone OTP you received");
            return;
        }
        const reqId = msg91ReqId || readPersistedMsg91ReqId();
        if (!reqId) {
            setMessage("Missing OTP request. Please tap Resend SMS OTP, then verify again.");
            return;
        }
        setPhoneVerifyLoading(true);
        setMessage("");
        try {
            if (!msg91ReqId) setMsg91ReqId(reqId);
            const { accessToken } = await verifyMsg91Otp(code, reqId);
            const mobile = getMsg91Mobile();
            const response = await apiService.verifyPhoneOtp(formData.email, accessToken, mobile);
            applyStatus(response);
            setMessage(response.message || "Phone verified successfully");
            setMsg91ReqId(null);
            clearPersistedMsg91ReqId();
        } catch (err) {
            setMessage(err.message || "Invalid or expired OTP.");
        } finally {
            setPhoneVerifyLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (emailResendIn > 0 || emailVerified) return;
        setMessage("");
        try {
            const response = await apiService.resendEmailOtp(formData.email);
            applyStatus(response);
            setEmailResendIn(response?.email_resend_available_in || 120);
            setMessage(response.message || "OTP resent to your email");
            setEmailOtp("");
        } catch (err) {
            const wait = err?.status === 400 ? emailResendIn : 0;
            if (String(err.message || "").includes("wait")) {
                const match = String(err.message).match(/(\d+)\s*seconds/);
                if (match) setEmailResendIn(Number(match[1]));
            }
            setMessage(err.message || "Failed to resend email OTP");
            if (wait) setEmailResendIn(wait);
        }
    };

    const handleResendPhone = async () => {
        if (phoneResendIn > 0 || phoneVerified) return;
        setMessage("");
        setPhoneSendLoading(true);
        try {
            if (msg91ReqId) {
                const { reqId } = await retryMsg91Otp(msg91ReqId, "11");
                setMsg91ReqId(reqId);
                setPhoneOtpSent(true);
                setPhoneResendIn(120);
                setPhoneOtp("");
                setMessage("OTP resent successfully.");
            } else {
                // Need captcha again for a fresh send
                setPhoneOtpSent(false);
                await new Promise((r) => setTimeout(r, 50));
                await sendPhoneOtpViaMsg91();
                setMessage("OTP sent successfully.");
            }
        } catch (err) {
            if (msg91ReqId) {
                try {
                    setPhoneOtpSent(false);
                    await new Promise((r) => setTimeout(r, 50));
                    await sendPhoneOtpViaMsg91();
                    setMessage("OTP sent successfully.");
                    return;
                } catch (sendErr) {
                    setMessage(sendErr.message || err.message || "Unable to resend OTP.");
                    return;
                }
            }
            setMessage(err.message || "Unable to resend OTP.");
        } finally {
            setPhoneSendLoading(false);
        }
    };

    const handleCompleteSignup = async () => {
        if (!emailVerified || !phoneVerified) {
            setMessage("Please verify both email and phone before signing up");
            return;
        }
        setCompleteLoading(true);
        setMessage("");
        try {
            const response = await apiService.completeSignup(formData.email);
            finishLogin(response);
        } catch (err) {
            setMessage(err.message || "Failed to create account. Please try again.");
        } finally {
            setCompleteLoading(false);
        }
    };

    const bothVerified = emailVerified && phoneVerified;
    const phoneDisplay = buildE164(country.dial, phoneNational) || "your phone";

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-8 text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {step === "signup" ? t("auth.signup") : "Verification"}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    {step === "signup"
                        ? t("auth.createAccount")
                        : "Verify your email and mobile to finish signup"}
                </p>
            </div>

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

                    <PhoneCountryInput
                        countryCode={country.code}
                        nationalNumber={phoneNational}
                        onCountryChange={setCountry}
                        onNationalChange={setPhoneNational}
                        inputClassName={inputClassName}
                    />

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
                        {loading ? "Sending codes..." : "Go to verification"}
                    </Button>
                </form>
            ) : (
                <div className="space-y-7">
                    {/* Email — label, address, then OTP + Verify row */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-semibold text-foreground">Email</label>
                            {emailVerified ? (
                                <span className="text-xs font-medium text-green-400">Verified</span>
                            ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{formData.email}</p>
                        {!emailVerified ? (
                            <>
                                <div className="flex items-stretch gap-2">
                                    <Input
                                        type="text"
                                        value={emailOtp}
                                        onChange={(e) =>
                                            setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                        }
                                        maxLength={6}
                                        placeholder="Enter OTP"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className={`${inputClassName} flex-1 tracking-[0.3em]`}
                                    />
                                    <Button
                                        type="button"
                                        variant="brand"
                                        disabled={emailVerifyLoading || emailOtp.length !== 6}
                                        onClick={handleVerifyEmail}
                                        className="shrink-0 min-h-11 px-5 py-3 h-auto font-semibold rounded-lg"
                                    >
                                        {emailVerifyLoading ? "..." : "Verify"}
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <button
                                        type="button"
                                        onClick={handleResendEmail}
                                        disabled={emailResendIn > 0 || emailVerifyLoading}
                                        className="text-gold-solid hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                                    >
                                        {emailResendIn > 0
                                            ? `Resend in ${formatCountdown(emailResendIn)}`
                                            : "Resend email OTP"}
                                    </button>
                                </p>
                            </>
                        ) : null}
                    </div>

                    <div className="h-px bg-border/60" />

                    {/* Mobile — captcha + Send OTP, then OTP + Verify */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-semibold text-foreground">Mobile</label>
                            {phoneVerified ? (
                                <span className="text-xs font-medium text-green-400">Verified</span>
                            ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{phoneDisplay}</p>

                        {!phoneVerified ? (
                            <>
                                {/* Single persistent captcha slot — never remount after MSG91 init */}
                                <div
                                    className={
                                        phoneOtpSent
                                            ? "h-0 overflow-hidden opacity-0 pointer-events-none"
                                            : "flex items-center gap-2"
                                    }
                                    aria-hidden={phoneOtpSent}
                                >
                                    <div
                                        id="msg91-captcha-slot"
                                        className="min-h-[78px] flex-1 overflow-hidden max-w-full rounded-lg"
                                    />
                                    {!phoneOtpSent ? (
                                        <Button
                                            type="button"
                                            variant="brand"
                                            disabled={phoneSendLoading}
                                            onClick={async () => {
                                                setMessage("");
                                                try {
                                                    await sendPhoneOtpViaMsg91();
                                                    setMessage("OTP sent successfully.");
                                                } catch (err) {
                                                    setMessage(err.message || "Failed to send SMS OTP");
                                                }
                                            }}
                                            className="shrink-0 min-h-11 px-4 py-3 h-auto font-semibold rounded-lg self-center"
                                        >
                                            {phoneSendLoading ? "Sending..." : "Send OTP"}
                                        </Button>
                                    ) : null}
                                </div>

                                {phoneOtpSent ? (
                                    <>
                                        <div className="flex items-stretch gap-2">
                                            <Input
                                                type="text"
                                                value={phoneOtp}
                                                onChange={(e) =>
                                                    setPhoneOtp(
                                                        e.target.value.replace(/\D/g, "").slice(0, 8)
                                                    )
                                                }
                                                maxLength={8}
                                                placeholder="Enter OTP"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                className={`${inputClassName} flex-1 tracking-[0.3em]`}
                                            />
                                            <Button
                                                type="button"
                                                variant="brand"
                                                disabled={phoneVerifyLoading || phoneOtp.length < 4}
                                                onClick={handleVerifyPhone}
                                                className="shrink-0 min-h-11 px-5 py-3 h-auto font-semibold rounded-lg"
                                            >
                                                {phoneVerifyLoading ? "..." : "Verify"}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <button
                                                type="button"
                                                onClick={handleResendPhone}
                                                disabled={
                                                    phoneResendIn > 0 ||
                                                    phoneVerifyLoading ||
                                                    phoneSendLoading
                                                }
                                                className="text-gold-solid hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                                            >
                                                {phoneResendIn > 0
                                                    ? `Resend in ${formatCountdown(phoneResendIn)}`
                                                    : phoneSendLoading
                                                      ? "Sending..."
                                                      : "Resend SMS OTP"}
                                            </button>
                                        </p>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </div>

                    {bothVerified && (
                        <Button
                            type="button"
                            variant="brand"
                            disabled={completeLoading}
                            onClick={handleCompleteSignup}
                            className="w-full min-h-11 py-3 h-auto font-semibold rounded-full text-base sm:text-sm"
                        >
                            {completeLoading ? "Creating account..." : "Sign up"}
                        </Button>
                    )}

                    <button
                        type="button"
                        onClick={() => setStep("signup")}
                        className="text-sm text-muted-foreground hover:text-foreground block mx-auto"
                    >
                        Back
                    </button>
                </div>
            )}

            {message && (
                <p
                    className={`mt-4 text-center text-sm break-words px-1 ${
                        message.toLowerCase().includes("success") ||
                        message.toLowerCase().includes("sent") ||
                        message.toLowerCase().includes("verified") ||
                        message.toLowerCase().includes("resent")
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="z-[200] w-[calc(100vw-2rem)] max-w-3xl max-h-[min(85dvh,720px)] overflow-y-auto bg-card border-border p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-left pr-8">
                            {selectedContent?.title || t("legal.legalDocument")}
                        </DialogTitle>
                        <DialogDescription className="text-left">{t("legal.readCarefully")}</DialogDescription>
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
