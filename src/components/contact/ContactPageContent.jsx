"use client";

import { useState, useEffect, useMemo } from "react";
import { apiService } from "@/lib/api";
import { Loader2, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveContactContent } from "@/lib/pageContentDefaults";

function generateCaptcha() {
  return (
    Math.random().toString(36).substring(2, 6).toLowerCase() +
    Math.random().toString(36).substring(2, 6).toLowerCase()
  );
}

const inputMarketing =
  "border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]";
const inputPortal =
  "border-[rgba(201,168,76,0.2)] bg-[#1a1814] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.35)] focus-visible:ring-[rgba(201,168,76,0.35)] focus-visible:border-[#C9A84C]";

export default function ContactPageContent({
  variant = "marketing",
  showHeader = true,
  defaultName = "",
  defaultEmail = "",
}) {
  const isPortal = variant === "portal";
  const inputClass = isPortal ? inputPortal : inputMarketing;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: defaultName,
    mobile: "",
    email: defaultEmail,
    reason: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    apiService
      .getPageContent("contact")
      .then((data) => setPageContent(data || {}))
      .catch(() => setPageContent({}));
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: prev.name || defaultName,
      email: prev.email || defaultEmail,
    }));
  }, [defaultName, defaultEmail]);

  const content = useMemo(() => resolveContactContent(pageContent), [pageContent]);
  const { header, details, map_embed_url, form: formCopy } = content;
  const officeLines = Array.isArray(details?.office?.lines)
    ? details.office.lines
    : typeof details?.office?.lines === "string" && details.office.lines.trim()
      ? [details.office.lines.trim()]
      : [];

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.mobile.trim()) return "Mobile number is required.";
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) {
      return "Please enter a valid 10-digit mobile number.";
    }
    if (!form.email.trim()) return "Email is required.";
    if (!form.reason.trim()) return "Reason for contact is required.";
    return null;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  useEffect(() => {
    setCaptchaValid(captchaInput === captcha);
  }, [captchaInput, captcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.submitContact({
        ...form,
        source: isPortal ? "dashboard" : "public",
      });
      if (res?.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res?.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const textPrimary = isPortal ? "text-[#F2EDD8]" : "text-[#F2EDD8]";
  const textMuted = isPortal
    ? "text-[rgba(242,237,216,0.58)]"
    : "text-[rgba(242,237,216,0.58)]";
  const textFaint = isPortal
    ? "text-[rgba(242,237,216,0.32)]"
    : "text-[rgba(242,237,216,0.32)]";
  const panelClass = isPortal
    ? "bg-[#14120e] border border-[rgba(201,168,76,0.22)]"
    : "bg-[#161410] border border-white/10";
  const sectionBg = isPortal ? "bg-transparent" : "bg-[#0E0D09]";

  return (
    <div className={sectionBg}>
      {showHeader && (
        <section
          className={`relative py-8 sm:py-12 text-center ${
            isPortal ? "border-b border-[rgba(255,255,255,0.07)] mb-8" : "py-12 sm:py-16 md:py-24 bg-[#161410] border-b border-white/10"
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <h1
              className={`${
                isPortal
                  ? "font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight"
                  : "text-3xl sm:text-4xl md:text-5xl font-light tracking-tight font-[family-name:var(--font-geist-sans)]"
              } mb-3 sm:mb-4 ${textPrimary}`}
            >
              {header.title}
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-1 ${textMuted}`}>
              {header.subtitle}
            </p>
          </div>
        </section>
      )}

      <section className={isPortal ? "" : "py-10 sm:py-16 md:py-24 bg-[#0E0D09]"}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2
              className={`${
                isPortal
                  ? "font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-normal"
                  : "text-2xl sm:text-3xl font-semibold"
              } mb-8 sm:mb-10 ${textPrimary}`}
            >
              {details.section_title}
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                <div>
                  <h3 className={`text-lg font-medium ${textPrimary}`}>{details.office.label}</h3>
                  <p className={`${textMuted} mt-1 leading-relaxed break-words`}>
                    <a
                      href={details.office.map_url}
                      className="hover:text-[#C9A84C] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {officeLines.map((line, index) => (
                        <span key={`${line}-${index}`}>
                          {line}
                          {index < officeLines.length - 1 && <br />}
                        </span>
                      ))}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                <div>
                  <h3 className={`text-lg font-medium ${textPrimary}`}>{details.phone.label}</h3>
                  <p className={`${textMuted} mt-1`}>
                    <a href={details.phone.tel_href} className="hover:text-[#C9A84C] transition-colors">
                      {details.phone.number}
                    </a>
                  </p>
                  <p className={`text-sm ${textFaint} mt-1`}>{details.phone.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                <div>
                  <h3 className={`text-lg font-medium ${textPrimary}`}>{details.email.label}</h3>
                  <p className={`${textMuted} mt-1`}>
                    <a
                      href={details.email.mailto_href}
                      className="hover:text-[#C9A84C] transition-colors"
                    >
                      {details.email.address}
                    </a>
                  </p>
                  <p className={`text-sm ${textFaint} mt-1`}>{details.email.hours}</p>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 sm:mt-10 h-56 sm:h-64 w-full min-w-0 rounded-lg overflow-hidden ${panelClass}`}
            >
              <iframe
                src={map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </div>

          <div className={`rounded-2xl p-5 sm:p-8 md:p-10 min-w-0 ${panelClass}`}>
            <h2
              className={`${
                isPortal
                  ? "font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-normal"
                  : "text-2xl sm:text-3xl font-semibold"
              } mb-8 ${textPrimary}`}
            >
              {formCopy.title}
            </h2>

            {success ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-[#22C55E] mb-6" />
                <h3 className={`text-2xl font-medium ${textPrimary}`}>{formCopy.success_title}</h3>
                <p className={`mt-4 ${textMuted} max-w-xs mx-auto`}>{formCopy.success_message}</p>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className={`mt-8 ${
                    isPortal
                      ? "border-[rgba(201,168,76,0.25)] bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15]"
                      : "border-white/10 bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15] hover:text-[#F2EDD8]"
                  }`}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={textPrimary}>Full Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={textPrimary}>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={textPrimary}>Phone Number</Label>
                  <Input
                    value={form.mobile}
                    onChange={(e) => update("mobile", e.target.value)}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={textPrimary}>Enter Your Message</Label>
                  <Textarea
                    value={form.reason}
                    onChange={(e) => update("reason", e.target.value)}
                    rows={6}
                    placeholder="How can we help you?"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={textPrimary}>Captcha</Label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div
                      className={`px-4 py-2 rounded font-mono text-lg tracking-widest text-[#C9A84C] text-center shrink-0 ${
                        isPortal ? "bg-[#1a1814] border border-[rgba(201,168,76,0.2)]" : "bg-[#0E0D09] border border-white/10"
                      }`}
                    >
                      {captcha}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCaptcha(generateCaptcha());
                        setCaptchaInput("");
                      }}
                      className={
                        isPortal
                          ? "border-[rgba(201,168,76,0.25)] bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15]"
                          : "border-white/10 bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15] hover:text-[#F2EDD8]"
                      }
                    >
                      Refresh
                    </Button>
                  </div>
                  <Input
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toLowerCase())}
                    placeholder="Enter captcha"
                    className={inputClass}
                  />
                  {!captchaValid && captchaInput && (
                    <p className="text-sm text-[#FF6565]">Captcha does not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !captchaValid}
                  className="w-full bg-[#C9A84C] hover:bg-[#E8D08A] text-[#0E0D09] font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    formCopy.submit_text
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
