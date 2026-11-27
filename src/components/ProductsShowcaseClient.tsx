"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Layers,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
// Package icon intentionally not used: pack size appears only inside the cart.
import { COMPANY_INFO, PRODUCTS, type ProductItem } from "@/data/siteData";
import { useQuoteModal } from "./QuoteModalContext";
import { useCart } from "./CartContext";
import { ProductPosterModal } from "./ProductPosterModal";

type StageTab = "overview" | "ingredients" | "culinary";

interface ThemePalette {
  outerBg: string;
  cardGradient: string;
  swatchColor: string;
  variantLabel: string;
  spheres: {
    size: number;
    x: string;
    y: string;
    depth: number;
    blur: number;
    gradient: string;
    delay: number;
  }[];
}

const PRODUCT_THEMES: Record<ProductItem["slug"], ThemePalette> = {
  aruvi: {
    outerBg: "linear-gradient(145deg, #F6DFA5 0%, #EAC272 52%, #E2AF54 100%)",
    cardGradient:
      "linear-gradient(135deg, #9A4E11 0%, #C46F1D 48%, #E29D3E 100%)",
    swatchColor: "#E08B27",
    variantLabel: "Golden Multi-Grain Blend",
    spheres: [
      {
        size: 62,
        x: "14%",
        y: "14%",
        depth: 22,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 30%, #FFE69A, #D9811E 75%, #8F4808)",
        delay: 0,
      },
      {
        size: 38,
        x: "82%",
        y: "18%",
        depth: 16,
        blur: 1,
        gradient: "radial-gradient(circle at 30% 30%, #FFF3C4, #E7A53B 78%, #A86411)",
        delay: 0.4,
      },
      {
        size: 86,
        x: "76%",
        y: "66%",
        depth: 30,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 28%, #FFD67A, #CE6F15 72%, #7D3904)",
        delay: 0.8,
      },
      {
        size: 28,
        x: "22%",
        y: "76%",
        depth: 14,
        blur: 1.5,
        gradient: "radial-gradient(circle at 30% 30%, #FFF8E0, #EBB95B 80%)",
        delay: 1.1,
      },
      {
        size: 46,
        x: "10%",
        y: "48%",
        depth: 18,
        blur: 2,
        gradient: "radial-gradient(circle at 32% 30%, #FFE08E, #D4791C 78%)",
        delay: 0.2,
      },
      {
        size: 32,
        x: "88%",
        y: "44%",
        depth: 24,
        blur: 0,
        gradient: "radial-gradient(circle at 30% 30%, #FFF3CA, #D89428 76%)",
        delay: 0.6,
      },
    ],
  },
  semmai: {
    outerBg: "linear-gradient(145deg, #C3EEF4 0%, #8FD9E3 52%, #6AC6D4 100%)",
    cardGradient:
      "linear-gradient(135deg, #094D5E 0%, #0E6E83 50%, #249BB0 100%)",
    swatchColor: "#14879E",
    variantLabel: "100% Pure Bengal Gram",
    spheres: [
      {
        size: 64,
        x: "16%",
        y: "16%",
        depth: 22,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 30%, #FFF2B8, #E2A933 74%, #9C690A)",
        delay: 0.1,
      },
      {
        size: 40,
        x: "84%",
        y: "16%",
        depth: 18,
        blur: 1,
        gradient: "radial-gradient(circle at 32% 30%, #D9FAFF, #57C4D6 78%, #106A7C)",
        delay: 0.5,
      },
      {
        size: 84,
        x: "76%",
        y: "68%",
        depth: 32,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 28%, #FFEAA3, #DA9A24 72%, #8C5705)",
        delay: 0.9,
      },
      {
        size: 30,
        x: "20%",
        y: "74%",
        depth: 15,
        blur: 1.5,
        gradient: "radial-gradient(circle at 30% 30%, #E6FBFF, #72D3E3 80%)",
        delay: 1.2,
      },
      {
        size: 48,
        x: "10%",
        y: "48%",
        depth: 20,
        blur: 2,
        gradient: "radial-gradient(circle at 32% 30%, #C8F4FA, #3CA8BD 78%)",
        delay: 0.3,
      },
      {
        size: 34,
        x: "88%",
        y: "45%",
        depth: 24,
        blur: 0,
        gradient: "radial-gradient(circle at 30% 30%, #FFF6CE, #E5AC3A 76%)",
        delay: 0.7,
      },
    ],
  },
  uzhavan: {
    outerBg: "linear-gradient(145deg, #D5EEC4 0%, #B4DDA0 52%, #92C97D 100%)",
    cardGradient:
      "linear-gradient(135deg, #103A23 0%, #1B5A37 50%, #378753 100%)",
    swatchColor: "#267346",
    variantLabel: "Wholesome Multi-Grain",
    spheres: [
      {
        size: 64,
        x: "15%",
        y: "15%",
        depth: 22,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 30%, #E7F9B8, #7EBA4B 74%, #2B621D)",
        delay: 0.15,
      },
      {
        size: 40,
        x: "82%",
        y: "17%",
        depth: 18,
        blur: 1,
        gradient: "radial-gradient(circle at 32% 30%, #FFF2B8, #E2AA38 78%, #9A660C)",
        delay: 0.45,
      },
      {
        size: 86,
        x: "76%",
        y: "66%",
        depth: 30,
        blur: 0,
        gradient: "radial-gradient(circle at 32% 28%, #DFF5AE, #64A63B 72%, #1D5324)",
        delay: 0.85,
      },
      {
        size: 28,
        x: "22%",
        y: "75%",
        depth: 15,
        blur: 1.5,
        gradient: "radial-gradient(circle at 30% 30%, #F4FCE2, #98CE6B 80%)",
        delay: 1.15,
      },
      {
        size: 46,
        x: "10%",
        y: "48%",
        depth: 18,
        blur: 2,
        gradient: "radial-gradient(circle at 32% 30%, #E9F7CB, #5E9C43 78%)",
        delay: 0.25,
      },
      {
        size: 32,
        x: "88%",
        y: "44%",
        depth: 24,
        blur: 0,
        gradient: "radial-gradient(circle at 30% 30%, #FFF4C8, #DC9E2A 76%)",
        delay: 0.65,
      },
    ],
  },
};

