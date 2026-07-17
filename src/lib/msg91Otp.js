/**
 * MSG91 Web SDK helpers for custom OTP UI (no default popup).
 *
 * Important:
 * - initSendOTP must run exactly once
 * - never call hcaptcha.reset() before send (causes "already rendered" / network-error)
 * - captcha host lives on document.body and is never destroyed
 */

const MSG91_SCRIPT_SRC = "https://verify.msg91.com/otp-provider.js";
const SCRIPT_ID = "msg91-otp-provider";
export const MSG91_CAPTCHA_HOST_ID = "msg91-captcha-host";

function getConfig() {
  const widgetId = (process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || "").trim();
  const tokenAuth = (process.env.NEXT_PUBLIC_MSG91_TOKEN || "").trim();
  return { widgetId, tokenAuth };
}

export function isMsg91FrontendConfigured() {
  const { widgetId, tokenAuth } = getConfig();
  return Boolean(widgetId && tokenAuth);
}

export function toMsg91Identifier(phoneOrE164, dialCode = "") {
  const raw = String(phoneOrE164 || "").replace(/\D/g, "");
  if (!raw) return "";
  const dialDigits = String(dialCode || "").replace(/\D/g, "");
  if (raw.length >= 11) return raw;
  if (dialDigits && raw.length >= 8) return `${dialDigits}${raw}`;
  if (raw.length === 10) return `91${raw}`;
  return raw;
}

export function isValidMsg91Mobile(identifier) {
  const digits = String(identifier || "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return false;
  if (digits.startsWith("91") && digits.length === 12) {
    return /^91[6-9]\d{9}$/.test(digits);
  }
  return true;
}

export function getOrCreateCaptchaHost() {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(MSG91_CAPTCHA_HOST_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = MSG91_CAPTCHA_HOST_ID;
    el.setAttribute("data-msg91-captcha", "true");
    el.style.maxWidth = "100%";
    el.style.overflow = "hidden";
    document.body.appendChild(el);
  }
  return el;
}

/** Place captcha host into a slot once. Never move after MSG91 has initialized. */
export function mountCaptchaHostInto(container) {
  const host = getOrCreateCaptchaHost();
  if (!host || !container) return host;
  if (window.__msg91WidgetInitialized) {
    // Already initialized — only ensure visibility; do not move DOM (breaks hCaptcha)
    if (host.parentElement !== container && !host.querySelector("iframe")) {
      container.appendChild(host);
    }
    showCaptchaHost();
    return host;
  }
  if (host.parentElement !== container) {
    container.appendChild(host);
  }
  showCaptchaHost();
  return host;
}

export function showCaptchaHost() {
  const host = document.getElementById(MSG91_CAPTCHA_HOST_ID);
  if (!host) return;
  host.style.visibility = "visible";
  host.style.height = "";
  host.style.opacity = "1";
  host.style.pointerEvents = "auto";
  host.style.display = "block";
}

export function hideCaptchaHost() {
  const host = document.getElementById(MSG91_CAPTCHA_HOST_ID);
  if (!host) return;
  // Do not use display:none after render — it can break hCaptcha widgets
  host.style.visibility = "hidden";
  host.style.height = "0px";
  host.style.opacity = "0";
  host.style.pointerEvents = "none";
  host.style.overflow = "hidden";
}

function loadMsg91Script() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("MSG91 can only load in the browser"));
  }
  if (typeof window.initSendOTP === "function") {
    return Promise.resolve();
  }
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (typeof window.initSendOTP === "function") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load MSG91 script")),
        { once: true }
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = MSG91_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MSG91 verification script"));
    document.body.appendChild(script);
  });
}

