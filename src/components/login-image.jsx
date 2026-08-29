"use client";

import { prefetchAuthPageContent, resolveAuthImageSrc, useAuthPageContent, useAuthPageReady } from "@/components/auth/AuthPageContent";

if (typeof window !== "undefined") {
    prefetchAuthPageContent();
}

export default function LoginImage() {
    const { images } = useAuthPageContent();
    const ready = useAuthPageReady();
    const smallSrc = resolveAuthImageSrc(images?.small_url);
    const largeSrc = resolveAuthImageSrc(images?.large_url);

    if (!ready && !smallSrc && !largeSrc) {
        return (
            <div className="relative w-full max-w-[440px] h-[min(420px,50vh)] mx-auto">
                <div className="absolute top-0 left-0 w-[42%] aspect-square max-w-[180px] rounded-2xl bg-card/60 border border-gold-muted/30 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[72%] h-[88%] rounded-2xl bg-card/40 border border-gold-muted/30 animate-pulse" />
            </div>
        );
    }

    if (!smallSrc && !largeSrc) {
        return null;
    }

    return (
        <div className="relative w-full max-w-[440px] h-[min(420px,50vh)] mx-auto">
            {smallSrc ? (
                <div className="absolute top-0 left-0 w-[42%] aspect-square max-w-[180px] rounded-2xl overflow-hidden shadow-lg z-10 border border-gold-muted/50 bg-card">
                    <img
                        src={smallSrc}
                        alt={images?.small_alt || ""}
                        width={180}
                        height={180}
                        decoding="async"
                        fetchPriority="high"
                        loading="eager"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : null}

            {largeSrc ? (
                <div className="absolute bottom-0 right-0 w-[72%] h-[88%] rounded-2xl overflow-hidden shadow-2xl border border-gold-muted/50 bg-card">
                    <img
                        src={largeSrc}
                        alt={images?.large_alt || ""}
                        width={480}
                        height={420}
                        decoding="async"
                        fetchPriority="high"
                        loading="eager"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : null}
        </div>
    );
}
