"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiService } from "@/lib/api";
import { AUTH_PAGE_DEFAULTS, resolveAuthContent } from "@/lib/pageContentDefaults";
import { buildMediaUrl } from "@/utils/imagehelper";

const AuthPageContentContext = createContext(AUTH_PAGE_DEFAULTS);

export function resolveAuthImageSrc(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src) || src.startsWith("/images/") || src.startsWith("blob:")) {
        return src;
    }
    return buildMediaUrl(src);
}

export function AuthPageContentProvider({ children }) {
    const [raw, setRaw] = useState(null);

    useEffect(() => {
        let cancelled = false;
        apiService
            .getPageContent("auth")
            .then((data) => {
                if (!cancelled) setRaw(data || {});
            })
            .catch(() => {
                if (!cancelled) setRaw({});
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo(() => resolveAuthContent(raw), [raw]);

    return (
        <AuthPageContentContext.Provider value={value}>
            {children}
        </AuthPageContentContext.Provider>
    );
}

export function useAuthPageContent() {
    return useContext(AuthPageContentContext);
}
