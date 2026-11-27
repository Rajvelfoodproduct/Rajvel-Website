import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  HeartHandshake,
  Layers,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { COMPANY_INFO, PROCESS_STEPS, VALUE_PILLARS } from "@/data/siteData";
import { Reveal, StaggerCard, StaggerGrid } from "@/components/MotionPrimitives";
import { TiltCard3D } from "@/components/TiltCard3D";
import {
  OpenCartButton,
  OpenQuoteButton,
} from "@/components/ui/ModalActionButtons";

export const metadata: Metadata = {
  title: "About Raj Vel Food Products | Pure Gram & Multi-Grain Flour Mill — Salem",
  description:
    "Learn about Raj Vel Food Products in Kadayampatti, Salem, Tamil Nadu — makers of Semmai Pure Gram Flour, Uzhavan Multi-Grain Flour, and Aruvi Multi-Grain Flour.",
  openGraph: {
    title: "About Raj Vel Food Products | Salem, Tamil Nadu",
    description:
      "Honest grain craft and dependable gram flour & multi-grain flour blends manufactured in Kadayampatti, Salem.",
    images: ["/images/grains.jpg"],
  },
};

const MILL_METRICS = [
  { value: "03", label: "Flour Lines" },
  { value: "100%", label: "Natural Selected Grains" },
  { value: "FSSAI", label: "Certified Production" },
  { value: "Pure", label: "Hygienic Food-Grade Packing" },
];

