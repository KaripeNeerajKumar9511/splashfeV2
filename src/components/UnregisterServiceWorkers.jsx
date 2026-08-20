"use client";

import { useEffect } from "react";

/**
 * This app does not ship a service worker. A leftover SW (or one injected by
 * a third-party script) intercepts Clarity/font requests and returns HTML,
 * which shows up as Unexpected token '<' and connect-src CSP errors.
 */
export default function UnregisterServiceWorkers() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }, []);
  return null;
}
