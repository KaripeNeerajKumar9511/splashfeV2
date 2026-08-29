"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiService } from "@/lib/api";
import { AUTH_PAGE_DEFAULTS, resolveAuthContent } from "@/lib/pageContentDefaults";
import { buildMediaUrl } from "@/utils/imagehelper";

const AuthPageContentContext = createContext(AUTH_PAGE_DEFAULTS);
const AuthPageReadyContext = createContext(false);

let cachedAuthContent = null;
let authContentPromise = null;

export function prefetchAuthPageContent() {
    if (typeof window === "undefined") {
        return Promise.resolve(cachedAuthContent);
    }
    if (cachedAuthContent) return Promise.resolve(cachedAuthContent);
    if (!authContentPromise) {
        authContentPromise = apiService
            .getPageContent("auth")
            .then((data) => {
                cachedAuthContent = data || {};
                return cachedAuthContent;
            })
            .catch(() => {
                cachedAuthContent = {};
                authContentPromise = null;
                return cachedAuthContent;
            });
    }
    return authContentPromise;
}

export function resolveAuthImageSrc(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src) || src.startsWith("blob:")) {
        return src;
    }
    if (src.startsWith("/images/") || src.startsWith("/galery/")) {
        return src;
    }
    return buildMediaUrl(src);
}

export function AuthPageContentProvider({ children }) {
    const [raw, setRaw] = useState(cachedAuthContent);
    const [ready, setReady] = useState(Boolean(cachedAuthContent));

    useEffect(() => {
        let cancelled = false;
        prefetchAuthPageContent().then((data) => {
            if (cancelled) return;
            setRaw(data);
            setReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo(() => resolveAuthContent(raw), [raw]);

    return (
        <AuthPageReadyContext.Provider value={ready}>
            <AuthPageContentContext.Provider value={value}>
                {children}
            </AuthPageContentContext.Provider>
        </AuthPageReadyContext.Provider>
    );
}

export function useAuthPageContent() {
    return useContext(AuthPageContentContext);
}

export function useAuthPageReady() {
    return useContext(AuthPageReadyContext);
}
