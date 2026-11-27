"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { COMPANY_INFO, PRODUCTS, type ProductItem } from "@/data/siteData";
import { Reveal, StaggerCard, StaggerGrid } from "@/components/MotionPrimitives";
import { TiltCard3D } from "@/components/TiltCard3D";
import { useQuoteModal } from "@/components/QuoteModalContext";
import { useCart } from "@/components/CartContext";

interface ServiceSegment {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  desc: string;
  recommended: string;
  targetSlug: ProductItem["slug"];
  dishImage: string;
  benefits: string[];
}

const SERVICE_SEGMENTS: ServiceSegment[] = [
  {
    icon: Store,
    tag: "SWEET STALLS & BAKERIES",
    title: "Sweet Shops & Mithai Makers",
    desc: "Consistent roast behaviour, authentic nutty aroma, and bright golden finish for Mysore Pak, Besan Laddu, and delicate Boondi.",
    recommended: "Semmai Pure Gram Flour",
    targetSlug: "semmai",
    dishImage: "/images/dishes/mysore-pak.jpg",
    benefits: [
      "100% pure Bengal gram roast profile",
      "Smooth lump-free ghee blending",
    ],
  },
  {
    icon: Building2,
    tag: "CATERING & HOSPITALITY",
    title: "Hotels, Restaurants & Caterers",
    desc: "High-yield batters for crispy bajji, bonda, and onion pakoda with dependable batch consistency across large banquet events.",
    recommended: "Uzhavan Multi-Grain Flour",
    targetSlug: "uzhavan",
    dishImage: "/images/dishes/bajji-bonda.jpg",
    benefits: ["Even, airy coating adhesion", "Minimal grease retention"],
  },
  {
    icon: UtensilsCrossed,
    tag: "NAMKEEN & SNACK FACTORIES",
    title: "Commercial Snack & Namkeen Units",
    desc: "Balanced multi-grain blends formulated for crisp murukku, kara mixture, ribbon pakoda, and noticeably lighter oil absorption.",
    recommended: "Aruvi Multi-Grain Flour",
    targetSlug: "aruvi",
    dishImage: "/images/dishes/murukku-pakoda.jpg",
    benefits: ["Longer shelf crunch", "Clean uniform ribbon extrusion"],
  },
  {
    icon: Truck,
    tag: "REGIONAL TRADE & DEALERS",
    title: "Wholesale Traders & Distributors",
    desc: "Direct Salem mill pricing, hygienically sealed moisture-protective packaging, and responsive transport coordination across Tamil Nadu.",
    recommended: "Full Raj Vel 3-Brand Portfolio",
    targetSlug: "semmai",
    dishImage: "/images/dishes/mixture-laddu.jpg",
    benefits: ["Batch-coded FSSAI sacks", "Mixed-blend pallet dispatch"],
  },
];

