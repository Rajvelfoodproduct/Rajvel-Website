import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { COMPANY_INFO, PROCESS_STEPS } from "@/data/siteData";
import { Reveal, StaggerCard, StaggerGrid } from "@/components/MotionPrimitives";
import { OpenQuoteButton } from "@/components/ui/ModalActionButtons";

export const metadata: Metadata = {
  title: "Milling & Packing Facility — Kadayampatti, Salem | Raj Vel Food Products",
  description:
    "Inside Raj Vel Food Products' Kadayampatti, Salem milling and hygienic packing unit: multi-stage grain cleaning, controlled temperature grinding, and FSSAI compliant operations.",
  openGraph: {
    title: "Milling & Packing Facility — Salem | Raj Vel Food Products",
    description:
      "Multi-stage grain cleaning, temperature-controlled milling, and hygienic packing in Kadayampatti, Salem.",
    images: ["/images/grains.jpg"],
  },
};

const FACILITY_STANDARDS = [
  {
    title: "Multi-Stage Grain Cleaning",
    desc: "Automated destoners and aspirators remove dust, husk, and foreign particles before grains reach the milling line.",
  },
  {
    title: "Controlled Temperature Milling",
    desc: "Balanced grinding preserves natural protein integrity, vibrant golden colour, and authentic Bengal gram aroma.",
  },
  {
    title: "Hygienic Food-Grade Bagging",
    desc: "Moisture-protective food-grade sacks are stitched and batch-coded for lasting freshness and quality traceability.",
  },
  {
    title: "FSSAI Compliant Operations",
    desc: `Licensed under FSSAI No. ${COMPANY_INFO.fssai} with strict No-Hooks handling protocols printed on every bag.`,
  },
];

export default function FacilitiesPage() {
  return (
    <div className="grain-surface bg-[#FAF5E8]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#103822] via-[#15482C] to-[#0B2818] text-white py-16 sm:py-22 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D5EA88]/10 blur-3xl"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
              <Building2 className="w-3.5 h-3.5" />
              SALEM MILLING &amp; PACKING UNIT
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-[54px] mt-4 max-w-3xl leading-[1.1] tracking-[-0.015em]">
              Clean processing, consistent texture, dependable supply.
            </h1>
            <p className="text-base sm:text-lg text-[#DCE8DE] max-w-xl mt-3 leading-relaxed">
              Purpose-built for pure gram and multi-grain milling in
              Kadayampatti, Salem with strict FSSAI hygiene controls.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4-Step Production Workflow */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
              4-STEP PRODUCTION WORKFLOW
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#10291B] mt-2">
              Inside our production rhythm
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-10">
            {PROCESS_STEPS.map((step) => (
              <StaggerCard key={step.number}>
                <div className="h-full rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span
                      className={`inline-flex w-11 h-11 rounded-2xl ${step.accentBg} text-[#103822] font-bold text-xs items-center justify-center`}
                    >
                      {step.number}
                    </span>
                    <h3 className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#103822] mt-5">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#286B43] mt-1">
                      {step.shortDesc}
                    </p>
                    <p className="text-sm text-[#4A5E52] mt-3 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Quality & Hygiene Standards */}
      <section className="py-14 sm:py-20 bg-[#F0EAD9]/75 border-y border-[#103822]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
              QUALITY ASSURANCE
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#10291B] mt-2">
              Hygienic standards in every batch
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FACILITY_STANDARDS.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.08}>
                <div className="rounded-3xl bg-[#FFFDF7] p-6 sm:p-7 border border-[#103822]/12 h-full flex items-start gap-4 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-[#286B43] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#10291B]">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4A5E52] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Location & CTA */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#FFFDF7] border border-[#103822]/12 p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#286B43] uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                Manufacturing &amp; Marketing Unit
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#10291B]">
                {COMPANY_INFO.fullAddress}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5E52] flex items-center gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#286B43] shrink-0" />
                FSSAI Lic. No: {COMPANY_INFO.fssai}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <OpenQuoteButton label="Request Mill Quote" />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[#103822]/25 hover:border-[#103822] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase px-6 py-3.5 transition-colors"
              >
                Contact Desk
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
