"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, ArrowRight, Package, ShoppingBag } from "lucide-react";
import { COMPANY_INFO, type ProductItem } from "@/data/siteData";
import { useQuoteModal } from "./QuoteModalContext";
import { useCart } from "./CartContext";

interface ProductPosterModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export function ProductPosterModal({
  product,
  onClose,
}: ProductPosterModalProps) {
  const { openQuoteModal } = useQuoteModal();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092113]/75 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="poster-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-[#FAF5E8] overflow-y-auto md:overflow-hidden shadow-2xl border border-[#103822]/15 grid grid-cols-1 md:grid-cols-12 max-h-[90svh]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product preview"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-[#103822] shadow-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full Poster Visual */}
            <div
              className="md:col-span-6 p-5 sm:p-6 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: product.cardBg }}
            >
              <img
                src={product.image}
                alt={`${product.name} ${product.subtitle} Pack`}
                width={933}
                height={1400}
                className="max-h-[46svh] md:max-h-[70svh] w-auto object-contain rounded-2xl shadow-xl"
              />
            </div>

            {/* Product Details */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto gap-6">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-[#103822]/10 text-[#1A5434]">
                  {product.category}
                </span>

                <div>
                  <h3
                    id="poster-modal-title"
                    className="font-serif-display text-3xl sm:text-4xl text-[#10291B]"
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#286B43] mt-1">
                    {product.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed">
                  {product.fullDescription}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl bg-white border border-[#103822]/10 p-3.5">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#4A5E52]">
                      Packing
                    </p>
                    <p className="text-sm font-bold text-[#103822] mt-0.5 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#286B43]" />
                      Food-Grade Sealed
                    </p>
                    <p className="text-xs text-[#4A5E52] mt-0.5">
                      Hygienic bulk bag
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-[#103822]/10 p-3.5">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#4A5E52]">
                      Quality Standard
                    </p>
                    <p className="text-sm font-bold text-[#103822] mt-0.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#286B43]" />
                      FSSAI Certified
                    </p>
                    <p className="text-xs text-[#4A5E52] mt-0.5">
                      Lic. {COMPANY_INFO.fssai}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#286B43] mb-2">
                    Key Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-[#E5EEDD] text-[#103822]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#103822]/10">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    addToCart(product.slug, 1, true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.14em] uppercase py-3 px-5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D5EA88]" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openQuoteModal(`${product.name} — ${product.subtitle}`);
                  }}
                  className="rounded-full bg-[#D5EA88] hover:bg-[#c8e073] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase py-3 px-5 transition-colors cursor-pointer"
                >
                  Get Quote
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#103822]/25 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase py-3 px-4 transition-colors"
                >
                  Full Specs
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