export function ServicesClient() {
  const { openQuoteModal } = useQuoteModal();
  const { addToCart } = useCart();

  const [calcSlug, setCalcSlug] = useState<ProductItem["slug"]>("semmai");
  const [calcBags, setCalcBags] = useState(5);

  const selectedCalcProduct =
    PRODUCTS.find((p) => p.slug === calcSlug) || PRODUCTS[0];

  return (
    <div className="grain-surface bg-[#FAF5E8]">
      {/* =====================================================================
          HERO + LIVE 30 KG WHOLESALE DISPATCH BUILDER
      ===================================================================== */}
      <section className="relative bg-gradient-to-br from-[#103822] via-[#15482C] to-[#0B2818] text-white py-16 sm:py-22 lg:py-24 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#D5EA88]/10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
              <Truck className="w-3.5 h-3.5" />
              WHOLESALE &amp; B2B MILL SUPPLY
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-[-0.02em]">
              Dependable bulk supply built for food makers.
            </h1>
            <p className="text-base sm:text-lg text-[#DCE8DE] leading-relaxed max-w-xl">
              Direct Salem mill supply with uniform fineness, sealed food-grade
              packing, and timely dispatch.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#D5EA88]" />
                FSSAI Lic. {COMPANY_INFO.fssai}
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Package className="w-4 h-4 text-[#D5EA88]" />
                Batch-coded &amp; hygienically sealed
              </span>
            </div>
          </Reveal>

          {/* Interactive Dispatch Estimator Card */}
          <Reveal delay={0.1} className="lg:col-span-6">
            <TiltCard3D>
              <div className="rounded-3xl bg-[#FFFDF7] text-[#10291B] p-5 sm:p-8 shadow-[0_32px_70px_-20px_rgba(0,0,0,0.45)] border border-white/30 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#286B43]">
                      QUICK DISPATCH BUILDER
                    </p>
                    <h2 className="font-serif-display text-2xl sm:text-3xl text-[#10291B] mt-0.5">
                      Build a 30 kg Bag Order
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#E5EEDD] text-[#103822] text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 shrink-0">
                    30 kg Pack
                  </span>
                </div>

                {/* Product Selector Pills */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {PRODUCTS.map((p) => {
                    const active = calcSlug === p.slug;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => setCalcSlug(p.slug)}
                        aria-pressed={active}
                        className={`rounded-2xl p-2 sm:p-2.5 border transition-all cursor-pointer flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-2.5 ${
                          active
                            ? "bg-[#103822] text-white border-[#103822] shadow-md"
                            : "bg-[#FAF5E8] hover:bg-white text-[#10291B] border-[#103822]/12"
                        }`}
                      >
                        <div
                          className="w-10 h-12 rounded-lg p-1 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: p.cardBg }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            width={80}
                            height={110}
                            className="h-full w-auto object-contain rounded"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif-display text-sm sm:text-base leading-tight">
                            {p.name}
                          </p>
                          <p
                            className={`text-[10px] truncate ${
                              active ? "text-[#D5EA88]" : "text-[#4A5E52]"
                            }`}
                          >
                            {p.category.split(" ")[0]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bag Count & Total Output */}
                <div className="rounded-2xl bg-[#FAF5E8] border border-[#103822]/12 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcBags((b) => Math.max(1, b - 1))}
                      aria-label="Decrease bag count"
                      className="w-9 h-9 rounded-full bg-white border border-[#103822]/15 flex items-center justify-center text-[#103822] hover:bg-[#103822] hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center min-w-[74px]">
                      <p className="font-serif-display text-2xl text-[#103822] tabular-nums">
                        {calcBags} Bags
                      </p>
                      <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#4A5E52]">
                        {calcBags * 30} kg Gross
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCalcBags((b) => Math.min(500, b + 1))}
                      aria-label="Increase bag count"
                      className="w-9 h-9 rounded-full bg-white border border-[#103822]/15 flex items-center justify-center text-[#103822] hover:bg-[#103822] hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[5, 10, 25, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCalcBags(preset)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                          calcBags === preset
                            ? "bg-[#103822] text-[#D5EA88]"
                            : "bg-white text-[#103822] border border-[#103822]/15 hover:bg-[#E5EEDD]"
                        }`}
                      >
                        {preset}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart / Quote Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(calcSlug, calcBags, true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D5EA88]" />
                    Add {calcBags}x to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openQuoteModal(
                        `${selectedCalcProduct.name} — ${calcBags} x 30 kg (${
                          calcBags * 30
                        } kg)`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D5EA88] hover:bg-[#c5de6d] text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 transition-colors cursor-pointer"
                  >
                    Get Direct Quote
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          INDUSTRY SEGMENTS (1-column on mobile for full readability)
      ===================================================================== */}
      <section className="py-14 sm:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
              TAILORED TO YOUR KITCHEN OR TRADE
            </p>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#10291B] mt-2">
              Who we serve across Tamil Nadu
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8 sm:mt-10">
            {SERVICE_SEGMENTS.map((seg) => {
              const Icon = seg.icon;
              return (
                <StaggerCard key={seg.title}>
                  <TiltCard3D>
                    <div className="h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
                      {/* Top Dish Visual Strip */}
                      <div className="flex flex-col-reverse sm:grid sm:grid-cols-12 sm:items-center border-b border-[#103822]/8 bg-[#FAF5E8]/65">
                        <div className="sm:col-span-7 p-5 sm:p-7 space-y-2">
                          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-[#286B43]">
                            <Icon className="w-4 h-4 text-[#103822] shrink-0" />
                            <span>{seg.tag}</span>
                          </div>
                          <h3 className="font-serif-display text-2xl sm:text-3xl text-[#10291B] leading-snug">
                            {seg.title}
                          </h3>
                        </div>
                        <div className="sm:col-span-5 h-48 w-full overflow-hidden relative">
                          <img
                            src={seg.dishImage}
                            alt={seg.title}
                            width={800}
                            height={800}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Details + Actions */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-4">
                          <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed">
                            {seg.desc}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {seg.benefits.map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#E5EEDD]/70 text-[#103822] px-3 py-1 rounded-full"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#286B43] shrink-0" />
                                <span>{b}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#103822]/10 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#286B43]">
                            {seg.recommended}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => addToCart(seg.targetSlug, 1, true)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#E5EEDD] hover:bg-[#D5EA88] text-[#103822] text-xs font-bold tracking-[0.12em] uppercase px-4 py-2.5 transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                              Add Bag
                            </button>
                            <button
                              type="button"
                              onClick={() => openQuoteModal(seg.recommended)}
                              className="inline-flex items-center justify-center rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.12em] uppercase px-4 py-2.5 transition-colors cursor-pointer"
                            >
                              Quote
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                </StaggerCard>
              );
            })}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
