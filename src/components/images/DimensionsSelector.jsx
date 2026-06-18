"use client"

import { useEffect, useState } from "react"
import { Maximize2 } from "lucide-react"

const DIMENSION_OPTIONS = [
    { value: "1:1", label: "1:1", ratio: "Square", name: "Profile pictures" },
    { value: "16:9", label: "16:9", ratio: "Wide", name: "Website banners" },
    { value: "4:5", label: "4:5", ratio: "Portrait", name: "Social media" },
    { value: "9:16", label: "9:16", ratio: "Vertical", name: "Reels / Stories" },
    { value: "3:4", label: "3:4", ratio: "Portrait", name: "Posters / Magazine" },
    { value: "custom", label: "Custom", ratio: "Your ratio", name: "Any size", isCustom: true },
]

const PRESET_VALUES = DIMENSION_OPTIONS.filter((o) => !o.isCustom).map((o) => o.value)

const GOLD = "#cd9639"

const tileBaseClass =
    "p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 border-2 text-center min-h-[88px] h-[88px] flex flex-col items-center justify-center overflow-hidden"

const inputClass =
    "w-9 sm:w-10 h-7 text-center text-sm font-bold py-0 px-0.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

function sanitizeDecimalInput(value) {
    const cleaned = String(value || "").replace(/[^\d.]/g, "")
    const parts = cleaned.split(".")
    if (parts.length <= 1) return cleaned
    return `${parts[0]}.${parts.slice(1).join("")}`
}

export function parseDimension(value) {
    const match = String(value || "")
        .trim()
        .replace(/\s+/g, "")
        .match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/)
    if (!match) return null

    const a = parseFloat(match[1])
    const b = parseFloat(match[2])
    if (a <= 0 || b <= 0 || a > 100 || b > 100) return null

    return { a, b, value: `${match[1]}:${match[2]}` }
}

export function isCustomDimension(value) {
    return Boolean(value) && !PRESET_VALUES.includes(value)
}

export function DimensionsSelector({ selectedDimension, onDimensionChange, primaryColor = GOLD }) {
    const [editingCustom, setEditingCustom] = useState(() => isCustomDimension(selectedDimension))
    const [customA, setCustomA] = useState("")
    const [customB, setCustomB] = useState("")

    useEffect(() => {
        if (isCustomDimension(selectedDimension)) {
            const parsed = parseDimension(selectedDimension)
            if (parsed) {
                setCustomA(String(parsed.a))
                setCustomB(String(parsed.b))
            }
            setEditingCustom(true)
            return
        }

        setEditingCustom(false)
        const parsed = parseDimension(selectedDimension)
        if (parsed) {
            setCustomA(String(parsed.a))
            setCustomB(String(parsed.b))
        }
    }, [selectedDimension])

    const showCustomInputs = editingCustom || isCustomDimension(selectedDimension)

    const handleCustomValueChange = (nextA, nextB) => {
        const sanitizedA = sanitizeDecimalInput(nextA)
        const sanitizedB = sanitizeDecimalInput(nextB)
        setCustomA(sanitizedA)
        setCustomB(sanitizedB)

        if (!sanitizedA || !sanitizedB) return

        const parsed = parseDimension(`${sanitizedA}:${sanitizedB}`)
        if (parsed) {
            onDimensionChange(parsed.value)
        }
    }

    const activateCustom = () => {
        setEditingCustom(true)
        if (!isCustomDimension(selectedDimension)) {
            setCustomA("")
            setCustomB("")
        }
    }

    const customInvalid =
        showCustomInputs &&
        customA.trim() &&
        customB.trim() &&
        !parseDimension(`${customA.trim()}:${customB.trim()}`)

    const getTileStyle = (isSelected) =>
        isSelected
            ? {
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
              }
            : {}

    const getTileClass = (isSelected) =>
        `${tileBaseClass} ${
            isSelected
                ? "border-gold-solid bg-accent text-gold-solid shadow-md"
                : "border-border bg-input text-foreground hover:border-gold-muted hover:bg-accent"
        }${customInvalid && isSelected ? " border-destructive" : ""}`

    return (
        <div>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Maximize2 size={20} className="text-gold-solid" style={{ color: primaryColor }} />
                Image Dimensions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {DIMENSION_OPTIONS.map((option) => {
                    if (option.isCustom) {
                        const isSelected = showCustomInputs

                        return (
                            <div
                                key={option.value}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    if (!showCustomInputs) activateCustom()
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        if (!showCustomInputs) activateCustom()
                                    }
                                }}
                                className={getTileClass(isSelected)}
                                style={getTileStyle(isSelected)}
                            >
                                {showCustomInputs ? (
                                    <div
                                        className="flex flex-col items-center justify-center w-full gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    >
                                        <div className="text-[11px] font-semibold leading-none text-muted-foreground">
                                            Custom
                                        </div>
                                        <div className="flex items-center justify-center gap-1 w-full max-w-full">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={customA}
                                                onChange={(e) => handleCustomValueChange(e.target.value, customB)}
                                                placeholder="A"
                                                className={inputClass}
                                                aria-label="Custom width ratio"
                                            />
                                            <span className="text-sm font-bold leading-none text-muted-foreground">:</span>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={customB}
                                                onChange={(e) => handleCustomValueChange(customA, e.target.value)}
                                                placeholder="B"
                                                className={inputClass}
                                                aria-label="Custom height ratio"
                                            />
                                        </div>
                                        <div className="text-[10px] text-muted-foreground leading-tight truncate w-full">
                                            {customInvalid ? "Invalid ratio" : "Width : height"}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-lg font-bold leading-none">{option.label}</div>
                                        <div className="text-xs text-muted-foreground mt-1 leading-tight">{option.ratio}</div>
                                        <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{option.name}</div>
                                    </>
                                )}
                            </div>
                        )
                    }

                    const isSelected = !showCustomInputs && selectedDimension === option.value

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                setEditingCustom(false)
                                onDimensionChange(option.value)
                            }}
                            className={getTileClass(isSelected)}
                            style={getTileStyle(isSelected)}
                        >
                            <div className="text-lg font-bold leading-none">{option.label}</div>
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{option.ratio}</div>
                            <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{option.name}</div>
                        </button>
                    )
                })}
            </div>

            {(!showCustomInputs || isCustomDimension(selectedDimension)) && selectedDimension && !customInvalid && (
                <p className="text-sm text-muted-foreground mt-3">
                    Selected:{" "}
                    <span className="font-semibold text-gold-solid" style={{ color: primaryColor }}>
                        {selectedDimension}
                    </span>{" "}
                    aspect ratio
                </p>
            )}
        </div>
    )
}
