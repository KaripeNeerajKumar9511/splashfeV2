"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Loader2, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MarketingNav from "@/components/home/MarketingNav";

export default function ContactPage() {
  const generateCaptcha = () => {
    return Math.random().toString(36).substring(2, 6).toLocaleLowerCase() + Math.random().toString(36).substring(2, 6).toLocaleLowerCase();
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    reason: "",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.mobile.trim()) return "Mobile number is required.";
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, "")))
      return "Please enter a valid 10-digit mobile number.";
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
      const res = await apiService.submitContact(form);
      if (res?.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res?.error || "Something went wrong.");
      }
    } catch (e) {
      toast.error(e?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="marketing-page min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#0E0D09] text-[#F2EDD8] [--nav-h:64px] pt-[var(--nav-h)] max-md:[--nav-h:56px]">
      <MarketingNav />

      <div className="min-h-[calc(100dvh-var(--nav-h))]">
        {/* Header */}
        <section className="relative py-12 sm:py-16 md:py-24 bg-[#161410] text-center border-b border-white/10">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 sm:mb-6 text-[#F2EDD8] font-[family-name:var(--font-geist-sans)]">
              Contact Us
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[rgba(242,237,216,0.58)] max-w-2xl mx-auto leading-relaxed px-1">
              We&apos;d love to hear from you. Please fill out the form below or reach
              out to us directly.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 sm:py-16 md:py-24 bg-[#0E0D09]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10 text-[#F2EDD8]">
                Get in Touch
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#F2EDD8]">
                      Office Address
                    </h3>
                    <p className="text-[rgba(242,237,216,0.58)] mt-1 leading-relaxed break-words">
                      <a
                        href="https://maps.app.goo.gl/3tMuX7F4xemYYrxH6"
                        className="hover:text-[#C9A84C] transition-colors"
                        target="_blank"
                      >
                        501, Manjeera Majestic Commercial Complex,
                        <br />
                        JNTU Road,KPHB, Hyderabad , Telangana, India 500085
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#F2EDD8]">
                      Contact Number
                    </h3>
                    <p className="text-[rgba(242,237,216,0.58)] mt-1">
                      <a
                        href="tel:+918790900881"
                        className="hover:text-[#C9A84C] transition-colors"
                      >
                        +91 8790900881
                      </a>
                    </p>
                    <p className="text-sm text-[rgba(242,237,216,0.32)] mt-1">
                      Assistance hours: Monday - Sunday 24/7 Hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#F2EDD8]">
                      Email Address
                    </h3>
                    <p className="text-[rgba(242,237,216,0.58)] mt-1">
                      <a
                        href="mailto:support@gosplash.ai"
                        className="hover:text-[#C9A84C] transition-colors"
                      >
                        support@gosplash.ai
                      </a>
                    </p>
                    <p className="text-sm text-[rgba(242,237,216,0.32)] mt-1">
                      Assistance hours: Monday - Sunday 24/7 Hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="mt-8 sm:mt-10 h-56 sm:h-64 w-full min-w-0 bg-[#161410] rounded-lg overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.323180100733!2d78.39097917516732!3d17.492079483413075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910057424ed5%3A0x199dce60198e6b9b!2sTechsprout%20AI%20Labs%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1770624140087!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#161410] rounded-2xl p-5 sm:p-8 md:p-10 border border-white/10 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-[#F2EDD8]">
                Have any query?
              </h2>

              {success ? (
                <div className="py-12 text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-[#22C55E] mb-6" />
                  <h3 className="text-2xl font-semibold text-[#F2EDD8]">
                    Thank you!
                  </h3>
                  <p className="mt-4 text-[rgba(242,237,216,0.58)] max-w-xs mx-auto">
                    We have received your message and will get back to you shortly.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="mt-8 border-white/10 bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15] hover:text-[#F2EDD8]"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#F2EDD8]">Full Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        className="border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#F2EDD8]">Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="your@email.com"
                        className="border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#F2EDD8]">Phone Number</Label>
                    <Input
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      placeholder="10-digit mobile number"
                      className="border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#F2EDD8]">Enter Your Message</Label>
                    <Textarea
                      value={form.reason}
                      onChange={(e) => update("reason", e.target.value)}
                      rows={6}
                      placeholder="How can we help you?"
                      className="border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#F2EDD8]">Captcha</Label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <div className="px-4 py-2 bg-[#0E0D09] border border-white/10 rounded font-mono text-lg tracking-widest text-[#C9A84C] text-center shrink-0">
                        {captcha}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCaptcha(generateCaptcha());
                          setCaptchaInput("");
                        }}
                        className="border-white/10 bg-transparent text-[#F2EDD8] hover:bg-[#1E1C15] hover:text-[#F2EDD8]"
                      >
                        Refresh
                      </Button>
                    </div>

                    <Input
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.toLowerCase())}
                      placeholder="Enter captcha"
                      className="border-white/10 bg-[#0E0D09] text-[#F2EDD8] placeholder:text-[rgba(242,237,216,0.32)] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                    />

                    {!captchaValid && captchaInput && (
                      <p
                        className="text-sm text-[#FF6565]"
                        style={{ fontSize: "12px" }}
                      >
                        Captcha does not match
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !captchaValid}
                    className="w-full bg-[#C9A84C] hover:bg-[#E8D08A] text-[#0E0D09] font-bold disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}