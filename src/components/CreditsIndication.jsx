"use client";

import Link from "next/link";

/**
 * Soft indication for app wallet / organization credits (not Oops).
 */
export function CreditsIndication({ children, className = "" }) {
  if (!children) return null;

  return (
    <div
      className={className}
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginTop: 12,
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid rgba(201, 168, 76, 0.35)",
        background:
          "linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.04) 100%)",
        color: "#E8D9B8",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <circle cx="12" cy="12" r="9" stroke="#C9A84C" strokeWidth="1.5" />
        <path d="M12 7.5v5" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="15.8" r="1" fill="#C9A84C" />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: "#F0E2C4", marginBottom: 4 }}>
          Not enough credits
        </div>
        <div style={{ color: "#D4C4A8" }}>{children}</div>
        <Link
          href="/dashboard/my-account/billing"
          style={{
            display: "inline-block",
            marginTop: 10,
            color: "#C9A84C",
            fontWeight: 500,
            fontSize: 13,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Recharge credits
        </Link>
      </div>
    </div>
  );
}
