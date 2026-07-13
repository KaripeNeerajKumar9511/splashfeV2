import { apiService } from "@/lib/api";

const DEFAULT_CONFIG = {
  invoice_prefix: "INV-",
  tax_rate: 18,
};

const LOGO_PATH = "/images/Splashlogoinvoice.png";

const COMPANY = {
  brand_name: "Splash AI Studios",
  legal_name: "by Techsprout AI Labs Pvt ltd.",
  gstin: "36AALCT9589R1ZU",
  city_state: "Hyderabad, Telangana.",
  pincode: "500072",
  phone: "+1 831-425-9504",
  support_email: "support@gosplash.ai",
};

const INK = "#000000";
const INK_BODY = "#1a1a1a";
const INK_MUTED = "#333333";
const INK_LABEL = "#4a4a4a";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDateLong(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function subscriptionPeriod(startDate) {
  const start = new Date(startDate || Date.now());
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return `${formatDateShort(start)}–${formatDateShort(end)}`;
}

function isIndiaBilling(payment) {
  const country = String(
    payment?.billing_country || payment?.billing_address || ""
  ).toLowerCase();
  if (payment?.currency === "INR") return true;
  return country.includes("india") || country === "in";
}

function resolveCurrency(payment) {
  if (payment?.currency === "USD") {
    return { code: "USD", locale: "en-US" };
  }
  if (payment?.currency === "INR" || isIndiaBilling(payment)) {
    return { code: "INR", locale: "en-IN" };
  }
  return { code: "USD", locale: "en-US" };
}

function formatMoney(amount, currency) {
  const value = Number(amount || 0);
  if (currency.code === "INR") {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function billToLines(payment) {
  const name = payment?.billing_name || payment?.user_name || "Customer";
  const email =
    payment?.billing_email || payment?.user_email || payment?.email || "";
  const line1 =
    payment?.billing_address_line1 ||
    (payment?.billing_address ? payment.billing_address.split(",")[0]?.trim() : "");
  const line2 = payment?.billing_address_line2 || "";
  const pin = payment?.billing_pin || "";
  const state = payment?.billing_state || "";
  const country = payment?.billing_country || "";

  return { name, line1, line2, pin, state, country, email };
}

async function loadInvoiceConfig(token) {
  if (token) {
    try {
      const data = await apiService.getInvoiceConfig(token);
      if (data) return { ...DEFAULT_CONFIG, ...data };
    } catch {
      /* use defaults */
    }
  }
  return DEFAULT_CONFIG;
}

async function loadLogoDataUrl(origin) {
  try {
    const response = await fetch(`${origin}${LOGO_PATH}`);
    if (!response.ok) return `${origin}${LOGO_PATH}`;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(`${origin}${LOGO_PATH}`);
      reader.readAsDataURL(blob);
    });
  } catch {
    return `${origin}${LOGO_PATH}`;
  }
}

function buildInvoiceHtml({ payment, config, logoSrc }) {
  const baseAmount = payment?.amount ?? payment?.base_amount ?? 0;
  const taxRate = payment?.tax_rate ?? config.tax_rate ?? 18;
  const tax = payment?.tax_amount ?? (isIndiaBilling(payment) ? (baseAmount * taxRate) / 100 : 0);
  const total = payment?.total_amount ?? baseAmount + tax;
  const isPaid = payment?.status === "completed";
  const currency = resolveCurrency(payment);
  const india = isIndiaBilling(payment);

  const invoiceNumber =
    payment?.invoice_number ||
    `${config.invoice_prefix}${payment?.id || "00000"}`;
  const issueDate = formatDateLong(payment?.created_at || payment?.date);
  const dueDate = issueDate;

  const transactionId =
    payment?.razorpay_payment_id || payment?.razorpay_order_id || payment?.id || "—";
  const planLabel = payment?.plan_name || payment?.plan || "Splash Plan";
  const period = subscriptionPeriod(payment?.created_at || payment?.date);
  const billTo = billToLines(payment);

  const amountLine = isPaid
    ? `${formatMoney(total, currency)} ${currency.code} paid ${issueDate}`
    : `${formatMoney(total, currency)} ${currency.code} due ${dueDate}`;

  const gstLine = india
    ? `GST – India (${taxRate}% on ${formatMoney(baseAmount, currency)})`
    : null;

  const cell = `padding:11px 0;color:${INK_BODY};font-weight:500;`;
  const th =
    `text-align:left;padding:10px 0 10px;font-weight:700;color:${INK};border-bottom:1px solid #9ca3af;`;
  const thR = `${th}text-align:right;`;

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK_BODY};background:#ffffff;padding:52px 56px;width:794px;box-sizing:border-box;-webkit-font-smoothing:antialiased;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
        <h1 style="font-size:30px;font-weight:700;margin:0;letter-spacing:-0.02em;line-height:1;color:${INK};">Invoice</h1>
        <img src="${escapeHtml(logoSrc)}" alt="Splash AI Studios" style="height:52px;width:auto;max-width:200px;object-fit:contain;display:block;" />
      </div>

      <div style="font-size:14px;line-height:1.75;margin-bottom:36px;color:${INK_BODY};font-weight:500;">
        <div style="margin-bottom:2px;"><span style="color:${INK_LABEL};font-weight:600;">Invoice number</span>&nbsp;&nbsp;${escapeHtml(invoiceNumber)}</div>
        <div style="margin-bottom:2px;"><span style="color:${INK_LABEL};font-weight:600;">Date of issue</span>&nbsp;&nbsp;${escapeHtml(issueDate)}</div>
        <div><span style="color:${INK_LABEL};font-weight:600;">Date due</span>&nbsp;&nbsp;${escapeHtml(dueDate)}</div>
      </div>

      <div style="display:flex;justify-content:space-between;gap:64px;margin-bottom:32px;font-size:14px;line-height:1.7;">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;color:${INK};margin-bottom:2px;">${escapeHtml(COMPANY.brand_name)}</div>
          <div style="color:${INK_BODY};font-weight:500;margin-bottom:10px;">${escapeHtml(COMPANY.legal_name)}</div>
          <div style="color:${INK_BODY};font-weight:500;">GSTIN : ${escapeHtml(COMPANY.gstin)}</div>
          <div style="color:${INK_BODY};font-weight:500;">Transaction ID : ${escapeHtml(transactionId)}</div>
          <div style="color:${INK_BODY};font-weight:500;">${escapeHtml(COMPANY.city_state)}</div>
          <div style="color:${INK_BODY};font-weight:500;">${escapeHtml(COMPANY.pincode)}</div>
          <div style="color:${INK_BODY};font-weight:500;">${escapeHtml(COMPANY.phone)}</div>
          <div style="color:${INK_BODY};font-weight:500;">${escapeHtml(COMPANY.support_email)}</div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;color:${INK};margin-bottom:8px;">Bill to</div>
          <div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.name)}</div>
          ${billTo.line1 ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.line1)}</div>` : ""}
          ${billTo.line2 ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.line2)}</div>` : ""}
          ${billTo.pin ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.pin)}</div>` : ""}
          ${billTo.state ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.state)}</div>` : ""}
          ${billTo.country ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.country)}</div>` : ""}
          ${billTo.email ? `<div style="color:${INK_BODY};font-weight:500;">${escapeHtml(billTo.email)}</div>` : ""}
        </div>
      </div>

      <div style="font-size:22px;font-weight:700;margin-bottom:6px;color:${INK};line-height:1.3;">
        ${escapeHtml(amountLine)}
      </div>
      ${!isPaid ? `<div style="font-size:14px;color:#1d4ed8;font-weight:600;margin-bottom:28px;">Pay online</div>` : `<div style="margin-bottom:28px;"></div>`}

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;table-layout:fixed;color:${INK_BODY};">
        <colgroup>
          <col style="width:42%" />
          <col style="width:10%" />
          <col style="width:16%" />
          <col style="width:14%" />
          <col style="width:18%" />
        </colgroup>
        <thead>
          <tr>
            <th style="${th}">Description</th>
            <th style="${thR}">Qty</th>
            <th style="${thR}">Unit price</th>
            <th style="${thR}">Tax</th>
            <th style="${thR}">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #9ca3af;">
            <td style="${cell}vertical-align:top;">
              <div style="font-weight:700;color:${INK};">${escapeHtml(planLabel)}</div>
              <div style="color:${INK_MUTED};font-size:12px;font-weight:500;margin-top:4px;">${escapeHtml(period)}</div>
            </td>
            <td style="${cell}text-align:right;vertical-align:top;">1</td>
            <td style="${cell}text-align:right;vertical-align:top;">${formatMoney(baseAmount, currency)}</td>
            <td style="${cell}text-align:right;vertical-align:top;">${india ? `${taxRate}%` : "—"}</td>
            <td style="${cell}text-align:right;vertical-align:top;">${formatMoney(baseAmount, currency)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-left:auto;width:300px;font-size:14px;color:${INK_BODY};font-weight:500;">
        <div style="display:flex;justify-content:space-between;padding:6px 0;">
          <span>Subtotal</span><span>${formatMoney(baseAmount, currency)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;">
          <span>Total excluding tax</span><span>${formatMoney(baseAmount, currency)}</span>
        </div>
        ${gstLine && tax > 0 ? `
        <div style="display:flex;justify-content:space-between;padding:6px 0;gap:12px;">
          <span style="flex:1;">${escapeHtml(gstLine)}</span>
          <span style="white-space:nowrap;">${formatMoney(tax, currency)}</span>
        </div>` : ""}
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;color:${INK};">
          <span>Total</span><span>${formatMoney(total, currency)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:14px 0 0;margin-top:10px;border-top:1px solid #9ca3af;font-weight:700;font-size:15px;color:${INK};">
          <span>${isPaid ? "Amount paid" : "Amount due"}</span>
          <span>${formatMoney(total, currency)} ${currency.code}</span>
        </div>
      </div>

      <div style="margin-top:56px;font-size:13px;color:${INK_MUTED};font-weight:500;line-height:1.5;">
        ${escapeHtml(COMPANY.brand_name)} ${escapeHtml(COMPANY.legal_name.replace(/^by\s+/i, ""))}
      </div>
    </div>
  `;
}

