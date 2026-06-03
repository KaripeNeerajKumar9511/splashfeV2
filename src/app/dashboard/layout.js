"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationProvider } from "@/context/ImageGenerationContext";
import { NavigationBlocker } from "@/components/NavigationBlocker";
import { ProfileCompletionGuard } from "@/components/ProfileCompletionGuard";
import { Topbar } from "@/components/Topbar";
import PortalDeviceGuard from "@/components/portal/PortalDeviceGuard";
import { usePathname } from "next/navigation";
import { PORTAL_TABLET_MIN_PX } from "@/hooks/usePortalDevice";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const handleResize = useCallback(() => {
        const w = window.innerWidth;
        setIsMobile(w < PORTAL_TABLET_MIN_PX);
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    const handleSetCollapsed = useCallback((value) => {
        setCollapsed(value);
    }, []);

    const handleSetHovered = useCallback((value) => {
        setHovered(value);
    }, []);

    const sidebarExpanded = !collapsed || (collapsed && hovered);
    const sidebarWidth = collapsed && !hovered ? 80 : 256;
    const isViewerRoute = pathname === "/dashboard/images/view";

    return (
        <PortalDeviceGuard>
            <div className="dark flex h-screen min-h-screen bg-surface-gradient">
                {!isViewerRoute && (
                    <Sidebar
                        collapsed={collapsed}
                        hovered={hovered}
                        setHovered={handleSetHovered}
                        setCollapsed={handleSetCollapsed}
                        isMobile={isMobile}
                    />
                )}

                <div className="flex-1 flex flex-col min-w-0">
                    {!isViewerRoute && (
                        <Topbar
                            collapsed={collapsed && !hovered}
                            sidebarExpanded={sidebarExpanded}
                        />
                    )}

                    <main
                        className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
                            isViewerRoute ? "p-0 mt-0" : "mt-16 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
                        }`}
                        style={{
                            marginLeft: isViewerRoute ? 0 : `${sidebarWidth}px`,
                        }}
                    >
                        <div className={isViewerRoute ? "" : "mx-auto w-full max-w-[1600px]"}>
                            <ProfileCompletionGuard>
                                <ImageGenerationProvider>
                                    <NavigationBlocker />
                                    {children}
                                </ImageGenerationProvider>
                            </ProfileCompletionGuard>
                        </div>
                    </main>
                </div>
            </div>
        </PortalDeviceGuard>
    );
}
