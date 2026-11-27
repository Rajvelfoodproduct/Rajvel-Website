"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Package,
  PhoneCall,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { COMPANY_INFO, type ProductItem } from "@/data/siteData";
import { Reveal } from "@/components/MotionPrimitives";
import { useQuoteModal } from "@/components/QuoteModalContext";
import { useCart } from "@/components/CartContext";

export function ProductDetailClient({
  product,
  otherProducts,
}: {
  product: ProductItem;
  otherProducts: ProductItem[];
}) {
  const { openQuoteModal } = useQuoteModal();
  const { addToCart } = useCart();

  return (
    <div className="grain-surface bg-[#FAF5E8] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#286B43] hover:text-[#103822] mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Products
        </Link>

        {/* Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Poster Frame */}
          <Reveal className="lg:col-span-5">
            <div
              className="rounded-3xl p-5 sm:p-8 flex items-center justify-center shadow-lg border border-[#103822]/12"
              style={{ backgroundColor: product.cardBg }}
            >
              <img
                src={product.image}
                alt={`${product.name} — ${product.subtitle}`}
                width={933}
                height={1400}
                className="w-full max-w-sm sm:max-w-md h-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.08} className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full bg-[#103822] text-[#D5EA88]">
                {product.category}
              </span>
              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#10291B] mt-3.5">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#286B43] mt-1">
                {product.subtitle}
              </p>
            </div>

            <p className="text-base text-[#4A5E52] leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.nutritionFocus.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-4"
                >
                  <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#4A5E52]">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-[#103822] mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Freshness & Quality */}
            <div className="rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#286B43] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#103822]">
                    Freshness &amp; Packing
                  </p>
                  <p className="text-sm text-[#4A5E52] mt-0.5">
                    Hygienically sealed food-grade packing
                  </p>
                  <p className="text-xs text-[#4A5E52] mt-0.5">
                    Batch-coded for quality traceability
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#286B43] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#103822]">
                    Quality &amp; Licensing
                  </p>
                  <p className="text-sm text-[#4A5E52] mt-0.5">
                    FSSAI Lic. No: {COMPANY_INFO.fssai}
                  </p>
                  <p className="text-xs text-[#4A5E52] mt-0.5">
                    Manufactured in Kadayampatti, Salem
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredients & Ideal For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-5 sm:p-6">
                <h2 className="text-xs font-bold tracking-[0.16em] uppercase text-[#286B43] mb-3">
                  Ingredients &amp; Highlights
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E5EEDD] text-[#103822]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <ul className="space-y-2">
                  {product.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-sm text-[#10291B] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#286B43] shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-5 sm:p-6">
                <h2 className="text-xs font-bold tracking-[0.16em] uppercase text-[#286B43] mb-3">
                  Ideal Culinary Uses
                </h2>
                <ul className="space-y-2.5">
                  {product.idealFor.map((use) => (
                    <li
                      key={use}
                      className="text-sm text-[#10291B] flex items-center gap-2"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-[#286B43] shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => addToCart(product.slug, 1, true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-7 py-4 shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D5EA88]" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() =>
                  openQuoteModal(`${product.name} — ${product.subtitle}`)
                }
                className="flex-1 sm:flex-initial rounded-full bg-[#D5EA88] hover:bg-[#c8e073] text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-7 py-4 shadow-sm transition-all cursor-pointer"
              >
                Request Wholesale Quote
              </button>
              <a
                href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#103822]/30 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-4 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Call {COMPANY_INFO.phones[0]}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Other Products */}
        <div className="mt-16 sm:mt-20 pt-10 sm:pt-12 border-t border-[#103822]/12">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#10291B] mb-6">
            Explore more from Raj Vel Food Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherProducts.map((other) => (
              <Link
                key={other.slug}
                href={`/products/${other.slug}`}
                className="group rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-4 sm:p-5 flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all"
              >
                <div
                  className="w-20 h-24 sm:w-24 sm:h-24 rounded-xl p-2 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: other.cardBg }}
                >
                  <img
                    src={other.image}
                    alt={`${other.name} — ${other.subtitle}`}
                    width={180}
                    height={260}
                    loading="lazy"
                    className="h-full w-auto object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#286B43]">
                    {other.category}
                  </p>
                  <h3 className="font-serif-display text-xl sm:text-2xl text-[#10291B]">
                    {other.name}
                  </h3>
                  <p className="text-sm text-[#4A5E52] mt-0.5 truncate">
                    {other.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#103822] shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