export default function AboutPage() {
  return (
    <div className="grain-surface bg-[#FAF5E8]">
      {/* =====================================================================
          HERO: EDITORIAL BRAND STORY
      ===================================================================== */}
      <section className="relative bg-gradient-to-br from-[#103822] via-[#15482C] to-[#0B2818] text-white py-16 sm:py-22 lg:py-24 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 w-[460px] h-[460px] rounded-full bg-[#D5EA88]/10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
              <Award className="w-3.5 h-3.5" />
              SALEM, TAMIL NADU • MILLING EXCELLENCE
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-[-0.02em]">
              Honest grain craft,
              <br />
              milled for kitchens that care.
            </h1>
            <p className="text-base sm:text-lg text-[#DCE8DE] leading-relaxed max-w-xl">
              Milling pure gram flour and multi-grain blends in Kadayampatti,
              Salem for sweet stalls, bakeries, and kitchens.
            </p>

            {/* Metric Pill Strip (2 cols on mobile, 4 cols on sm+) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {MILL_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white/8 border border-white/12 px-4 py-3.5 backdrop-blur-sm"
                >
                  <p className="font-serif-display text-2xl sm:text-3xl text-[#D5EA88]">
                    {m.value}
                  </p>
                  <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/80 mt-1 leading-snug">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 flex justify-center">
            <TiltCard3D className="w-full max-w-sm">
              <div className="rounded-3xl bg-[#FFFDF7] text-[#10291B] p-7 sm:p-8 shadow-[0_32px_70px_-20px_rgba(0,0,0,0.45)] border border-white/30 text-center space-y-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-[#103822]/15 bg-white p-1 shadow-md">
                  <img
                    src={COMPANY_INFO.logo}
                    alt="Raj Vel Food Products Emblem"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#286B43]">
                    MANUFACTURED IN SALEM
                  </p>
                  <h2 className="font-serif-display text-2xl text-[#10291B] mt-1">
                    Raj Vel Food Products
                  </h2>
                  <p className="text-xs font-medium text-[#4A5E52] mt-1">
                    Pure Goodness for a Healthier Tomorrow
                  </p>
                </div>

                <div className="pt-4 border-t border-[#103822]/10 flex items-center justify-center gap-2 text-xs font-bold text-[#103822]">
                  <ShieldCheck className="w-4 h-4 text-[#286B43]" />
                  FSSAI Lic. No: {COMPANY_INFO.fssai}
                </div>
              </div>
            </TiltCard3D>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          VISUAL SOURCING STORY (1-column on mobile for comfortable reading)
      ===================================================================== */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <Reveal>
            <TiltCard3D>
              <div className="h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 overflow-hidden shadow-sm flex flex-col">
                <div className="h-56 sm:h-72 overflow-hidden relative">
                  <img
                    src="/images/grains.jpg"
                    alt="Selected raw Bengal gram, rice, maize and grains"
                    width={1000}
                    height={669}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-[#103822]/90 text-[#D5EA88] text-[10px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 backdrop-blur-sm">
                    01 · RAW GRAIN SELECTION
                  </span>
                </div>
                <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl text-[#10291B]">
                      Selected at source, cleaned in stages
                    </h2>
                    <p className="text-sm text-[#4A5E52] leading-relaxed mt-2">
                      Moisture-tested Bengal gram, maize, rice, and peas dal
                      inspected for natural colour and pure aroma.
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#286B43] inline-flex items-center gap-1.5 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286B43] shrink-0" />
                    <span>Zero artificial colours, zero preservatives</span>
                  </p>
                </div>
              </div>
            </TiltCard3D>
          </Reveal>

          <Reveal delay={0.08}>
            <TiltCard3D>
              <div className="h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 overflow-hidden shadow-sm flex flex-col">
                <div className="h-56 sm:h-72 overflow-hidden relative">
                  <img
                    src="/images/grain-blend.jpg"
                    alt="Balanced Raj Vel multi-grain flour blend ingredients"
                    width={924}
                    height={929}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-[#103822]/90 text-[#D5EA88] text-[10px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 backdrop-blur-sm">
                    02 · BALANCED FORMULATION
                  </span>
                </div>
                <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl text-[#10291B]">
                      Built for sweet stalls, snack units &amp; homes
                    </h2>
                    <p className="text-sm text-[#4A5E52] leading-relaxed mt-2">
                      Controlled temperature milling for smooth batter
                      hydration, golden crunch, and reliable batch yield.
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#286B43] inline-flex items-center gap-1.5 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286B43] shrink-0" />
                    <span>Batch-coded, hygienically sealed packs</span>
                  </p>
                </div>
              </div>
            </TiltCard3D>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          VALUE PILLARS
      ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#F2E9D3]/60 border-y border-[#103822]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
              WHAT GUIDES US
            </p>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#10291B] mt-2">
              Four promises sealed in every bag
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-10">
            {VALUE_PILLARS.map((p) => (
              <StaggerCard key={p.number}>
                <TiltCard3D>
                  <div className="h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#D5EA88] text-[#103822] text-xs font-extrabold">
                        #{p.number}
                      </span>
                      <h3 className="font-sans text-xs font-extrabold tracking-[0.15em] uppercase text-[#103822] mt-5">
                        {p.title}
                      </h3>
                      <p className="text-sm text-[#4A5E52] mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </TiltCard3D>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* =====================================================================
          HERITAGE TRIAD + PROCESS SUMMARY
      ===================================================================== */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal>
            <div className="rounded-3xl bg-[#FFFDF7] p-6 sm:p-8 border border-[#103822]/12 h-full space-y-3 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-2xl text-[#10291B]">
                Thoughtful Grain Sourcing
              </h3>
              <p className="text-sm text-[#4A5E52] leading-relaxed">
                From 100% pure Bengal gram in Semmai to balanced multi-grain
                combinations in Uzhavan and Aruvi, we select grains with care so
                recipes taste authentic every batch.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-[#FFFDF7] p-6 sm:p-8 border border-[#103822]/12 h-full space-y-3 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-2xl text-[#10291B]">
                Built for Makers &amp; Families
              </h3>
              <p className="text-sm text-[#4A5E52] leading-relaxed">
                Our bulk packs serve sweet stalls, snack manufacturers,
                hotels, and catering kitchens across Tamil Nadu with reliable
                supply and transparent pricing.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="rounded-3xl bg-[#FFFDF7] p-6 sm:p-8 border border-[#103822]/12 h-full space-y-3 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#E5EEDD] text-[#103822] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-2xl text-[#10291B]">
                Rooted in Kadayampatti, Salem
              </h3>
              <p className="text-sm text-[#4A5E52] leading-relaxed">
                Located at {COMPANY_INFO.fullAddress}, our plant pairs local
                agricultural insight with clean hygienic processing.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Bottom Action Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-14">
          <div className="rounded-3xl bg-[#103822] text-white p-6 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2.5 max-w-xl">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
                {PROCESS_STEPS.length} STAGES OF CARE • DIRECT FROM MILL
              </p>
              <h2 className="font-serif-display text-2xl sm:text-4xl">
                Explore our flour studio or build your dispatch cart.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#D5EA88] hover:bg-white text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-7 py-3.5 transition-colors"
              >
                Open Product Studio
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <OpenCartButton label="Open Cart" />
              <OpenQuoteButton
                label="Wholesale Quote"
                variant="outline-light"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
