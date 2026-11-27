"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Minus,
  Package,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { COMPANY_INFO, PRODUCTS } from "@/data/siteData";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    totalBags,
    totalKg,
    closeCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
  } = useCart();

  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  const detailedItems = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.slug === item.slug);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const missingProducts = PRODUCTS.filter(
    (p) => !items.some((i) => i.slug === p.slug)
  );

  const buildOrderSummary = () => {
    const cleanName = buyerName.trim().slice(0, 100);
    const cleanPhone = phone.trim().slice(0, 20);
    const cleanCity = city.trim().slice(0, 80);
    const lines = detailedItems.map(
      ({ product, quantity }) =>
        `- ${product.name} (${product.subtitle}): ${quantity} x 30 kg (${
          quantity * 30
        } kg)`
    );
    return `Hello Raj Vel Food Products, I would like to place a wholesale order inquiry:\n${lines.join(
      "\n"
    )}\nTotal Volume: ${totalBags} bags (${totalKg} kg)\nName: ${cleanName}\nPhone: ${cleanPhone}${
      cleanCity ? `\nLocation: ${cleanCity}` : ""
    }`;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!buyerName.trim()) {
      setValidationError("Please enter your name or business name.");
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setValidationError("Please enter a valid phone number (7–15 digits).");
      return;
    }
    setValidationError("");
    setSubmitted(true);
  };

  const resetOrderView = () => {
    setSubmitted(false);
    clearCart();
    setBuyerName("");
    setPhone("");
    setCity("");
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#0A2214]/60 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#FAF5E8] border-l border-[#103822]/15 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#103822] text-white px-5 sm:px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D5EA88] text-[#103822] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D5EA88]">
                    WHOLESALE ORDER BAG
                  </p>
                  <h2
                    id="cart-drawer-title"
                    className="font-serif-display text-2xl leading-none mt-0.5"
                  >
                    Your 30 kg Cart
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart drawer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {submitted ? (
                <div className="rounded-3xl bg-white border border-[#103822]/12 p-6 sm:p-7 text-center space-y-4 my-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#D5EA88] text-[#103822] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif-display text-2xl text-[#10291B]">
                    Order Summary Ready, {buyerName || "Partner"}
                  </h3>
                  <p className="text-sm text-[#4A5E52] leading-relaxed">
                    Your wholesale summary of{" "}
                    <strong className="text-[#103822]">
                      {totalBags} x 30 kg packs ({totalKg} kg total)
                    </strong>{" "}
                    is ready. Tap below to send the prepared order message to
                    our Salem dispatch desk on WhatsApp:
                  </p>

                  <div className="pt-2 space-y-2.5">
                    <a
                      href={`https://wa.me/919677393659?text=${encodeURIComponent(
                        buildOrderSummary()
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#D5EA88]" />
                      Send Order on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full rounded-full border border-[#103822]/20 text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-2.5 hover:bg-[#103822]/5 transition-colors cursor-pointer"
                    >
                      Edit Cart Items
                    </button>
                    <button
                      type="button"
                      onClick={resetOrderView}
                      className="w-full text-xs font-semibold text-[#4A5E52] hover:text-[#10291B] py-1 cursor-pointer"
                    >
                      Done &amp; Clear Cart
                    </button>
                  </div>
                </div>
              ) : detailedItems.length === 0 ? (
                <div className="rounded-3xl bg-white border border-[#103822]/10 p-7 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#E5EEDD] text-[#103822] flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#10291B]">
                      Your wholesale bag is empty
                    </h3>
                    <p className="text-sm text-[#4A5E52] mt-1 leading-relaxed">
                      Select any 30 kg Raj Vel flour pack below to build your
                      dispatch order.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {detailedItems.map(({ product, quantity }) => (
                    <div
                      key={product.slug}
                      className="rounded-2xl bg-white border border-[#103822]/12 p-3.5 shadow-sm flex items-center gap-3.5"
                    >
                      <div
                        className="w-16 h-20 rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-[#103822]/10"
                        style={{ backgroundColor: product.cardBg }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          width={120}
                          height={160}
                          className="h-full w-auto object-contain rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-serif-display text-lg text-[#10291B] leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-xs font-medium text-[#4A5E52] truncate">
                              {product.subtitle} • 30 kg
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(product.slug)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="p-1.5 text-[#4A5E52] hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-full border border-[#103822]/15 bg-[#FAF5E8] p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQty(product.slug, -1)}
                              aria-label={`Decrease ${product.name} bag quantity`}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#103822] hover:bg-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-[#10291B] tabular-nums">
                              {quantity} bag{quantity > 1 ? "s" : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(product.slug, 1)}
                              aria-label={`Increase ${product.name} bag quantity`}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#103822] hover:bg-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-[#286B43] tabular-nums">
                            {quantity * 30} kg
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Section */}
              {!submitted && missingProducts.length > 0 && (
                <div className="pt-2 space-y-2.5">
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#4A5E52]">
                    {detailedItems.length === 0
                      ? "QUICK ADD 30 KG PACKS"
                      : "ADD ANOTHER BLEND"}
                  </p>
                  <div className="space-y-2">
                    {missingProducts.map((product) => (
                      <button
                        key={product.slug}
                        type="button"
                        onClick={() => addToCart(product.slug, 1, false)}
                        className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white/90 hover:bg-white border border-[#103822]/10 p-3 transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-14 rounded-lg p-1 shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: product.cardBg }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              width={88}
                              height={112}
                              className="h-full w-auto object-contain rounded"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif-display text-base text-[#10291B] leading-tight">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#4A5E52] truncate">
                              {product.subtitle} • 30 kg
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#E5EEDD] text-[#103822] text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5">
                          <Plus className="w-3 h-3" />
                          Add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Checkout Details when items present */}
              {!submitted && detailedItems.length > 0 && (
                <form
                  id="cart-checkout-form"
                  onSubmit={handleCheckout}
                  className="pt-4 border-t border-[#103822]/12 space-y-3"
                >
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#286B43]">
                    DISPATCH DETAILS
                  </p>
                  {validationError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                    >
                      {validationError}
                    </p>
                  )}
                  <div>
                    <label htmlFor="cart-buyer-name" className="sr-only">
                      Your Name or Business Name
                    </label>
                    <input
                      id="cart-buyer-name"
                      required
                      type="text"
                      maxLength={100}
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Your Name / Business Name *"
                      className="w-full rounded-xl border border-[#103822]/18 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="cart-buyer-phone" className="sr-only">
                        Phone Number
                      </label>
                      <input
                        id="cart-buyer-phone"
                        required
                        type="tel"
                        maxLength={20}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full rounded-xl border border-[#103822]/18 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                    <div>
                      <label htmlFor="cart-buyer-city" className="sr-only">
                        City or District
                      </label>
                      <input
                        id="cart-buyer-city"
                        type="text"
                        maxLength={80}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City / District"
                        className="w-full rounded-xl border border-[#103822]/18 bg-white px-3.5 py-2.5 text-sm text-[#10291B] focus:outline-none focus:ring-2 focus:ring-[#103822]"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Totals & Submit */}
            {!submitted && detailedItems.length > 0 && (
              <div className="bg-white border-t border-[#103822]/12 px-5 sm:px-6 py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#4A5E52]">
                    Total Wholesale Volume
                  </span>
                  <span className="font-serif-display text-xl text-[#103822]">
                    {totalBags} Bag{totalBags > 1 ? "s" : ""} • {totalKg} kg
                  </span>
                </div>
                <button
                  type="submit"
                  form="cart-checkout-form"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase py-3.5 shadow-md transition-all cursor-pointer"
                >
                  Prepare WhatsApp Order ({totalKg} kg)
                </button>
                <p className="text-center text-[11px] text-[#4A5E52]">
                  Direct dispatch desk: {COMPANY_INFO.phones[0]}
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
