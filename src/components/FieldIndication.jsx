"use client";

/**
 * Soft field/form indication — not an error banner.
 * Use for validation hints (missing upload, required selection, etc.).
 */
export function FieldIndication({ children, className = "" }) {
  if (!children) return null;

  return (
    <div
      className={className}
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        marginTop: 12,
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(201, 168, 76, 0.28)",
        background: "rgba(201, 168, 76, 0.08)",
        color: "#D4C4A8",
        fontSize: 13.5,
        lineHeight: 1.45,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <circle cx="8" cy="8" r="6.5" stroke="#C9A84C" strokeWidth="1.3" />
        <path d="M8 4.8v4.2" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="11.2" r="0.85" fill="#C9A84C" />
      </svg>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}
