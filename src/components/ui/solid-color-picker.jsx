"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, DropletOff, Pencil, Pipette, Plus } from "lucide-react"

const DEFAULT_COLOR = "#ffffff"
const PANEL_WIDTH = 240
const PANEL_Z_INDEX = 10050

const GRAYSCALE = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#ffffff",
]

const HUE_ROW = [
    "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#9900ff",
]

function buildShadeRows() {
    return [
        ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#d9d2e9"],
        ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#b4a7d6"],
        ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#8e7cc3"],
        ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#674ea7"],
        ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#351c75"],
        ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#20124d"],
    ]
}

const STANDARD_COLORS = [
    "#000000",
    "#ffffff",
    "#0000ff",
    "#ff0000",
    "#ffff00",
    "#00ff00",
    "#ff9900",
    "#00ffff",
]

function normalizeHex(value) {
    if (!value || typeof value !== "string") return null
    let hex = value.trim()
    if (!hex) return null
    if (!hex.startsWith("#")) hex = `#${hex}`
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null
    return hex.toLowerCase()
}

function isLightColor(hex) {
    const normalized = normalizeHex(hex)
    if (!normalized) return true
    const r = Number.parseInt(normalized.slice(1, 3), 16)
    const g = Number.parseInt(normalized.slice(3, 5), 16)
    const b = Number.parseInt(normalized.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

function Swatch({ color, selected, onSelect }) {
    const selectedHex = normalizeHex(selected)
    const colorHex = normalizeHex(color)
    const isSelected = selectedHex && colorHex && selectedHex === colorHex

    return (
        <button
            type="button"
            title={color}
            onClick={() => onSelect(colorHex || color)}
            className="relative h-5 w-5 rounded-full border border-black/15 shadow-sm transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-solid"
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
        >
            {isSelected ? (
                <Check
                    className={`absolute inset-0 m-auto h-2.5 w-2.5 ${
                        isLightColor(color) ? "text-black" : "text-white"
                    }`}
                    strokeWidth={3}
                />
            ) : null}
        </button>
    )
}

/**
 * Sheets-style single solid color picker.
 * Renders the panel in a portal so it stays above table/dropdown UI.
 */
export function SolidColorPicker({
    value = DEFAULT_COLOR,
    onChange,
    disabled = false,
    defaultColor = DEFAULT_COLOR,
    align = "left",
    className = "",
    showHexInput = true,
}) {
    const [open, setOpen] = useState(false)
    const [hexDraft, setHexDraft] = useState("")
    const [mounted, setMounted] = useState(false)
    const [panelStyle, setPanelStyle] = useState(null)
    const triggerRef = useRef(null)
    const panelRef = useRef(null)
    const nativeColorRef = useRef(null)
    const panelId = useId()

    const current = normalizeHex(value) || normalizeHex(defaultColor) || DEFAULT_COLOR
    const shadeRows = buildShadeRows()

    useEffect(() => {
        setMounted(true)
    }, [])

    const updatePanelPosition = () => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        const estimatedHeight = 420
        const spaceBelow = window.innerHeight - rect.bottom
        const openUpward = spaceBelow < estimatedHeight + 12
        const left =
            align === "right"
                ? Math.min(
                      Math.max(8, rect.right - PANEL_WIDTH),
                      window.innerWidth - PANEL_WIDTH - 8
                  )
                : Math.min(Math.max(8, rect.left), window.innerWidth - PANEL_WIDTH - 8)

        setPanelStyle(
            openUpward
                ? {
                      position: "fixed",
                      left,
                      width: PANEL_WIDTH,
                      bottom: window.innerHeight - rect.top + 6,
                      top: "auto",
                      zIndex: PANEL_Z_INDEX,
                  }
                : {
                      position: "fixed",
                      left,
                      width: PANEL_WIDTH,
                      top: rect.bottom + 6,
                      bottom: "auto",
                      zIndex: PANEL_Z_INDEX,
                  }
        )
    }

    useLayoutEffect(() => {
        if (!open) return
        updatePanelPosition()
        const handleReposition = () => updatePanelPosition()
        window.addEventListener("resize", handleReposition)
        window.addEventListener("scroll", handleReposition, true)
        return () => {
            window.removeEventListener("resize", handleReposition)
            window.removeEventListener("scroll", handleReposition, true)
        }
    }, [open, align])

    useEffect(() => {
        if (!open) return
        const onPointerDown = (event) => {
            const inTrigger = triggerRef.current?.contains(event.target)
            const inPanel = panelRef.current?.contains(event.target)
            if (!inTrigger && !inPanel) setOpen(false)
        }
        const onKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    useEffect(() => {
        if (open) setHexDraft("")
    }, [open])

    const commitColor = (next) => {
        const normalized = normalizeHex(next) || normalizeHex(defaultColor) || DEFAULT_COLOR
        onChange?.(normalized)
    }

    const handleReset = () => {
        commitColor(defaultColor)
        setHexDraft("")
        setOpen(false)
    }

    const handleHexApply = () => {
        const normalized = normalizeHex(hexDraft)
        if (!normalized) return
        commitColor(normalized)
        setHexDraft("")
        setOpen(false)
    }

    const handleEyedropper = async () => {
        if (typeof window === "undefined" || !window.EyeDropper) return
        try {
            const dropper = new window.EyeDropper()
            const result = await dropper.open()
            if (result?.sRGBHex) {
                commitColor(result.sRGBHex)
                setOpen(false)
            }
        } catch {
            // User cancelled eyedropper
        }
    }

    const supportsEyedropper =
        typeof window !== "undefined" && typeof window.EyeDropper === "function"

    const panel =
        open && mounted && panelStyle
            ? createPortal(
                  <div
                      ref={panelRef}
                      id={panelId}
                      role="dialog"
                      aria-label="Color picker"
                      style={panelStyle}
                      className="rounded-lg border border-border bg-card p-3 text-foreground shadow-2xl"
                      onMouseDown={(e) => e.stopPropagation()}
                  >
                      <button
                          type="button"
                          onClick={handleReset}
                          className="mb-2 flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-sm text-foreground hover:bg-accent"
                      >
                          <DropletOff className="h-3.5 w-3.5 text-muted-foreground" />
                          Reset
                      </button>

                      <div className="mb-3 space-y-1">
                          <div className="grid grid-cols-8 gap-1">
                              {GRAYSCALE.map((color) => (
                                  <Swatch
                                      key={`gray-${color}`}
                                      color={color}
                                      selected={current}
                                      onSelect={(c) => {
                                          commitColor(c)
                                          setOpen(false)
                                      }}
                                  />
                              ))}
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                              {HUE_ROW.map((color) => (
                                  <Swatch
                                      key={`hue-${color}`}
                                      color={color}
                                      selected={current}
                                      onSelect={(c) => {
                                          commitColor(c)
                                          setOpen(false)
                                      }}
                                  />
                              ))}
                          </div>
                          {shadeRows.map((row) => (
                              <div key={row.join("-")} className="grid grid-cols-8 gap-1">
                                  {row.map((color) => (
                                      <Swatch
                                          key={color}
                                          color={color}
                                          selected={current}
                                          onSelect={(c) => {
                                              commitColor(c)
                                              setOpen(false)
                                          }}
                                      />
                                  ))}
                              </div>
                          ))}
                      </div>

                      <div className="mb-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Standard
                              <Pencil className="h-3 w-3" />
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                              {STANDARD_COLORS.map((color) => (
                                  <Swatch
                                      key={`std-${color}`}
                                      color={color}
                                      selected={current}
                                      onSelect={(c) => {
                                          commitColor(c)
                                          setOpen(false)
                                      }}
                                  />
                              ))}
                          </div>
                      </div>

                      <div>
                          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Custom
                          </div>
                          <div className="flex items-center gap-2">
                              <button
                                  type="button"
                                  title="Open custom color picker"
                                  onClick={() => nativeColorRef.current?.click()}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                              >
                                  <Plus className="h-3 w-3" />
                              </button>
                              <input
                                  ref={nativeColorRef}
                                  type="color"
                                  value={current}
                                  onChange={(e) => {
                                      commitColor(e.target.value)
                                      setOpen(false)
                                  }}
                                  className="sr-only"
                                  tabIndex={-1}
                                  aria-hidden="true"
                              />
                              {supportsEyedropper ? (
                                  <button
                                      type="button"
                                      title="Pick color from screen"
                                      onClick={handleEyedropper}
                                      className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                  >
                                      <Pipette className="h-3 w-3" />
                                  </button>
                              ) : null}
                          </div>

                          {showHexInput ? (
                              <div className="mt-2 flex items-center gap-2">
                                  <input
                                      type="text"
                                      value={hexDraft}
                                      onChange={(e) => setHexDraft(e.target.value)}
                                      onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                              e.preventDefault()
                                              handleHexApply()
                                          }
                                      }}
                                      placeholder="Type hex e.g. #ffffff"
                                      className="h-7 min-w-0 flex-1 rounded-md border border-border bg-input px-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                      aria-label="Custom hex color"
                                  />
                                  <button
                                      type="button"
                                      onClick={handleHexApply}
                                      disabled={!normalizeHex(hexDraft)}
                                      className="h-7 rounded-md border border-border px-2 text-xs font-medium text-gold-solid hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                      Apply
                                  </button>
                              </div>
                          ) : null}
                      </div>
                  </div>,
                  document.body
              )
            : null

    return (
        <div className={`inline-flex items-center ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!disabled) setOpen((prev) => !prev)
                }}
                title={`Background color ${current}`}
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border/80 bg-background p-[1px] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span
                    className="block h-full w-full rounded-[2px] border border-black/10"
                    style={{ backgroundColor: current }}
                />
            </button>
            {panel}
        </div>
    )
}

export { DEFAULT_COLOR as SOLID_COLOR_PICKER_DEFAULT }
