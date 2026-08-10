"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { AI_SERVER_DOWN_EVENT } from "@/lib/aiGenerationGuard";
import { DASHBOARD_CONTACT_PATH } from "@/lib/contactPaths";

const headlineFont = Playfair_Display({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const GOLD = "#C9A84C";
const GOLD_MUTED = "#A8896C";
const GOLD_SOFT = "#8B7355";
const TEXT_MUTED = "#6B635A";
const RED = "#E24B4B";

function ConnectionGraphic() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 280,
        margin: "0 auto",
        padding: "0 4px",
      }}
    >
      {/* AI chip */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            border: `1.5px solid ${GOLD}`,
            background: "#161410",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 20px rgba(201, 168, 76, 0.45)`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
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
        </div>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: GOLD,
            boxShadow: `0 0 8px ${GOLD}`,
          }}
        />
      </div>

      {/* Connection + break */}
      <div
        style={{
          position: "absolute",
          left: 66,
          right: 66,
          top: 28,
          display: "flex",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 2,
            backgroundImage: `repeating-linear-gradient(90deg, ${GOLD} 0 4px, transparent 4px 9px)`,
            boxShadow: `0 0 6px rgba(201, 168, 76, 0.5)`,
          }}
        />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#2A1010",
            border: `2px solid ${RED}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 6px",
            flexShrink: 0,
            boxShadow: `0 0 16px rgba(226, 75, 75, 0.7)`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            height: 2,
            opacity: 0.45,
            backgroundImage: `repeating-linear-gradient(90deg, #6B6560 0 4px, transparent 4px 9px)`,
          }}
        />
      </div>

      {/* Browser / app */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            border: "1.5px solid #5A5550",
            background: "#161410",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3.5" y="4.5" width="21" height="19" rx="3" stroke="#8A8580" strokeWidth="1.5" />
            <path d="M3.5 10h21" stroke="#8A8580" strokeWidth="1.5" />
            <circle cx="7.5" cy="7.2" r="1.1" fill="#6B6560" />
            <circle cx="11" cy="7.2" r="1.1" fill="#6B6560" />
            <circle cx="14.5" cy="7.2" r="1.1" fill="#6B6560" />
            <rect x="8" y="13.5" width="3" height="6.5" rx="0.8" fill="#5A5550" />
            <rect x="12.5" y="12" width="3" height="8" rx="0.8" fill="#5A5550" />
            <rect x="17" y="14.5" width="3" height="5.5" rx="0.8" fill="#5A5550" />
          </svg>
        </div>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#7A7570",
          }}
        />
      </div>
    </div>
  );
}

export function AiServerDownModal({ open, onOpenChange }) {
  const router = useRouter();

  const handleContact = () => {
    onOpenChange(false);
    router.push(DASHBOARD_CONTACT_PATH);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-server-down-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
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
          maxWidth: 420,
          borderRadius: 20,
          border: `1px solid ${GOLD_SOFT}`,
          background: "linear-gradient(165deg, #1A1815 0%, #121110 55%, #0E0D0C 100%)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.72), 0 0 0 1px rgba(168,137,108,0.12)",
          padding: "28px 32px 32px",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        {/* Close */}
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

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <img
            src="/images/SplashLogoPNG.png"
            alt="Splash AI Studio"
            style={{
              height: 56,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <ConnectionGraphic />

        {/* Warning + copy */}
        <div style={{ marginTop: 32, position: "relative" }}>
          <svg
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            style={{ display: "block", margin: "0 auto 12px" }}
          >
            <path
              d="M11 1.8L20.5 18H1.5L11 1.8Z"
              stroke={GOLD}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M11 7.5v5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="11" cy="15.2" r="0.9" fill={GOLD} />
          </svg>

          <h2
            id="ai-server-down-title"
            className={headlineFont.className}
            style={{
              margin: 0,
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            The AI server is down.
          </h2>

          <p
            style={{
              margin: "10px auto 0",
              maxWidth: 300,
              color: TEXT_MUTED,
              fontSize: 13.5,
              lineHeight: 1.55,
              fontWeight: 400,
              fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            }}
          >
            Please try after some time or contact the support team.
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleContact}
          style={{
            marginTop: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "10px 22px",
            borderRadius: 10,
            border: `1.5px solid ${GOLD_MUTED}`,
            background: "transparent",
            color: GOLD_MUTED,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(168, 137, 108, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

export function AiServerDownProvider({ children }) {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const handler = () => show();
    window.addEventListener(AI_SERVER_DOWN_EVENT, handler);
    return () => window.removeEventListener(AI_SERVER_DOWN_EVENT, handler);
  }, [show]);

  return (
    <>
      {children}
      <AiServerDownModal open={open} onOpenChange={setOpen} />
    </>
  );
}
