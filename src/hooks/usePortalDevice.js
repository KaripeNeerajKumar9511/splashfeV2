"use client";

import { useCallback, useEffect, useState } from "react";

/** Phones: block portal. Tablets & desktops: supported. */
export const PORTAL_TABLET_MIN_PX = 768;
export const PORTAL_DESKTOP_MIN_PX = 1024;

export function usePortalDevice() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    ready: false,
  });

  const update = useCallback(() => {
    const width = window.innerWidth;
    setDevice({
      width,
      isMobile: width < PORTAL_TABLET_MIN_PX,
      isTablet: width >= PORTAL_TABLET_MIN_PX && width < PORTAL_DESKTOP_MIN_PX,
      isDesktop: width >= PORTAL_DESKTOP_MIN_PX,
      ready: true,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return device;
}

export function isPortalViewportSupported(device) {
  return device.ready && !device.isMobile;
}
