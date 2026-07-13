/**
 * Tax rules (rates from admin tax_config when provided):
 * - Address/country in gst_enabled_countries → GST at tax_rate
 * - State matches home_state → CGST + SGST split
 */
export function isIndiaBilling(details, taxConfig = null) {
  const countries = (taxConfig?.gst_enabled_countries || ["India"]).map((c) =>
    String(c).toLowerCase()
  );
  const country = (details.billing_country || "").toLowerCase();
  const blob = [
    details.billing_country,
    details.billing_state,
    details.billing_address_line1,
    details.billing_address_line2,
    details.billing_city,
    details.billing_address,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return countries.some((c) => country.includes(c) || blob.includes(c));
}

export function isTelanganaState(details, taxConfig = null) {
  const homeState = (taxConfig?.home_state || "Telangana").toLowerCase();
  const state = (details.billing_state || "").toLowerCase();
  return state.includes(homeState) || homeState.includes(state);
}

export function computeBillingTax(baseAmount, details, taxConfig = null) {
  const amount = Number(baseAmount) || 0;
  if (!isIndiaBilling(details, taxConfig)) {
    return {
      taxable: false,
      taxRate: 0,
      taxAmount: 0,
      cgstRate: 0,
      sgstRate: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      totalAmount: amount,
      isTelangana: false,
    };
  }

  const taxRate = Number(taxConfig?.tax_rate ?? 18);
  const taxAmount = Math.round(amount * (taxRate / 100) * 100) / 100;
  const isHomeState = isTelanganaState(details, taxConfig);
  const cgstRate = isHomeState ? Number(taxConfig?.cgst_rate ?? 9) : 0;
  const sgstRate = isHomeState ? Number(taxConfig?.sgst_rate ?? 9) : 0;
  const cgstAmount = isHomeState ? Math.round(amount * (cgstRate / 100) * 100) / 100 : 0;
  const sgstAmount = isHomeState ? Math.round(amount * (sgstRate / 100) * 100) / 100 : 0;

  return {
    taxable: true,
    taxRate,
    taxAmount,
    cgstRate,
    sgstRate,
    cgstAmount,
    sgstAmount,
    totalAmount: Math.round((amount + taxAmount) * 100) / 100,
    isTelangana: isHomeState,
  };
}

export const EMPTY_BILLING_DETAILS = {
  billing_name: "",
  billing_email: "",
  billing_organization_name: "",
  billing_phone: "",
  billing_country: "",
  billing_address_line1: "",
  billing_address_line2: "",
  billing_city: "",
  billing_pin: "",
  billing_state: "",
  billing_gst_number: "",
  billing_type: "individual",
};

export function formatBillingAddressPayload(details) {
  const lines = [
    details.billing_address_line1,
    details.billing_address_line2,
    [details.billing_city, details.billing_state, details.billing_pin].filter(Boolean).join(", "),
    details.billing_country,
  ].filter(Boolean);
  return {
    ...details,
    billing_address: lines.join("\n"),
  };
}
