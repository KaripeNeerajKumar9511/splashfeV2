"use client";

import { usePortalDevice, isPortalViewportSupported } from "@/hooks/usePortalDevice";
import MobileNotSupported from "@/components/portal/MobileNotSupported";

export default function PortalDeviceGuard({ children }) {
  const device = usePortalDevice();

  if (!device.ready) {
    return (
      <div className="dark min-h-screen min-h-[100dvh] bg-surface-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-muted border-t-gold-solid" />
      </div>
    );
  }

  if (!isPortalViewportSupported(device)) {
    return <MobileNotSupported />;
  }

  return children;
}
