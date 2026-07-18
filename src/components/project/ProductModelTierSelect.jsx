"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const OPTIONS = [
    { value: "regular", label: "Regular" },
    // { value: "premium", label: "Premium" }, // Disabled for now
]

const RECOMMENDED_BY_CONTEXT = {
    themed: "regular",
    model: "regular",
    campaign: "regular",
}

// Generation model selector hidden; regular tier is applied by default in the background.
const SHOW_GENERATION_MODEL_UI = false

export function ProductModelTierSelect({ value, onChange, context, disabled = false }) {
    const [open, setOpen] = useState(false)
    const [menuPlacement, setMenuPlacement] = useState("bottom")
    const containerRef = useRef(null)
    const recommended = RECOMMENDED_BY_CONTEXT[context] || "regular"
    const selected = OPTIONS.find((option) => option.value === value) ?? OPTIONS[0]

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", handlePointerDown)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handlePointerDown)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    const toggleOpen = () => {
        if (disabled) return
        if (!open && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            setMenuPlacement(spaceBelow < 120 ? "top" : "bottom")
        }
        setOpen((prev) => !prev)
    }

    const handleSelect = (nextValue) => {
        onChange(nextValue)
        setOpen(false)
    }

    if (!SHOW_GENERATION_MODEL_UI) return null

    return (
        <div ref={containerRef} className="relative w-[108px] mx-auto">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                onClick={toggleOpen}
                className="flex w-full items-center justify-between gap-1 rounded-lg border border-border bg-input px-2 py-1 text-left text-xs font-medium text-foreground transition-colors hover:border-gold-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="truncate">{selected.label}</span>
                <ChevronDownIcon
                    className={`size-3 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open ? (
                <ul
                    role="listbox"
                    className={`absolute left-0 right-0 z-50 overflow-hidden rounded-lg border border-border bg-input p-1 shadow-lg ${
                        menuPlacement === "top" ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                >
                    {OPTIONS.map((option) => {
                        const isSelected = option.value === value
                        const isRecommended = recommended === option.value
                        return (
                            <li key={option.value} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                                        isSelected
                                            ? "bg-gold-solid/15 text-foreground"
                                            : "text-foreground hover:bg-gold-solid/10"
                                    }`}
                                >
                                    <span>
                                        {option.label}
                                        {isRecommended ? (
                                            <span className="ml-1 text-[10px] text-muted-foreground">*</span>
                                        ) : null}
                                    </span>
                                    {isSelected ? (
                                        <CheckIcon className="size-3 shrink-0 text-gold-solid" />
                                    ) : null}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : null}
        </div>
    )
}

// All Gemini-supported image dimensions (10 total)
export const ASPECT_RATIO_OPTIONS = [
    { value: "1:1", label: "1:1" },
    { value: "4:5", label: "4:5" },
    { value: "5:4", label: "5:4" },
    { value: "3:4", label: "3:4" },
    { value: "4:3", label: "4:3" },
    { value: "2:3", label: "2:3" },
    { value: "3:2", label: "3:2" },
    { value: "9:16", label: "9:16" },
    { value: "16:9", label: "16:9" },
    { value: "21:9", label: "21:9" },
]

export function ProductAspectRatioSelect({ value = "1:1", onChange, disabled = false }) {
    const MENU_MAX_HEIGHT = 150
    const MENU_WIDTH = 72
    const [open, setOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState(null)
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef(null)
    const menuRef = useRef(null)
    const selected = ASPECT_RATIO_OPTIONS.find((option) => option.value === value) ?? ASPECT_RATIO_OPTIONS[0]

    useEffect(() => {
        setMounted(true)
    }, [])

    const updateMenuPosition = () => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const openUpward = spaceBelow < MENU_MAX_HEIGHT + 12
        const left = Math.min(
            Math.max(8, rect.left + rect.width / 2 - MENU_WIDTH / 2),
            window.innerWidth - MENU_WIDTH - 8
        )

        setMenuStyle(
            openUpward
                ? {
                      position: "fixed",
                      left,
                      width: MENU_WIDTH,
                      bottom: window.innerHeight - rect.top + 4,
                      top: "auto",
                      zIndex: 9999,
                  }
                : {
                      position: "fixed",
                      left,
                      width: MENU_WIDTH,
                      top: rect.bottom + 4,
                      bottom: "auto",
                      zIndex: 9999,
                  }
        )
    }

    useLayoutEffect(() => {
        if (!open) return
        updateMenuPosition()
        const handleReposition = () => updateMenuPosition()
        window.addEventListener("resize", handleReposition)
        window.addEventListener("scroll", handleReposition, true)
        return () => {
            window.removeEventListener("resize", handleReposition)
            window.removeEventListener("scroll", handleReposition, true)
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            const inTrigger = containerRef.current?.contains(event.target)
            const inMenu = menuRef.current?.contains(event.target)
            if (!inTrigger && !inMenu) setOpen(false)
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", handlePointerDown)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handlePointerDown)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    const toggleOpen = (event) => {
        event?.stopPropagation?.()
        if (disabled) return
        setOpen((prev) => !prev)
    }

    const handleSelect = (nextValue) => {
        onChange?.(nextValue)
        setOpen(false)
    }

    const menu = open && menuStyle && mounted
        ? createPortal(
              <ul
                  ref={menuRef}
                  role="listbox"
                  style={menuStyle}
                  className="max-h-[150px] overflow-y-auto rounded-lg border border-border bg-input p-1 shadow-lg"
              >
                  {ASPECT_RATIO_OPTIONS.map((option) => {
                      const isSelected = option.value === selected.value
                      return (
                          <li key={option.value} role="option" aria-selected={isSelected}>
                              <button
                                  type="button"
                                  onClick={(event) => {
                                      event.stopPropagation()
                                      handleSelect(option.value)
                                  }}
                                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px] transition-colors ${
                                      isSelected
                                          ? "bg-gold-solid/15 text-foreground"
                                          : "text-foreground hover:bg-gold-solid/10"
                                  }`}
                              >
                                  <span>{option.label}</span>
                                  {isSelected ? (
                                      <CheckIcon className="size-3 shrink-0 text-gold-solid" />
                                  ) : null}
                              </button>
                          </li>
                      )
                  })}
              </ul>,
              document.body
          )
        : null

    return (
        <div ref={containerRef} className="relative w-[72px] mx-auto">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Image dimension"
                title="Image dimension"
                disabled={disabled}
                onClick={toggleOpen}
                className="flex w-full items-center justify-between gap-1 rounded-lg border border-border bg-input px-2 py-1 text-left text-[11px] font-medium text-foreground transition-colors hover:border-gold-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="truncate">{selected.label}</span>
                <ChevronDownIcon
                    className={`size-3 shrink-0 text-gold-solid transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {menu}
        </div>
    )
}

export function defaultProductRowSelection() {
    return {
        plainBg: false,
        bgReplace: false,
        model: false,
        campaign: false,
        modelTiers: {
            plainBg: "regular",
            bgReplace: "regular",
            model: "regular",
            campaign: "regular",
        },
        aspectRatios: {
            plainBg: "1:1",
            bgReplace: "1:1",
            model: "1:1",
            campaign: "1:1",
        },
    }
}

export function mergeProductRowSelection(saved = {}) {
    const defaults = defaultProductRowSelection()
    const mergedModelTiers = {
        ...defaults.modelTiers,
        ...(saved.modelTiers || {}),
    }
    const mergedAspectRatios = {
        ...defaults.aspectRatios,
        ...(saved.aspectRatios || {}),
    }
    const allowed = new Set(ASPECT_RATIO_OPTIONS.map((option) => option.value))

    return {
        ...defaults,
        ...saved,
        modelTiers: Object.fromEntries(
            Object.keys(mergedModelTiers).map((key) => [key, "regular"])
        ),
        aspectRatios: Object.fromEntries(
            Object.keys(mergedAspectRatios).map((key) => [
                key,
                allowed.has(mergedAspectRatios[key]) ? mergedAspectRatios[key] : "1:1",
            ])
        ),
    }
}
