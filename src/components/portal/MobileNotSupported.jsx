"use client";

import Link from "next/link";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Full-screen gate for phone-sized viewports. Layout is tuned for small screens
 * since this is the only portal surface users see on mobile.
 */
export default function MobileNotSupported() {
  const { t } = useLanguage();

  return (
    <div className="dark min-h-screen min-h-[100dvh] bg-surface-gradient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto mb-8 w-20 h-20">
            <div className="absolute inset-0 rounded-2xl bg-gold-solid/15 blur-xl" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-gold-muted shadow-lg">
              <Smartphone className="w-9 h-9 text-muted-foreground/50" />
            </div>
            <div className="absolute -right-3 -bottom-2 flex gap-1">
              <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center shadow-md border border-gold-muted/40">
                <Tablet className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-card border border-gold-muted flex items-center justify-center shadow-md">
                <Monitor className="w-4 h-4 text-gold-solid" />
              </div>
            </div>
          </div>

          <img
            src="/images/SplashLogoPNG.png"
            alt="Splash AI Studio"
            className="h-12 w-auto mx-auto mb-6 object-contain"
          />

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
            {t("portal.mobileTitle")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
            {t("portal.mobileDescription")}
          </p>

          <div className="rounded-xl border border-border bg-card/80 p-4 mb-8 text-left space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-solid">
              {t("portal.mobileSupportedDevices")}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Tablet className="w-4 h-4 shrink-0 text-gold-solid" />
                {t("portal.mobileTablet")}
              </li>
              <li className="flex items-center gap-2">
                <Monitor className="w-4 h-4 shrink-0 text-gold-solid" />
                {t("portal.mobileDesktop")}
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            {t("portal.mobileBackToWebsite")}
          </Link>
        </div>
      </div>
    </div>
  );
}