function waitForMethods(timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (
        typeof window.sendOtp === "function" &&
        typeof window.verifyOtp === "function" &&
        typeof window.retryOtp === "function"
      ) {
        resolve(true);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        resolve(false);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

let initPromise = null;

/**
 * Initialize MSG91 once. Call only when the captcha slot is already in the DOM.
 */
export async function ensureMsg91Ready() {
  const { widgetId, tokenAuth } = getConfig();
  if (!widgetId || !tokenAuth) {
    throw new Error(
      "MSG91 is not configured. Set NEXT_PUBLIC_MSG91_WIDGET_ID and NEXT_PUBLIC_MSG91_TOKEN."
    );
  }

  if (window.__msg91WidgetInitialized) {
    const ready = await waitForMethods(8000);
    if (!ready) {
      throw new Error("MSG91 OTP methods are not ready. Please refresh and try again.");
    }
    return true;
  }

  if (initPromise) return initPromise;

  initPromise = (async () => {
    await loadMsg91Script();
    getOrCreateCaptchaHost();

    if (window.__msg91WidgetInitialized) return true;
    if (typeof window.initSendOTP !== "function") {
      throw new Error("MSG91 script loaded but initSendOTP is missing");
    }

    window.initSendOTP({
      widgetId,
      tokenAuth,
      exposeMethods: true,
      captchaRenderId: MSG91_CAPTCHA_HOST_ID,
      success: () => {},
      failure: () => {},
    });
    window.__msg91WidgetInitialized = true;

    const ready = await waitForMethods(8000);
    if (!ready) {
      // Keep initialized flag — re-calling initSendOTP causes "already rendered"
      throw new Error("MSG91 OTP methods are not ready. Please refresh and try again.");
    }
    return true;
  })().catch((err) => {
    // Allow retry only if init never completed
    if (!window.__msg91WidgetInitialized) {
      initPromise = null;
    }
    throw err;
  });

  return initPromise;
}

const REQ_ID_STORAGE_KEY = "msg91_signup_req_id";

function extractReqId(data) {
  if (!data) return null;
  if (typeof data === "string") {
    const value = data.trim();
    // reqId is usually a long alphanumeric string (not a short OTP)
    if (value.length >= 12 && /^[A-Za-z0-9]+$/.test(value)) return value;
    return null;
  }
  if (typeof data === "object") {
    const nestedMessage = data.message;
    const candidates = [
      data.reqId,
      data.requestId,
      data.req_id,
      data.request_id,
      typeof nestedMessage === "object" ? nestedMessage?.reqId : null,
      typeof nestedMessage === "object" ? nestedMessage?.requestId : null,
      data.data?.reqId,
      data.data?.requestId,
      // Some MSG91 builds return reqId as the message string
      typeof nestedMessage === "string" &&
      nestedMessage.length >= 12 &&
      /^[A-Za-z0-9]+$/.test(nestedMessage) &&
      !/\s/.test(nestedMessage)
        ? nestedMessage
        : null,
    ];
    for (const value of candidates) {
      if (value) return String(value);
    }
  }
  return null;
}

function extractAccessToken(data) {
  if (!data) return null;
  if (typeof data === "string" && data.length > 20) return data;
  if (typeof data === "object") {
    const nestedMessage = data.message;
    const candidates = [
      data.accessToken,
      data.access_token,
      data.token,
      typeof nestedMessage === "string" && nestedMessage.length > 20 ? nestedMessage : null,
      typeof nestedMessage === "object" ? nestedMessage?.accessToken : null,
      data.data?.accessToken,
      data.data?.token,
    ];
    for (const value of candidates) {
      if (value) return String(value);
    }
  }
  return null;
}

export function persistMsg91ReqId(reqId) {
  if (typeof window === "undefined" || !reqId) return;
  try {
    sessionStorage.setItem(REQ_ID_STORAGE_KEY, String(reqId));
  } catch {
    // ignore
  }
}

export function readPersistedMsg91ReqId() {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(REQ_ID_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function clearPersistedMsg91ReqId() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(REQ_ID_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function humanizeMsg91Error(msg) {
  const text = String(msg || "");
  const lower = text.toLowerCase();
  if (lower.includes("ip") && (lower.includes("block") || lower.includes("blocked"))) {
    return (
      "Your IP is temporarily blocked by MSG91 (too many OTP attempts). " +
      "Unblock it in MSG91 → OTP → Token → Settings → IPs, then try again."
    );
  }
  if (lower.includes("network-error") || lower.includes("network error")) {
    return "Captcha failed to load. Hard-refresh the page (Ctrl+Shift+R), disable ad blockers, and try again.";
  }
  if (lower.includes("already rendered")) {
    return "Captcha failed to load. Hard-refresh the page (Ctrl+Shift+R) and try again.";
  }
  return text;
}

function extractError(error) {
  if (!error) return "MSG91 request failed";
  if (typeof error === "string") return humanizeMsg91Error(error);
  const msg =
    error.message ||
    error.msg ||
    error.error ||
    (typeof error === "object" ? JSON.stringify(error) : "MSG91 request failed");
  return humanizeMsg91Error(msg);
}

export function sendMsg91Otp(identifier) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureMsg91Ready();
      showCaptchaHost();
      if (typeof window.sendOtp !== "function") {
        reject(new Error("MSG91 sendOtp is not available"));
        return;
      }
      // Do NOT reset hCaptcha here — that triggers "already rendered" / network-error
      window.sendOtp(
        identifier,
        (data) => {
          const reqId = extractReqId(data);
          if (!reqId) {
            console.warn("MSG91 sendOtp success payload missing reqId:", data);
            reject(new Error("OTP sent but MSG91 did not return reqId. Please resend."));
            return;
          }
          persistMsg91ReqId(reqId);
          hideCaptchaHost();
          resolve({ reqId, raw: data });
        },
        (error) => reject(new Error(extractError(error)))
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

export function verifyMsg91Otp(otp, reqId) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureMsg91Ready();
      if (!reqId) {
        reject(new Error("Missing reqId. Please request a new OTP."));
        return;
      }
      if (typeof window.verifyOtp !== "function") {
        reject(new Error("MSG91 verifyOtp is not available"));
        return;
      }
      window.verifyOtp(
        String(otp).trim(),
        (data) => {
          const accessToken = extractAccessToken(data);
          if (!accessToken) {
            console.warn("MSG91 verifyOtp success payload missing token:", data);
            reject(new Error("MSG91 did not return an access token"));
            return;
          }
          clearPersistedMsg91ReqId();
          resolve({ accessToken, raw: data });
        },
        (error) => reject(new Error(extractError(error) || "Invalid or expired OTP.")),
        reqId
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

export function retryMsg91Otp(reqId, channel = "11") {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureMsg91Ready();
      if (!reqId) {
        reject(new Error("No active OTP request found. Please request a new OTP."));
        return;
      }
      if (typeof window.retryOtp !== "function") {
        reject(new Error("MSG91 retryOtp is not available"));
        return;
      }
      window.retryOtp(
        channel,
        (data) => {
          const nextReqId = extractReqId(data) || reqId;
          persistMsg91ReqId(nextReqId);
          resolve({ reqId: nextReqId, raw: data });
        },
        (error) => reject(new Error(extractError(error))),
        reqId
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
