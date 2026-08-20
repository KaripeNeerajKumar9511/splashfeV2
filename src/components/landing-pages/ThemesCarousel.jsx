"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { absoluteApiUrl } from "@/lib/landingPages";

function mediaSrc(src) {
  return absoluteApiUrl(src);
}

const COPIES = 3;

export default function ThemesCarousel({ visuals = [], title, subtitle }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const autoPlayRef = useRef(true);
  const rafRef = useRef(0);

  const strip = useMemo(() => {
    if (!visuals.length) return [];
    return Array.from({ length: COPIES }, (_, copy) =>
      visuals.map((visual, index) => ({
        ...visual,
        _key: `${copy}-${visual.id || visual.name || index}`,
      }))
    ).flat();
  }, [visuals]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("is-in", Boolean(entry?.isIntersecting));
      },
      { threshold: 0.18 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visuals.length) return undefined;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const autoMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncPrefs = () => {
      reduceMotionRef.current = reduceMq.matches;
      autoPlayRef.current = autoMq.matches && !reduceMq.matches;
    };
    syncPrefs();
    reduceMq.addEventListener("change", syncPrefs);
    autoMq.addEventListener("change", syncPrefs);

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      loopWidthRef.current = track.scrollWidth / COPIES;
      const loop = loopWidthRef.current;
      if (loop > 0) {
        offsetRef.current = ((offsetRef.current % loop) + loop) % loop;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
    };

    measure();
    const images = trackRef.current?.querySelectorAll("img") || [];
    images.forEach((img) => img.addEventListener("load", measure));
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(32, now - last);
      last = now;
      const loop = loopWidthRef.current;
      const track = trackRef.current;
      if (track && loop > 0 && autoPlayRef.current && !pausedRef.current && !draggingRef.current) {
        offsetRef.current += (36 * dt) / 1000;
        if (offsetRef.current >= loop) offsetRef.current -= loop;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      images.forEach((img) => img.removeEventListener("load", measure));
      window.removeEventListener("resize", measure);
      reduceMq.removeEventListener("change", syncPrefs);
      autoMq.removeEventListener("change", syncPrefs);
    };
  }, [visuals.length, strip.length]);

  const wrapOffset = (value) => {
    const loop = loopWidthRef.current;
    if (loop <= 0) return value;
    let next = value % loop;
    if (next < 0) next += loop;
    return next;
  };

  const applyOffset = (value) => {
    offsetRef.current = wrapOffset(value);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
    }
  };

  const cardStep = () => {
    const card = trackRef.current?.querySelector("[data-theme-card]");
    if (!card) return 360;
    const styles = window.getComputedStyle(trackRef.current);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return card.getBoundingClientRect().width + gap;
  };

  const nudge = (dir) => {
    applyOffset(offsetRef.current + dir * cardStep());
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    draggingRef.current = true;
    pausedRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current) return;
    applyOffset(dragStartOffsetRef.current - (event.clientX - dragStartXRef.current));
  };

  const endDrag = () => {
    draggingRef.current = false;
    pausedRef.current = false;
  };

  if (!visuals.length) return null;

  return (
    <div ref={rootRef} className="lp-themes">
      <div className="lp-themes-copy">
        {title ? (
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#F2EDD8] md:text-5xl">
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mt-4 font-['DM_Sans',sans-serif] text-base font-light text-[rgba(242,237,216,0.58)] md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div
        className="lp-themes-gallery"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (!draggingRef.current) pausedRef.current = false;
        }}
      >
        {visuals.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous themes"
              className="lp-theme-arrow lp-theme-arrow-prev"
              onClick={() => nudge(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next themes"
              className="lp-theme-arrow lp-theme-arrow-next"
              onClick={() => nudge(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}

        <div
          className="lp-theme-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div ref={trackRef} className="lp-theme-track">
            {strip.map((visual) => (
              <figure key={visual._key} data-theme-card className="lp-theme-card">
                <div className="lp-theme-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaSrc(visual.image)}
                    alt={visual.name || "Theme"}
                    draggable="false"
                  />
                </div>
                {visual.name ? (
                  <figcaption className="lp-theme-label">{visual.name}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
