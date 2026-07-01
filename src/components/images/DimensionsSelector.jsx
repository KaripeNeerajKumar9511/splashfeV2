"use client"

import { useEffect, useRef, useState } from "react"
import { CheckIcon, ChevronDownIcon, Maximize2 } from "lucide-react"

const PRIMARY_DIMENSION_OPTIONS = [
    { value: "1:1", label: "1:1", ratio: "Square", name: "Profile pictures" },
    { value: "16:9", label: "16:9", ratio: "Wide", name: "Website banners" },
    { value: "4:5", label: "4:5", ratio: "Portrait", name: "Social media" },
    { value: "9:16", label: "9:16", ratio: "Vertical", name: "Reels / Stories" },
    { value: "3:4", label: "3:4", ratio: "Portrait", name: "Posters / Magazine" },
]

const MORE_DIMENSION_OPTIONS = [
    { value: "2:3", label: "2:3", ratio: "Portrait", name: "Classic photo" },
    { value: "3:2", label: "3:2", ratio: "Landscape", name: "DSLR standard" },
    { value: "4:3", label: "4:3", ratio: "Landscape", name: "Traditional display" },
    { value: "5:4", label: "5:4", ratio: "Portrait", name: "Large format" },
    { value: "21:9", label: "21:9", ratio: "Ultrawide", name: "Cinematic banners" },
]

export const GEMINI_DIMENSION_VALUES = [
    ...PRIMARY_DIMENSION_OPTIONS.map((option) => option.value),
    ...MORE_DIMENSION_OPTIONS.map((option) => option.value),
]

const GOLD = "#cd9639"

const tileBaseClass =
    "w-full p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 border-2 text-center min-h-[88px] h-[88px] flex flex-col items-center justify-center"

export function isMoreDimension(value) {
    return MORE_DIMENSION_OPTIONS.some((option) => option.value === value)
}

export function isDimensionSelectionValid() {
    return true
}

export function DimensionsSelector({
    selectedDimension,
    onDimensionChange,
    onValidityChange,
    primaryColor = GOLD,
}) {
    const [moreOpen, setMoreOpen] = useState(false)
    const [menuPlacement, setMenuPlacement] = useState("bottom")
    const moreRef = useRef(null)

    const selectedMoreOption = MORE_DIMENSION_OPTIONS.find((option) => option.value === selectedDimension)
    const moreIsActive = Boolean(selectedMoreOption)

    useEffect(() => {
        onValidityChange?.(true)
    }, [onValidityChange])

    useEffect(() => {
        if (!moreOpen) return

        const handlePointerDown = (event) => {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setMoreOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setMoreOpen(false)
        }

        document.addEventListener("mousedown", handlePointerDown)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handlePointerDown)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [moreOpen])

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
        }`

    const toggleMoreMenu = () => {
        if (!moreOpen && moreRef.current) {
            const rect = moreRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            setMenuPlacement(spaceBelow < 220 ? "top" : "bottom")
        }
        setMoreOpen((prev) => !prev)
    }

    const handleMoreSelect = (value) => {
        onDimensionChange(value)
        setMoreOpen(false)
    }

    const handlePrimarySelect = (value) => {
        setMoreOpen(false)
        onDimensionChange(value)
    }

    const moreTileSelected = moreIsActive || moreOpen

    return (
        <div>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Maximize2 size={20} className="text-gold-solid" style={{ color: primaryColor }} />
                Image Dimensions
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PRIMARY_DIMENSION_OPTIONS.map((option) => {
                    const isSelected = !moreIsActive && selectedDimension === option.value

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handlePrimarySelect(option.value)}
                            className={getTileClass(isSelected)}
                            style={getTileStyle(isSelected)}
                        >
                            <div className="text-lg font-bold leading-none">{option.label}</div>
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{option.ratio}</div>
                            <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{option.name}</div>
                        </button>
                    )
                })}

                <div ref={moreRef} className="relative">
                    <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={moreOpen}
                        onClick={toggleMoreMenu}
                        className={getTileClass(moreTileSelected)}
                        style={getTileStyle(moreTileSelected)}
                    >
                        {selectedMoreOption ? (
                            <>
                                <div className="text-lg font-bold leading-none">{selectedMoreOption.label}</div>
                                <div className="text-xs text-muted-foreground mt-1 leading-tight">
                                    {selectedMoreOption.ratio}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-1 leading-tight truncate w-full px-1">
                                    {selectedMoreOption.name}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1 text-lg font-bold leading-none">
                                    <span>More</span>
                                    <ChevronDownIcon
                                        className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                                    />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 leading-tight">More ratios</div>
                                <div className="text-[11px] text-muted-foreground mt-1 leading-tight">5 options</div>
                            </>
                        )}
                    </button>

                    {moreOpen ? (
                        <ul
                            role="listbox"
                            className={`absolute left-0 z-50 min-w-[240px] overflow-hidden rounded-xl border-2 border-border bg-input p-1 shadow-lg ${
                                menuPlacement === "top" ? "bottom-full mb-1" : "top-full mt-1"
                            }`}
                        >
                            {MORE_DIMENSION_OPTIONS.map((option) => {
                                const isSelected = selectedDimension === option.value

                                return (
                                    <li key={option.value} role="option" aria-selected={isSelected}>
                                        <button
                                            type="button"
                                            onClick={() => handleMoreSelect(option.value)}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                                isSelected
                                                    ? "bg-accent text-foreground"
                                                    : "text-foreground hover:bg-accent"
                                            }`}
                                        >
                                            <span>
                                                <span className="font-semibold">{option.label}</span>
                                                <span className="text-muted-foreground">
                                                    {" "}
                                                    — {option.ratio}, {option.name}
                                                </span>
                                            </span>
                                            {isSelected ? (
                                                <CheckIcon
                                                    className="size-4 shrink-0 text-gold-solid"
                                                    style={{ color: primaryColor }}
                                                />
                                            ) : null}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : null}
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
                Selected:{" "}
                <span className="font-semibold text-gold-solid" style={{ color: primaryColor }}>
                    {selectedDimension}
                </span>{" "}
                aspect ratio
            </p>
        </div>
    )
}
