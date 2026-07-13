"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getPlanById, formatPlanPrice } from "@/lib/pricingPlans";
import { getPlanFromList, formatDynamicPlanPrice } from "@/lib/pricingApi";
import {
  EMPTY_BILLING_DETAILS,
  computeBillingTax,
  formatBillingAddressPayload,
} from "@/lib/billingTax";

const inputClass =
  "w-full bg-[#1a1814] border border-[rgba(201,168,76,0.2)] rounded-lg px-3 py-2.5 text-sm text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.35)] focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.35)]";

export default function BillingDetailsModal({
  open,
  onClose,
  planId,
  plan: planProp,
  taxConfig = null,
  organizationName = "",
  showOrganizationField = false,
  defaultEmail = "",
  defaultName = "",
  processing = false,
  onProceed,
}) {
  const plan = useMemo(
    () => planProp || getPlanById(planId),
    [planProp, planId]
  );
  const [details, setDetails] = useState({ ...EMPTY_BILLING_DETAILS });

  useEffect(() => {
    if (!open) return;
    setDetails({
      ...EMPTY_BILLING_DETAILS,
      billing_name: defaultName || "",
      billing_email: defaultEmail || "",
      billing_organization_name: organizationName || "",
    });
  }, [open, defaultName, defaultEmail, organizationName]);

  if (!open || !plan) return null;

  const baseAmount = plan.price || 0;
  const tax = computeBillingTax(baseAmount, details, taxConfig);
  const priceLabel = plan.priceDisplay || plan.db_id
    ? formatDynamicPlanPrice(plan)
    : formatPlanPrice(plan);
  const payload = formatBillingAddressPayload(details);

  const update = (key, value) => setDetails((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.billing_name?.trim() || !details.billing_email?.trim() || !details.billing_phone?.trim()) {
      return;
    }
    if (!details.billing_country?.trim() || !details.billing_address_line1?.trim() || !details.billing_city?.trim() || !details.billing_pin?.trim() || !details.billing_state?.trim()) {
      return;
    }
    onProceed(payload, tax);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[#14120e] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[#14120e]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#C9A84C]">Billing details</p>
            <h3 className="text-lg font-semibold text-[#F2EDD8]">{plan.name} plan</h3>
          </div>
          <button type="button" onClick={onClose} className="text-[rgba(242,237,216,0.6)] hover:text-[#F2EDD8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="rounded-xl border border-[rgba(201,168,76,0.15)] bg-[#0E0D09] p-4 text-sm">
            <div className="flex justify-between text-[rgba(242,237,216,0.65)]">
              <span>Plan</span>
              <span>{priceLabel}{plan.billingCycle ? ` /${plan.billingCycle}` : ""}</span>
            </div>
            <div className="flex justify-between text-[rgba(242,237,216,0.65)] mt-1">
              <span>Credits</span>
              <span>{plan.credits}</span>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.07)] mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-[rgba(242,237,216,0.65)]">
                <span>Subtotal</span>
                <span>₹{baseAmount.toLocaleString("en-IN")}</span>
              </div>
              {tax.taxable && !tax.isTelangana && (
                <div className="flex justify-between text-[rgba(242,237,216,0.65)]">
                  <span>GST ({tax.taxRate}%)</span>
                  <span>₹{tax.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {tax.isTelangana && (
                <>
                  <div className="flex justify-between text-[rgba(242,237,216,0.65)]">
                    <span>CGST ({tax.cgstRate}%)</span>
                    <span>₹{tax.cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[rgba(242,237,216,0.65)]">
                    <span>SGST ({tax.sgstRate}%)</span>
                    <span>₹{tax.sgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[rgba(242,237,216,0.5)] text-xs">
                    <span>Total tax</span>
                    <span>18%</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-semibold text-[#F2EDD8] pt-1">
                <span>Total payable</span>
                <span>₹{tax.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Field label="Full name *" value={details.billing_name} onChange={(v) => update("billing_name", v)} />
          {showOrganizationField && (
            <Field
              label="Organization name"
              value={details.billing_organization_name}
              onChange={(v) => update("billing_organization_name", v)}
            />
          )}
          <Field label="Email *" type="email" value={details.billing_email} onChange={(v) => update("billing_email", v)} />
          <Field label="Mobile number *" value={details.billing_phone} onChange={(v) => update("billing_phone", v)} />

          <div>
            <label className="block text-xs font-medium text-[rgba(242,237,216,0.75)] mb-1">Billing address</label>
            <p className="text-[10px] text-[rgba(242,237,216,0.45)] mb-2">Enter India for GST. Telangana state shows CGST + SGST.</p>
          </div>

          <Field label="Country *" value={details.billing_country} onChange={(v) => update("billing_country", v)} placeholder="India" />
          <Field label="Address line 1 *" value={details.billing_address_line1} onChange={(v) => update("billing_address_line1", v)} />
          <Field label="Address line 2" value={details.billing_address_line2} onChange={(v) => update("billing_address_line2", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *" value={details.billing_city} onChange={(v) => update("billing_city", v)} />
            <Field label="PIN *" value={details.billing_pin} onChange={(v) => update("billing_pin", v)} />
          </div>
          <Field label="State *" value={details.billing_state} onChange={(v) => update("billing_state", v)} placeholder="Telangana" />
          <Field label="GST number (optional)" value={details.billing_gst_number} onChange={(v) => update("billing_gst_number", v)} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-10 rounded-lg border border-[rgba(201,168,76,0.22)] text-[#F2EDD8] text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 min-h-10 rounded-lg bg-[#C9A84C] text-[#0E0D09] text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Proceed to Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[rgba(242,237,216,0.75)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        required={label.includes("*")}
      />
    </div>
  );
}