function waitForImage(img) {
  return new Promise((resolve) => {
    if (!img || img.complete) {
      resolve();
      return;
    }
    img.onload = resolve;
    img.onerror = resolve;
  });
}

function mountInvoiceFrame(html) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #1a1a1a;
      }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>${html}</body>
</html>`);
  doc.close();

  return iframe;
}

export async function downloadInvoicePdf({ payment, token }) {
  if (!payment) throw new Error("Payment data is required");
  if (payment.status !== "completed") {
    throw new Error("Invoice is only available for paid transactions");
  }

  const config = await loadInvoiceConfig(token);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const logoSrc = await loadLogoDataUrl(origin);

  const invoiceNumber =
    payment.invoice_number ||
    `${config.invoice_prefix}${payment.id || "invoice"}`;

  const iframe = mountInvoiceFrame(
    buildInvoiceHtml({ payment, config, logoSrc })
  );

  const doc = iframe.contentDocument;
  const invoiceEl = doc.body.firstElementChild;
  await waitForImage(doc.querySelector("img"));
  await new Promise((resolve) => setTimeout(resolve, 120));

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `Invoice_${invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          window: iframe.contentWindow,
          onclone: (clonedDoc) => {
            clonedDoc
              .querySelectorAll("style, link[rel='stylesheet']")
              .forEach((node) => node.remove());
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(invoiceEl)
      .save();
  } finally {
    iframe.remove();
  }
}
