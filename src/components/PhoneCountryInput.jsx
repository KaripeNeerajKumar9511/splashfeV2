"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { SIGNUP_COUNTRIES } from "@/lib/signupCountries";
import { ChevronDownIcon } from "lucide-react";

/**
 * Country dial-code selector with flags + national phone number input.
 * Selecting "Other" opens a search box over the full list.
 */
export default function PhoneCountryInput({
  countryCode = "IN",
  nationalNumber = "",
  onCountryChange,
  onNationalChange,
  required = true,
  className = "",
  inputClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showOtherSearch, setShowOtherSearch] = useState(false);

  const selected = useMemo(
    () => SIGNUP_COUNTRIES.find((c) => c.code === countryCode) || SIGNUP_COUNTRIES[0],
    [countryCode]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = SIGNUP_COUNTRIES.filter((c) => c.code !== "OTHER");
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const pickCountry = (country) => {
    if (country.code === "OTHER") {
      setShowOtherSearch(true);
      setSearch("");
      setOpen(true);
      return;
    }
    setShowOtherSearch(false);
    setSearch("");
    setOpen(false);
    onCountryChange?.(country);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-foreground">Mobile number</label>
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v);
              if (!open) setShowOtherSearch(false);
            }}
            className="min-h-11 px-3 rounded-lg border border-input bg-input text-foreground flex items-center gap-2 min-w-[7.5rem]"
          >
            <span className="text-lg leading-none">{selected.flag}</span>
            <span className="text-sm font-medium">{selected.dial || "Code"}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {open && (
            <div className="absolute z-50 mt-1 w-72 max-h-64 overflow-hidden rounded-lg border border-border bg-card shadow-xl ">
              {(showOtherSearch || search) && (
                <div className="p-2 border-b border-border text-white">
                  <Input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="h-9"
                  />
                </div>
              )}
              <div className="overflow-y-auto max-h-52">
                {!showOtherSearch &&
                  SIGNUP_COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => pickCountry(country)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-secondary/40 text-foreground"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="text-muted-foreground">{country.dial || ""}</span>
                    </button>
                  ))}
                {showOtherSearch &&
                  filtered.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => pickCountry(country)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-secondary/40 text-foreground"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="text-muted-foreground">{country.dial}</span>
                    </button>
                  ))}
                {showOtherSearch && filtered.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted-foreground">No countries found</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Input
          type="tel"
          inputMode="numeric"
          name="phone_national"
          value={nationalNumber}
          onChange={(e) => onNationalChange?.(e.target.value.replace(/\D/g, ""))}
          placeholder="Mobile number"
          autoComplete="tel-national"
          required={required}
          className={`flex-1 ${inputClassName}`}
        />
      </div>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default"
          aria-label="Close country list"
          onClick={() => {
            setOpen(false);
            setShowOtherSearch(false);
            setSearch("");
          }}
        />
      )}
    </div>
  );
}
