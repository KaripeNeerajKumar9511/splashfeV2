"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { OOPS_ERROR_EVENT } from "@/lib/oopsError";
import { getContactPath } from "@/lib/contactPaths";
import { useAuth } from "@/context/AuthContext";

const headlineFont = Playfair_Display({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const GOLD = "#C9A84C";
const GOLD_MUTED = "#B8956A";
const GOLD_SOFT = "#8B7355";
const RED = "#E24B4B";
const TEXT_BODY = "#B8A990";

function AiChipIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="16" height="16" rx="3" stroke={GOLD} strokeWidth="1.6" />
      <rect x="10.5" y="10.5" width="9" height="9" rx="1.5" stroke={GOLD} strokeWidth="1.3" />
      <text x="15" y="17.2" textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
        AI
      </text>
      <path
        d="M11 3.5v3.5M15 3.5v3.5M19 3.5v3.5M11 23v3.5M15 23v3.5M19 23v3.5M3.5 11h3.5M3.5 15h3.5M3.5 19h3.5M23 11h3.5M23 15h3.5M23 19h3.5"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="21" height="19" rx="3" stroke={GOLD} strokeWidth="1.5" />
      <path d="M3.5 10h21" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="7.5" cy="7.2" r="1.1" fill={GOLD_SOFT} />
      <circle cx="11" cy="7.2" r="1.1" fill={GOLD_SOFT} />
      <circle cx="14.5" cy="7.2" r="1.1" fill={GOLD_SOFT} />
      <rect x="8" y="13.5" width="3" height="6.5" rx="0.8" fill={GOLD_SOFT} />
      <rect x="12.5" y="12" width="3" height="8" rx="0.8" fill={GOLD_SOFT} />
      <rect x="17" y="14.5" width="3" height="5.5" rx="0.8" fill={GOLD_SOFT} />
    </svg>
  );
}

function RedX() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2L2 10" stroke={RED} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function OopsConnectionGraphic() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        width: "100%",
        maxWidth: 320,
        margin: "0 auto",
        minHeight: 72,
      }}
    >
      {/* Left AI */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          border: `1.5px solid ${GOLD}`,
          background: "#161410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 18px rgba(201, 168, 76, 0.28)`,
          zIndex: 2,
        }}
      >
        <AiChipIcon />
      </div>

      {/* Line + red X */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 36, maxWidth: 56, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "100%",
            height: 2,
            backgroundImage: `repeating-linear-gradient(90deg, ${GOLD} 0 4px, transparent 4px 9px)`,
          }}
        />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <RedX />
        </div>
      </div>

      {/* Center ! */}
      <div
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `1.5px solid ${GOLD}`,
          background: "#161410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 2,
          boxShadow: `0 0 0 6px rgba(201, 168, 76, 0.08), 0 0 0 12px rgba(201, 168, 76, 0.04), 0 0 24px rgba(201, 168, 76, 0.25)`,
        }}
      >
        <span
          className={headlineFont.className}
          style={{ color: GOLD, fontSize: 28, fontWeight: 600, lineHeight: 1 }}
        >
          !
        </span>
      </div>

      {/* Line + red X */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 36, maxWidth: 56, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "100%",
            height: 2,
            backgroundImage: `repeating-linear-gradient(90deg, ${GOLD} 0 4px, transparent 4px 9px)`,
          }}
        />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <RedX />
        </div>
      </div>

      {/* Right browser */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          border: `1.5px solid ${GOLD}`,
          background: "#161410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 18px rgba(201, 168, 76, 0.28)`,
          zIndex: 2,
        }}
      >
        <BrowserIcon />
      </div>
    </div>
  );
}

function StarDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        margin: "16px auto 14px",
        maxWidth: 220,
      }}
    >
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_SOFT})` }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" fill={GOLD} />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
    </div>
  );
}

export function OopsErrorModal({ open, onOpenChange, showTryAgain, onRetry }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleContact = () => {
    onOpenChange(false);
    router.push(getContactPath(Boolean(isAuthenticated)));
  };

  const handleTryAgain = () => {
    // Capture before close — parent must not wipe the callback mid-click
    const retryFn = onRetry;
    onOpenChange(false);
    if (typeof retryFn === "function") {
      setTimeout(() => {
        try {
          retryFn();
        } catch (e) {
          console.error("Oops retry failed:", e);
        }
      }, 180);
    }
  };

  if (!open) return null;

  const bodyText = showTryAgain
    ? "We're having trouble on our end. Please try again after some time."
    : "We're still having trouble on our end. Please try again after some time.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="oops-error-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 310,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <button
        type="button"
        aria-label="Close overlay"
        onClick={() => onOpenChange(false)}
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(3px)",
          cursor: "pointer",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          borderRadius: 20,
          border: `1px solid ${GOLD_SOFT}`,
          background: "linear-gradient(165deg, #1A1815 0%, #121110 55%, #0E0D0C 100%)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.72), 0 0 40px rgba(201,168,76,0.08), 0 0 0 1px rgba(168,137,108,0.12)",
          padding: "28px 32px 30px",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => onOpenChange(false)}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            color: GOLD_MUTED,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
          <img
            src="/images/SplashLogoPNG.png"
            alt="Splash AI Studio"
            style={{ height: 56, width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>

        <OopsConnectionGraphic />

        <h2
          id="oops-error-title"
          className={headlineFont.className}
          style={{
            margin: "28px 0 0",
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          Oops! Something went wrong.
        </h2>

        <StarDivider />

        <p
          style={{
            margin: "0 auto",
            maxWidth: 320,
            color: TEXT_BODY,
            fontSize: 14,
            lineHeight: 1.55,
            fontWeight: 400,
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          }}
        >
          {bodyText}
        </p>

        {showTryAgain && (
          <button
            type="button"
            onClick={handleTryAgain}
            style={{
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 168,
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              background: `linear-gradient(180deg, #E0C078 0%, ${GOLD} 45%, #A67C3D 100%)`,
              color: "#1A140C",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(201, 168, 76, 0.28)",
            }}
          >
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={handleContact}
          style={{
            marginTop: showTryAgain ? 16 : 26,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: "none",
            background: "transparent",
            color: GOLD_MUTED,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            padding: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 14v-2a8 8 0 1116 0v2M4 14a2 2 0 002 2h1a1 1 0 001-1v-3a1 1 0 00-1-1H6a2 2 0 00-2 2zm16 0a2 2 0 01-2 2h-1a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Contact Support
        </button>
      </div>
    </div>
  );
}

export function OopsErrorProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(true);
  const retryRef = useRef(null);

  const show = useCallback((detail = {}) => {
    retryRef.current = typeof detail.onRetry === "function" ? detail.onRetry : null;
    setShowTryAgain(Boolean(detail.showTryAgain));
    setOpen(true);
  }, []);

  useEffect(() => {
    const handler = (event) => show(event.detail || {});
    window.addEventListener(OOPS_ERROR_EVENT, handler);
    return () => window.removeEventListener(OOPS_ERROR_EVENT, handler);
  }, [show]);

  const runRetry = useCallback(() => {
    const fn = retryRef.current;
    if (typeof fn === "function") {
      fn();
    }
  }, []);

  return (
    <>
      {children}
      <OopsErrorModal
        open={open}
        onOpenChange={setOpen}
        showTryAgain={showTryAgain}
        onRetry={showTryAgain ? runRetry : null}
      />
    </>
  );
}
