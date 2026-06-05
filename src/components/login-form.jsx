"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePortalDevice } from "@/hooks/usePortalDevice";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const inputClassName =
    "w-full min-h-11 px-4 py-3 text-base sm:text-sm bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function LoginForm() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const device = usePortalDevice();
    const showMobileBlock = device.ready && device.isMobile;

    const handleSignIn = async (e) => {
        e.preventDefault();
        setMessage("");

        if (showMobileBlock) {
            return;
        }

        if (!email.trim() || !password) {
            setMessage(t("auth.loginFailed"));
            return;
        }

        setLoading(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            setMessage(t("auth.loginFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 sm:mb-8 text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {t("auth.login")}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    {t("auth.stayConnected")}
                </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-foreground"
                    >
                        {t("auth.email")}
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.exampleEmail")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClassName}
                        autoComplete="email"
                        inputMode="email"
                        required
                        disabled={showMobileBlock}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-foreground"
                    >
                        {t("auth.password")}
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder={t("auth.atLeast8Chars")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClassName}
                        autoComplete="current-password"
                        required
                        disabled={showMobileBlock}
                    />
                </div>

                {!showMobileBlock && (
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-gold-solid hover:brightness-110 transition-opacity touch-manipulation"
                        >
                            {t("auth.forgotPassword")}
                        </Link>
                    </div>
                )}

                {showMobileBlock && (
                    <div
                        role="alert"
                        className="rounded-xl border border-gold-muted/50 bg-card/90 p-4 sm:p-5 space-y-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-solid/15 border border-gold-muted/40">
                                <Smartphone className="h-5 w-5 text-gold-solid" />
                            </div>
                            <div className="min-w-0 space-y-1.5 text-left">
                                <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                                    {t("auth.mobileLoginTitle")}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t("auth.mobileLoginBlocked")}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border/80 bg-background/40 p-3 space-y-2.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gold-solid">
                                {t("portal.mobileSupportedDevices")}
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2.5">
                                    <Tablet className="w-4 h-4 shrink-0 text-gold-solid" />
                                    <span>{t("portal.mobileTablet")}</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <Monitor className="w-4 h-4 shrink-0 text-gold-solid" />
                                    <span>{t("portal.mobileDesktop")}</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground text-center">
                            {t("auth.mobileLoginHint")}
                        </p>
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400 break-words">{message}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="brand"
                    className="w-full min-h-11 py-3 h-auto rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                    disabled={loading || showMobileBlock}
                >
                    {loading ? t("auth.signingIn") : t("auth.signin")}
                </Button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    {t("auth.dontHaveAccount")}{" "}
                    <Link href="/signup" className="font-semibold text-gold-solid hover:brightness-110 touch-manipulation">
                        {t("auth.signup")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