export function ProductsShowcaseClient() {
  const { openQuoteModal } = useQuoteModal();
  const { addToCart } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeTab, setActiveTab] = useState<StageTab>("overview");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(
    null
  );

  const activeProduct = PRODUCTS[activeIdx];
  const theme = PRODUCT_THEMES[activeProduct.slug];

  const selectIndex = (nextIdx: number) => {
    const wrapped = (nextIdx + PRODUCTS.length) % PRODUCTS.length;
    setDirection(nextIdx >= activeIdx ? 1 : -1);
    setActiveIdx(wrapped);
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") selectIndex(activeIdx + 1);
      if (e.key === "ArrowLeft") selectIndex(activeIdx - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setPointer({ x: nx, y: ny });
  };

  return (
    <div className="bg-[#F7F3E9]">
      {/* =====================================================================
          INTERACTIVE STUDIO STAGE (Full-Screen Viewport)
      ===================================================================== */}
      <section
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
        className="relative lg:min-h-[calc(100svh-116px)] flex items-center py-4 sm:py-6 lg:py-8 transition-all duration-700 overflow-hidden"
        style={{ background: theme.outerBg }}
      >
        <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-10">
          {/* Page Eyebrow above card */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-[#132A1C]">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase opacity-75">
                THE RAJ VEL PRODUCT STUDIO
              </p>
              <h1 className="font-serif-display text-[22px] leading-tight sm:text-3xl mt-0.5">
                Pure Gram &amp; Multi-Grain Flour Collection
              </h1>
            </div>
            <p className="hidden lg:block text-xs font-semibold tracking-wider uppercase opacity-75">
              Select a product or use ← → keys
            </p>
          </div>

          {/* Elevated Full-Screen Floating Stage Card */}
          <motion.div
            animate={{
              rotateX: -pointer.y * 1.4,
              rotateY: pointer.x * 1.6,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            style={{
              background: theme.cardGradient,
              transformPerspective: 1400,
            }}
            className="relative lg:min-h-[calc(100svh-204px)] flex flex-col justify-between rounded-[24px] sm:rounded-[36px] text-white p-4 sm:p-8 lg:p-10 shadow-[0_40px_90px_-24px_rgba(11,36,21,0.48)] border border-white/20 overflow-hidden transition-[background] duration-700"
          >
            {/* Soft Studio Radial Ambient Light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 52% 52%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 42%, transparent 72%)",
              }}
            />

            {/* Top Card Toolbar */}
            <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] uppercase text-white">
                  <Layers className="w-3.5 h-3.5" />
                  {activeProduct.category}
                </span>
              </div>

              {/* Center Segmented Mode Toggle */}
              <div className="order-3 sm:order-2 w-full sm:w-auto flex justify-center">
                <div className="inline-flex items-center rounded-full bg-black/20 backdrop-blur-md p-1 border border-white/15 max-w-full overflow-x-auto">
                  {(
                    [
                      { id: "overview", label: "Showcase" },
                      { id: "ingredients", label: "Ingredients" },
                      { id: "culinary", label: "Culinary Uses" },
                    ] as const
                  ).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                          isActive ? "text-[#132A1C]" : "text-white/85 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="productStageTabPill"
                            transition={{
                              type: "spring",
                              stiffness: 360,
                              damping: 30,
                            }}
                            className="absolute inset-0 rounded-full bg-white shadow-sm"
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Quick Zoom */}
              <button
                type="button"
                onClick={() => setPreviewProduct(activeProduct)}
                className="order-2 sm:order-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#132A1C] px-3.5 sm:px-4 py-2 text-[10px] font-bold tracking-[0.14em] uppercase transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Full Poster
              </button>
            </div>

            {/* 3-Column Interactive Composition */}
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-5 sm:pt-7 lg:min-h-[440px]">
              {/* LEFT COLUMN: Dynamic Product Copy & Tab Details */}
              <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeProduct.slug}-${activeTab}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/80">
                        {activeProduct.subtitle}
                      </p>
                      <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mt-1 leading-tight">
                        {activeProduct.name}
                      </h2>
                      <p className="text-sm font-medium text-white/90 mt-2 italic">
                        &ldquo;{activeProduct.tagline}&rdquo;
                      </p>
                    </div>

                    {activeTab === "overview" && (
                      <>
                        <p className="text-sm sm:text-base text-white/88 leading-relaxed">
                          {activeProduct.fullDescription}
                        </p>
                        <ul className="space-y-2 pt-1">
                          {activeProduct.highlights.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/95"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#E6F79E] shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {activeTab === "ingredients" && (
                      <div className="space-y-4">
                        <p className="text-sm text-white/88 leading-relaxed">
                          Selected natural grains cleaned, destoned, and milled
                          under strict moisture control:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProduct.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="rounded-full bg-white text-[#132A1C] text-xs font-bold px-3.5 py-1.5 shadow-sm"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          {activeProduct.nutritionFocus.map((spec) => (
                            <div
                              key={spec.label}
                              className="rounded-2xl bg-black/18 border border-white/15 p-3"
                            >
                              <p className="text-[10px] uppercase tracking-wider text-white/70">
                                {spec.label}
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                                {spec.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "culinary" && (
                      <div className="space-y-3">
                        <p className="text-sm text-white/88 leading-relaxed">
                          Engineered for consistent yield, crisp texture, and
                          golden finish across:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {activeProduct.idealFor.map((dish) => (
                            <div
                              key={dish}
                              className="flex items-center gap-2.5 rounded-xl bg-white/12 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white"
                            >
                              <UtensilsCrossed className="w-4 h-4 text-[#E6F79E] shrink-0" />
                              {dish}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CENTER COLUMN: Swooping Pack + Orbiting 3D Grain Spheres */}
              <div className="lg:col-span-5 relative h-[300px] sm:h-[400px] lg:h-[450px] flex items-center justify-center order-1 lg:order-2 overflow-hidden rounded-3xl">
                {/* Orbiting 3D Shaded Spheres (Juice Video Inspired) */}
                {theme.spheres.map((sph, sIdx) => (
                  <motion.div
                    key={`${activeProduct.slug}-sph-${sIdx}`}
                    aria-hidden="true"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 0.94,
                      x: pointer.x * sph.depth,
                      y: [
                        pointer.y * sph.depth - 7,
                        pointer.y * sph.depth + 7,
                        pointer.y * sph.depth - 7,
                      ],
                    }}
                    transition={{
                      scale: { duration: 0.55, delay: sph.delay * 0.25 },
                      opacity: { duration: 0.45 },
                      y: {
                        duration: 3.4 + sIdx * 0.45,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: sph.delay,
                      },
                      x: { type: "spring", stiffness: 140, damping: 18 },
                    }}
                    style={{
                      width: sph.size,
                      height: sph.size,
                      left: sph.x,
                      top: sph.y,
                      background: sph.gradient,
                      filter: sph.blur ? `blur(${sph.blur}px)` : undefined,
                      boxShadow: "0 18px 35px -10px rgba(0,0,0,0.35)",
                    }}
                    className="absolute rounded-full pointer-events-none"
                  />
                ))}

                {/* Hero Product Pack strictly fitted inside its centered box */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeProduct.slug}
                    custom={direction}
                    initial={{
                      opacity: 0,
                      x: direction * 80,
                      rotate: direction * 8,
                      scale: 0.86,
                    }}
                    animate={{
                      opacity: 1,
                      x: pointer.x * -8,
                      y: pointer.y * -6,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: direction * -80,
                      rotate: direction * -8,
                      scale: 0.86,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 24,
                    }}
                    whileHover={{ scale: 1.03, rotate: -1 }}
                    onClick={() => setPreviewProduct(activeProduct)}
                    className="relative z-20 cursor-pointer group flex items-center justify-center h-full max-h-[390px] w-full p-2"
                  >
                    <div
                      className="relative h-full w-full rounded-3xl p-2.5 bg-white/18 backdrop-blur-sm border border-white/35 shadow-[0_28px_55px_-16px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
                      style={{ maxHeight: "380px", maxWidth: "290px" }}
                    >
                      <img
                        src={activeProduct.image}
                        alt={`${activeProduct.name} ${activeProduct.subtitle}`}
                        width={933}
                        height={1400}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          width: "auto",
                          height: "auto",
                        }}
                        className="object-contain rounded-2xl block"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT COLUMN: Product Name Selector & Wholesale Actions */}
              <div className="lg:col-span-3 flex flex-col justify-between gap-5 order-3 relative z-20">
                <div className="rounded-3xl bg-black/20 backdrop-blur-md border border-white/15 p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/75">
                      Select Product
                    </span>
                    <span className="text-[11px] font-bold text-white/90">
                      0{activeIdx + 1} / 0{PRODUCTS.length}
                    </span>
                  </div>

                  {/* Product Name Selector Buttons */}
                  <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2">
                    {PRODUCTS.map((p, idx) => {
                      const pTheme = PRODUCT_THEMES[p.slug];
                      const isSelected = idx === activeIdx;
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => selectIndex(idx)}
                          className={`relative w-full text-left rounded-2xl px-2.5 sm:px-3.5 py-2.5 transition-all flex items-center justify-center lg:justify-between gap-2 cursor-pointer border ${
                            isSelected
                              ? "text-[#132A1C] border-white shadow-md"
                              : "bg-white/8 hover:bg-white/16 text-white border-white/15"
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="activeProductSelectorBg"
                              transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 28,
                              }}
                              className="absolute inset-0 rounded-2xl bg-white"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                              style={{ backgroundColor: pTheme.swatchColor }}
                            />
                            <span className="flex flex-col leading-tight">
                              <span className="text-xs sm:text-sm font-bold">
                                {p.name}
                              </span>
                              <span
                                className={`hidden lg:block text-[10px] ${
                                  isSelected
                                    ? "text-[#276942] font-semibold"
                                    : "text-white/75"
                                }`}
                              >
                                {p.subtitle}
                              </span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Prev / Next Navigation */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => selectIndex(activeIdx - 1)}
                      aria-label="Previous product"
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-white/12 hover:bg-white/25 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => selectIndex(activeIdx + 1)}
                      aria-label="Next product"
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-white/12 hover:bg-white/25 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spec Summary & CTAs */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => addToCart(activeProduct.slug, 1, true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#D5EA88] text-[#103822] text-[11px] font-extrabold tracking-[0.16em] uppercase py-3.5 px-6 shadow-lg transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    ADD TO CART
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openQuoteModal(
                        `${activeProduct.name} — ${activeProduct.subtitle}`
                      )
                    }
                    className="w-full rounded-full bg-[#D5EA88] hover:bg-white text-[#103822] text-[11px] font-extrabold tracking-[0.16em] uppercase py-3 px-6 shadow-md transition-colors cursor-pointer"
                  >
                    GET WHOLESALE QUOTE
                  </button>

                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/35 hover:border-white text-white text-[11px] font-bold tracking-[0.14em] uppercase py-3 px-6 transition-colors"
                  >
                    OPEN FULL PRODUCT PAGE
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Stage Assurance Strip */}
            <div className="relative z-30 mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#E6F79E]" />
                FSSAI Lic. No: {COMPANY_INFO.fssai}
              </span>
              <span>Hygienically Sealed Food-Grade Packing</span>
              <span>Manufactured in Kadayampatti, Salem (T.N)</span>
            </div>
          </motion.div>
        </div>
      </section>

      <ProductPosterModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}

