"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Eye,
  PhoneCall,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  COMPANY_INFO,
  CULINARY_DISHES,
  PRODUCTS,
  VALUE_PILLARS,
  type ProductItem,
} from "@/data/siteData";
import { Reveal, StaggerCard, StaggerGrid } from "./MotionPrimitives";
import { useQuoteModal } from "./QuoteModalContext";
import { useCart } from "./CartContext";
import { ProductPosterModal } from "./ProductPosterModal";
import { GrainSculpture3D } from "./GrainSculpture3D";
import { TiltCard3D } from "./TiltCard3D";
import { ApproachStage3D } from "./ApproachStage3D";

export function HomeClient() {
  const { openQuoteModal } = useQuoteModal();
  const { addToCart } = useCart();
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(
    null
  );
  const [stageProgress, setStageProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stageScroll } = useScroll({
    target: stageRef,
    offset: ["start 100px", "end end"],
  });

  useMotionValueEvent(stageScroll, "change", (latest) => {
    setStageProgress(latest);
    if (latest < 0.27) setActiveChapter(0);
    else if (latest < 0.61) setActiveChapter(1);
    else setActiveChapter(2);
  });

  return (
    <div className="grain-surface">
      {/* ============================================================
          SECTION 1: 3D SCROLL-CHOREOGRAPHED HERO & STORY STAGE
      ============================================================ */}
      <div
        ref={stageRef}
        className="relative h-[220svh] lg:h-[250svh] bg-gradient-to-b from-[#FFFDF7] via-[#F4EAD2] to-[#FAF5E8]"
      >
        <div className="sticky top-[100px] sm:top-[116px] h-[calc(100svh-100px)] sm:h-[calc(100svh-116px)] w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{
              background:
                activeChapter === 2
                  ? "radial-gradient(circle at 65% 50%, rgba(217, 155, 38, 0.24) 0%, rgba(250, 245, 232, 0) 65%)"
                  : activeChapter === 1
                  ? "radial-gradient(circle at 66% 50%, rgba(201, 138, 44, 0.2) 0%, rgba(250, 245, 232, 0) 65%)"
                  : "radial-gradient(circle at 72% 50%, rgba(213, 234, 136, 0.3) 0%, rgba(235, 190, 100, 0.14) 38%, rgba(250, 245, 232, 0) 70%)",
            }}
          />

          <div className="absolute inset-0 z-10">
            <GrainSculpture3D scrollProgress={stageProgress} />
          </div>

          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none flex items-end pb-14 lg:pb-0 lg:items-center">
            <AnimatePresence mode="wait">
              {activeChapter === 0 && (
                <motion.div
                  key="chapter-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto"
                >
                  <div className="lg:col-span-6 xl:col-span-5 space-y-4 sm:space-y-5 bg-[#FFFDF7]/92 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 sm:p-6 lg:p-0 rounded-3xl border border-[#103822]/10 lg:border-0 shadow-lg lg:shadow-none">
                    <h1 className="font-serif-display text-3xl sm:text-5xl xl:text-[58px] text-[#10291B] leading-[1.06] tracking-[-0.02em]">
                      Good food begins
                      <br />
                      with good grain.
                    </h1>

                    <p className="font-serif-display text-base sm:text-xl text-[#1A5434] font-medium">
                      Pure quality. Thoughtfully made. Naturally versatile.
                    </p>

                    <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed max-w-md">
                      Pure gram flour and multi-grain blends milled in Salem for
                      home kitchens, sweets and snacks, and food businesses.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="#products"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 sm:px-7 py-3.5 shadow-md transition-all"
                      >
                        EXPLORE PRODUCTS
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => openQuoteModal()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#FAF5E8] border border-[#103822]/25 text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-6 sm:px-7 py-3.5 transition-all cursor-pointer"
                      >
                        SPEAK TO OUR TEAM
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeChapter === 1 && (
                <motion.div
                  key="chapter-1"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto"
                >
                  <div className="lg:col-span-6 xl:col-span-5 space-y-4 sm:space-y-5 bg-[#FFFDF7]/92 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-[#103822]/12 shadow-xl max-h-[58svh] lg:max-h-[calc(100svh-175px)] overflow-y-auto">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#286B43]">
                        SELECTED WHOLE GRAINS
                      </p>
                      <h2 className="font-serif-display text-2xl sm:text-4xl text-[#10291B] leading-[1.12]">
                        Goodness you can count on.
                      </h2>
                      <p className="text-sm text-[#4A5E52] leading-relaxed">
                        Every batch begins with whole rice, maize, Bengal gram,
                        and peas dal — carefully cleaned and graded before
                        milling.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {VALUE_PILLARS.map((pillar) => (
                        <div
                          key={pillar.number}
                          className="rounded-2xl bg-white/95 border border-[#103822]/10 p-3.5 shadow-sm"
                        >
                          <span className="text-[11px] font-bold tracking-[0.14em] text-[#286B43]">
                            #{pillar.number}
                          </span>
                          <h3 className="text-xs font-extrabold tracking-[0.08em] uppercase text-[#103822] mt-1">
                            {pillar.title}
                          </h3>
                          <p className="text-xs text-[#4A5E52] mt-1 leading-snug">
                            {pillar.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeChapter === 2 && (
                <motion.div
                  key="chapter-2"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto"
                >
                  <div className="lg:col-span-6 xl:col-span-5 space-y-4 sm:space-y-5 bg-[#FFFDF7]/92 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-[#103822]/12 shadow-xl max-h-[58svh] lg:max-h-[calc(100svh-175px)] overflow-y-auto">
                    <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#286B43]">
                      PURE &amp; MULTI-GRAIN BLENDS • FSSAI CERTIFIED
                    </p>
                    <h2 className="font-serif-display text-2xl sm:text-4xl text-[#10291B] leading-[1.12]">
                      From pure Bengal gram to silky multi-grain blends.
                    </h2>
                    <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed">
                      Flour blends crafted for crisp murukku, melt-in-mouth
                      Mysore Pak, and everyday kitchen versatility.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {PRODUCTS.map((p) => (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => setPreviewProduct(p)}
                          aria-label={`Preview ${p.name} pack`}
                          className="group relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl p-1.5 border border-[#103822]/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex items-center justify-center"
                          style={{ backgroundColor: p.cardBg }}
                        >
                          <img
                            src={p.image}
                            alt={`${p.name} — ${p.subtitle}`}
                            width={140}
                            height={200}
                            className="h-full w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 flex flex-wrap gap-3">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 shadow-sm transition-colors"
                      >
                        EXPLORE PRODUCT STUDIO
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href="#products"
                        className="inline-flex items-center gap-2 rounded-full border border-[#103822]/30 bg-white hover:bg-[#FAF5E8] text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-5 py-3 transition-colors"
                      >
                        SEE RANGE
                        <ArrowDown className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-3.5 inset-x-0 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-end text-[11px] font-bold tracking-[0.15em] uppercase">
            <a
              href="#products"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#103822]/90 text-white px-4 py-2 hover:bg-[#103822] transition-colors shadow-sm"
            >
              Explore Range
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 2: SIGNATURE FLOUR SHOWCASE (Semmai, Uzhavan, Aruvi)
      ============================================================ */}
      <section
        id="products"
        className="py-16 sm:py-24 scroll-mt-24 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div className="space-y-1.5 max-w-xl">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
                  THE RAJ VEL COLLECTION
                </p>
                <h2 className="font-serif-display text-3xl sm:text-5xl text-[#10291B] tracking-[-0.015em]">
                  Our Signature Flours
                </h2>
              </div>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 self-start sm:self-auto rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 shadow-sm hover:shadow-md transition-all"
              >
                Open Product Studio
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {PRODUCTS.map((product) => (
              <StaggerCard key={product.slug}>
                <TiltCard3D>
                  <article className="group h-full flex flex-col rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 shadow-[0_14px_38px_-18px_rgba(16,56,34,0.18)] hover:shadow-[0_28px_60px_-20px_rgba(16,56,34,0.28)] overflow-hidden transition-shadow duration-300">
                    {/* Uncropped Product Packaging Frame */}
                    <div
                      className="relative aspect-[4/4.3] p-5 sm:p-6 flex items-center justify-center overflow-hidden border-b border-[#103822]/8"
                      style={{ backgroundColor: product.cardBg }}
                    >
                      <img
                        src={product.image}
                        alt={`${product.name} — ${product.subtitle}`}
                        width={933}
                        height={1400}
                        loading="lazy"
                        className="max-h-full w-auto object-contain rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewProduct(product)}
                        aria-label={`View full ${product.name} poster`}
                        className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 hover:bg-[#103822] text-[#103822] hover:text-white text-[11px] font-bold tracking-[0.12em] uppercase px-3.5 py-2 shadow-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Poster
                      </button>
                    </div>

                    {/* Structured Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#286B43]">
                          {product.category}
                        </p>
                        <div>
                          <h3 className="font-serif-display text-2xl sm:text-3xl text-[#10291B]">
                            {product.name}
                          </h3>
                          <p className="text-sm font-semibold text-[#1A5434] mt-0.5">
                            {product.subtitle}
                          </p>
                        </div>
                        <p className="text-sm text-[#4A5E52] leading-relaxed">
                          {product.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF5E8] border border-[#103822]/10 text-[#103822]"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#103822]/10 flex items-center justify-between gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase text-[#103822] hover:text-[#286B43] transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(product.slug, 1, true)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.12em] uppercase px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#D5EA88]" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                </TiltCard3D>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: STORY BANNER (Full-Width Forest Green Block)
      ============================================================ */}
      <section className="relative bg-[#103822] text-white py-16 sm:py-24 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full border border-white/8 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-10 -top-20 w-72 h-72 rounded-full bg-[#D5EA88]/5 blur-2xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <Reveal direction="right" className="lg:col-span-6 space-y-4">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#D5EA88]">
                ROOTED IN SALEM. MADE WITH CARE.
              </p>
              <h2 className="font-serif-display text-3xl sm:text-5xl leading-[1.12] text-white">
                A grain story built
                <br />
                on quality and trust.
              </h2>
            </Reveal>

            <Reveal
              direction="left"
              delay={0.12}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-base text-[#D7E4D9] leading-relaxed max-w-xl">
                Guided by clean grain sourcing, hygienic milling, and dependable
                supply for kitchens and food businesses across Tamil Nadu.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFFDF7] hover:bg-[#D5EA88] text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-7 py-3.5 shadow-sm transition-colors"
                >
                  DISCOVER OUR STORY
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/facilities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:border-white text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 transition-colors"
                >
                  EXPLORE FACILITIES
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CARE IN EVERY STEP (Interactive 3D Stage)
      ============================================================ */}
      <ApproachStage3D />

      {/* ============================================================
          SECTION 5: CULINARY APPLICATIONS & WHOLESALE TRUST
      ============================================================ */}
      <section className="py-16 sm:py-22 bg-[#F0EAD9]/75 border-y border-[#103822]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <Reveal className="lg:col-span-5 space-y-5">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
                MADE FOR EVERY RECIPE
              </p>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#10291B] leading-tight">
                Trusted by sweet stalls, bakeries &amp; everyday kitchens.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed">
                Consistent colour, aroma, and yield for Mysore Pak, laddu,
                murukku, and evening bajji.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                <div className="rounded-2xl bg-white p-4 border border-[#103822]/10">
                  <p className="font-serif-display text-2xl sm:text-3xl text-[#103822]">
                    03
                  </p>
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#4A5E52] mt-1">
                    Flour Blends
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[#103822]/10">
                  <p className="font-serif-display text-2xl sm:text-3xl text-[#103822]">
                    100%
                  </p>
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#4A5E52] mt-1">
                    Natural Grain
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[#103822]/10">
                  <p className="font-serif-display text-2xl sm:text-3xl text-[#103822]">
                    FSSAI
                  </p>
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#4A5E52] mt-1">
                    Certified Mill
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CULINARY_DISHES.map((dish, idx) => (
                <Reveal key={dish.name} delay={idx * 0.08}>
                  <TiltCard3D>
                    <div className="group h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 shadow-[0_14px_38px_-18px_rgba(16,56,34,0.18)] hover:shadow-[0_26px_54px_-18px_rgba(16,56,34,0.28)] overflow-hidden transition-shadow duration-300 flex flex-col justify-between">
                      <div
                        className="relative h-48 sm:h-52 overflow-hidden flex items-center justify-center border-b border-[#103822]/8"
                        style={{ backgroundColor: dish.accentBg }}
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          width={800}
                          height={800}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[#103822]/90 backdrop-blur-sm text-[#D5EA88] text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1 shadow-sm">
                          {dish.product}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-2.5">
                        <h3 className="font-serif-display text-xl text-[#10291B] leading-snug">
                          {dish.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4A5E52] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#286B43] shrink-0" />
                          <span>{dish.note}</span>
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: FINAL WHOLESALE & CONTACT CTA STRIP
      ============================================================ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 sm:p-12 shadow-[0_20px_50px_-20px_rgba(16,56,34,0.16)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex items-start sm:items-center gap-5">
                <div className="hidden sm:block w-20 h-20 rounded-full overflow-hidden border border-[#103822]/15 bg-white shrink-0 shadow-sm">
                  <img
                    src={COMPANY_INFO.logo}
                    alt="Raj Vel Food Products Emblem"
                    width={160}
                    height={160}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.16em] uppercase text-[#286B43]">
                    <ShieldCheck className="w-4 h-4" />
                    FSSAI LIC. NO: {COMPANY_INFO.fssai}
                  </div>
                  <h2 className="font-serif-display text-2xl sm:text-4xl text-[#10291B]">
                    Ready to order for your kitchen or business?
                  </h2>
                  <p className="text-sm sm:text-base text-[#4A5E52] max-w-2xl leading-relaxed">
                    Reach out to our Salem facility for wholesale pack pricing,
                    regular bulk supply, or product samples.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openQuoteModal()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.15em] uppercase px-7 py-3.5 shadow-sm transition-all cursor-pointer"
                >
                  GET A WHOLESALE QUOTE
                </button>
                <a
                  href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-[#103822]/30 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  {COMPANY_INFO.phones[0]}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ProductPosterModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
