"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { COMPANY_INFO, PRODUCTS } from "@/data/siteData";
import { Reveal } from "@/components/MotionPrimitives";
import { TiltCard3D } from "@/components/TiltCard3D";

const INQUIRY_TOPICS = [
  "Wholesale Packs",
  "Request Flour Sample",
  "Dealership / Distributor",
  "Bulk Bakery / Sweet Stall Supply",
];

export function ContactClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(INQUIRY_TOPICS[0]);
  const [productChoice, setProductChoice] = useState("All Three Brands");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(
    null
  );

  const handleCopy = (val: string, key: "phone" | "email") => {
    try {
      navigator.clipboard.writeText(val);
      setCopiedField(key);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // Ignore clipboard failures cleanly
    }
  };

  const cleanName = name.trim().slice(0, 100);
  const cleanPhone = phone.trim().slice(0, 20);
  const cleanEmail = email.trim().slice(0, 120);
  const cleanMessage = message.trim().slice(0, 1000);

  const whatsAppMsg = [
    "Hello Raj Vel Food Products,",
    `Name: ${cleanName}`,
    `Phone: ${cleanPhone}`,
    cleanEmail ? `Email: ${cleanEmail}` : "",
    `Inquiry Purpose: ${interest}`,
    `Product Range: ${productChoice}`,
    `Message: ${cleanMessage}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsAppUrl = `https://wa.me/919677393659?text=${encodeURIComponent(
    whatsAppMsg
  )}`;

  const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
    `${interest} — ${productChoice} (${cleanName})`
  )}&body=${encodeURIComponent(whatsAppMsg)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!cleanName || !cleanMessage) {
      setValidationError("Please complete all required fields.");
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setValidationError("Please enter a valid phone number (7–15 digits).");
      return;
    }
    setValidationError("");
    setPrepared(true);
  };

  return (
    <div className="grain-surface bg-[#FAF5E8]">
      {/* =====================================================================
          HERO BAND
      ===================================================================== */}
      <section className="relative bg-gradient-to-br from-[#103822] via-[#15482C] to-[#0B2818] text-white py-16 sm:py-22 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 w-[400px] h-[400px] rounded-full bg-[#D5EA88]/10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
              <Phone className="w-3.5 h-3.5" />
              DIRECT MILL DESK • SALEM, TAMIL NADU
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-[54px] mt-4 leading-[1.08] tracking-[-0.02em]">
              Speak with Raj Vel Food Products
            </h1>
            <p className="text-base sm:text-lg text-[#DCE8DE] max-w-2xl mt-3.5 leading-relaxed">
              Reach our Kadayampatti facility for wholesale bag pricing, sample
              flour tins, or regular B2B kitchen &amp; trade dispatch.
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#D5EA88] hover:bg-white text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 shadow-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call {COMPANY_INFO.phones[0]}
            </a>
            <a
              href="https://wa.me/919677393659"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#D5EA88]" />
              WhatsApp Desk
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CONTACT DESK & ENQUIRY STUDIO
      ===================================================================== */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Mill Command Card */}
          <Reveal className="lg:col-span-5 space-y-6">
            <TiltCard3D>
              <div className="rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold tracking-[0.15em] uppercase text-[#286B43]">
                      Manufacturing &amp; Marketing Unit
                    </h2>
                    <p className="text-sm sm:text-base text-[#10291B] mt-1.5 leading-relaxed font-medium">
                      {COMPANY_INFO.name}
                      <br />
                      {COMPANY_INFO.addressLine1}
                      <br />
                      {COMPANY_INFO.addressLine2}
                      <br />
                      {COMPANY_INFO.addressLine3}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#103822]/10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-extrabold tracking-[0.15em] uppercase text-[#286B43]">
                        Direct Mill Line
                      </h2>
                      <div className="mt-1.5 flex flex-col gap-1 text-sm sm:text-base font-bold text-[#10291B]">
                        <a
                          href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                          className="hover:text-[#286B43]"
                        >
                          {COMPANY_INFO.phones[0]}
                        </a>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(COMPANY_INFO.phones[0], "phone")}
                    className="rounded-full bg-[#FAF5E8] hover:bg-[#E5EEDD] border border-[#103822]/15 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#103822] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#286B43]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-5 border-t border-[#103822]/10 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs font-extrabold tracking-[0.15em] uppercase text-[#286B43]">
                        Email Desk
                      </h2>
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="text-sm sm:text-base font-bold text-[#10291B] hover:text-[#286B43] mt-1.5 block break-all"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(COMPANY_INFO.email, "email")}
                    className="shrink-0 rounded-full bg-[#FAF5E8] hover:bg-[#E5EEDD] border border-[#103822]/15 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#103822] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#286B43]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-5 border-t border-[#103822]/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl bg-[#FAF5E8] p-4 border border-[#103822]/10">
                    <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#286B43]">
                      <Clock className="w-3.5 h-3.5" />
                      Dispatch Hours
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#10291B] mt-1">
                      Mon – Sat • 8:30 AM – 7:00 PM
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#103822] text-white p-4">
                    <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#D5EA88]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      FSSAI Certified
                    </div>
                    <p className="text-xs sm:text-sm font-bold mt-1">
                      Lic. No: {COMPANY_INFO.fssai}
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </Reveal>

          {/* Right: Interactive Enquiry Form Studio */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 sm:p-10 shadow-sm">
              {prepared ? (
                <div className="py-6 sm:py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#D5EA88] text-[#103822] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif-display text-2xl sm:text-3xl text-[#10291B]">
                      Enquiry Message Prepared, {name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4A5E52] max-w-lg mx-auto leading-relaxed">
                      Your enquiry details for{" "}
                      <strong className="text-[#103822]">{interest}</strong> (
                      {productChoice}) have been formatted below. To complete
                      your enquiry, please send the prepared message to our
                      Salem desk via WhatsApp or Email:
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAF5E8] border border-[#103822]/12 p-4 max-w-lg mx-auto text-left text-xs sm:text-sm text-[#10291B] space-y-1">
                    <p>
                      <strong>Name:</strong> {name} ({phone}
                      {email ? ` • ${email}` : ""})
                    </p>
                    <p>
                      <strong>Purpose:</strong> {interest} — {productChoice}
                    </p>
                    <p>
                      <strong>Requirement:</strong> {message}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.14em] uppercase px-7 py-3.5 shadow-md transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#D5EA88]" />
                      Send Message in WhatsApp
                    </a>
                    <a
                      href={mailtoUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#103822]/25 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Send via Email App
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPrepared(false)}
                      className="text-xs font-semibold text-[#4A5E52] hover:text-[#10291B] underline cursor-pointer"
                    >
                      Edit Enquiry Details
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#286B43]">
                      WHOLESALE &amp; SAMPLE DESK
                    </p>
                    <h2 className="font-serif-display text-3xl sm:text-4xl text-[#10291B] mt-1">
                      Prepare a Direct Enquiry
                    </h2>
                    <p className="text-sm text-[#4A5E52] mt-1">
                      Enter your details below to format a direct WhatsApp or
                      email message for our Salem team.
                    </p>
                  </div>

                  {/* Quick Topic Selector Chips */}
                  <div>
                    <span className="block text-xs font-extrabold tracking-[0.14em] uppercase text-[#286B43] mb-2">
                      Inquiry Purpose
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TOPICS.map((topic) => {
                        const selected = interest === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setInterest(topic)}
                            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                              selected
                                ? "bg-[#103822] text-[#D5EA88] shadow-sm"
                                : "bg-[#FAF5E8] text-[#10291B] border border-[#103822]/12 hover:bg-[#E5EEDD]"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-xs font-extrabold tracking-[0.12em] uppercase text-[#286B43] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-full-name"
                        required
                        type="text"
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name or shop name"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-4 py-3 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-extrabold tracking-[0.12em] uppercase text-[#286B43] mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        required
                        type="tel"
                        maxLength={20}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-4 py-3 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-extrabold tracking-[0.12em] uppercase text-[#286B43] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        maxLength={120}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@business.com"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-4 py-3 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-product-range"
                        className="block text-xs font-extrabold tracking-[0.12em] uppercase text-[#286B43] mb-1.5"
                      >
                        Preferred Flour Range
                      </label>
                      <select
                        id="contact-product-range"
                        value={productChoice}
                        onChange={(e) => setProductChoice(e.target.value)}
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-4 py-3 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      >
                        <option>All Three Brands</option>
                        {PRODUCTS.map((p) => (
                          <option key={p.slug}>
                            {p.name} — {p.subtitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-extrabold tracking-[0.12em] uppercase text-[#286B43] mb-1.5"
                    >
                      Message &amp; Requirement *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      maxLength={1000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share bag quantity, delivery town/district, or sample requests..."
                      className="w-full rounded-xl border border-[#103822]/20 bg-white px-4 py-3 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                    />
                  </div>

                  {validationError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-700"
                    >
                      {validationError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D5EA88]" />
                    Prepare WhatsApp / Email Enquiry
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
