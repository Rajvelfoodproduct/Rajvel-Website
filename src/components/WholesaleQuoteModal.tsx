"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Phone, Send, Package, Mail } from "lucide-react";
import { useQuoteModal } from "./QuoteModalContext";
import { COMPANY_INFO, PRODUCTS } from "@/data/siteData";

export function WholesaleQuoteModal() {
  const { isOpen, selectedProduct, closeQuoteModal } = useQuoteModal();
  const [product, setProduct] = useState(selectedProduct);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [bags, setBags] = useState("10 - 25 Bags");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [prevSyncKey, setPrevSyncKey] = useState(
    `${selectedProduct}:${isOpen ? "1" : "0"}`
  );

  const syncKey = `${selectedProduct}:${isOpen ? "1" : "0"}`;
  if (syncKey !== prevSyncKey) {
    setPrevSyncKey(syncKey);
    setProduct(selectedProduct);
    setSubmitted(false);
    setValidationError("");
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuoteModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeQuoteModal]);

  const buildQuoteMessage = () =>
    [
      "Hello Raj Vel Food Products, I would like to request a wholesale quote:",
      `Product: ${product}`,
      `Estimated Volume: ${bags}`,
      `Name: ${contactName.trim().slice(0, 100)}`,
      `Phone: ${phone.trim().slice(0, 20)}`,
      businessName.trim() ? `Business: ${businessName.trim().slice(0, 120)}` : "",
      city.trim() ? `Delivery City: ${city.trim().slice(0, 80)}` : "",
      notes.trim() ? `Notes: ${notes.trim().slice(0, 600)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!contactName.trim()) {
      setValidationError("Please enter your name.");
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setValidationError("Please enter a valid phone number (7–15 digits).");
      return;
    }
    setValidationError("");
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2516]/65 backdrop-blur-sm"
          onClick={closeQuoteModal}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wholesale-quote-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-[#FAF5E8] border border-[#103822]/15 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#103822] text-white px-6 sm:px-8 py-5 sm:py-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D5EA88]">
                  DIRECT FROM SALEM MILL
                </p>
                <h3
                  id="wholesale-quote-modal-title"
                  className="font-serif-display text-2xl sm:text-3xl mt-1"
                >
                  Request a Wholesale Quote
                </h3>
                <p className="text-xs sm:text-sm text-[#D1DFD4] mt-1">
                  Bulk packs for sweets and snacks, caterers &amp;
                  distributors.
                </p>
              </div>
              <button
                type="button"
                onClick={closeQuoteModal}
                aria-label="Close wholesale quote modal"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 max-h-[76svh] overflow-y-auto">
              {submitted ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#D5EA88] text-[#103822] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-display text-2xl text-[#10291B]">
                    Quote Details Ready, {contactName || "Partner"}
                  </h4>
                  <p className="text-sm text-[#4A5E52] max-w-md mx-auto leading-relaxed">
                    Your quote message for{" "}
                    <strong className="text-[#103822]">{product}</strong> ({bags}
                    ) is formatted and ready. Please send it directly to our
                    Salem sales desk via WhatsApp, email, or phone below:
                  </p>

                  <div className="rounded-2xl bg-white border border-[#103822]/12 p-4 text-xs sm:text-sm text-left space-y-1 text-[#10291B]">
                    <p>
                      <strong>Product:</strong> {product} ({bags})
                    </p>
                    <p>
                      <strong>Contact:</strong> {contactName} • {phone}
                    </p>
                    {city && (
                      <p>
                        <strong>Location:</strong> {city}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
                    <a
                      href={`https://wa.me/919677393659?text=${encodeURIComponent(
                        buildQuoteMessage()
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#D5EA88]" />
                      Send Quote via WhatsApp
                    </a>
                    <a
                      href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                        `Wholesale Quote Request — ${product}`
                      )}&body=${encodeURIComponent(buildQuoteMessage())}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#103822]/25 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-5 py-3.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Send via Email
                    </a>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-4">
                    <a
                      href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#286B43] hover:text-[#103822]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call {COMPANY_INFO.phones[0]}
                    </a>
                    <button
                      type="button"
                      onClick={closeQuoteModal}
                      className="text-xs font-semibold text-[#4A5E52] hover:text-[#10291B] underline cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="quote-product-select"
                      className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                    >
                      Select Product Range
                    </label>
                    <div className="relative">
                      <Package className="w-4 h-4 text-[#286B43] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="quote-product-select"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-full rounded-xl border border-[#103822]/20 bg-white pl-10 pr-4 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      >
                        {PRODUCTS.map((p) => (
                          <option
                            key={p.slug}
                            value={`${p.name} — ${p.subtitle}`}
                          >
                            {p.name} — {p.subtitle}
                          </option>
                        ))}
                        <option value="Mixed Wholesale Order (Semmai + Uzhavan + Aruvi)">
                          Mixed Wholesale Order (Semmai + Uzhavan + Aruvi)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="quote-contact-name"
                        className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="quote-contact-name"
                        required
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Karthik Vel"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quote-phone"
                        className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="quote-phone"
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="quote-business"
                        className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                      >
                        Business / Shop Name
                      </label>
                      <input
                        id="quote-business"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Sweet Stall / Bakery / Store"
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quote-volume"
                        className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                      >
                        Estimated Volume
                      </label>
                      <select
                        id="quote-volume"
                        value={bags}
                        onChange={(e) => setBags(e.target.value)}
                        className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      >
                        <option>1 - 9 Bags</option>
                        <option>10 - 25 Bags</option>
                        <option>26 - 100 Bags (Monthly)</option>
                        <option>100+ Bags (Distributor / Bulk)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="quote-city"
                      className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                    >
                      Delivery City / Town
                    </label>
                    <input
                      id="quote-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Salem, Erode, Namakkal, Coimbatore, Chennai"
                      className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quote-notes"
                      className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#286B43] mb-1.5"
                    >
                      Additional Requirements
                    </label>
                    <textarea
                      id="quote-notes"
                      rows={2}
                      maxLength={600}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us about your recipe application or delivery schedule..."
                      className="w-full rounded-xl border border-[#103822]/20 bg-white px-3.5 py-2 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                    />
                  </div>

                  {validationError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs font-medium text-red-700"
                    >
                      {validationError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.16em] uppercase py-3.5 px-6 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#D5EA88]" />
                    Prepare Wholesale Quote
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
