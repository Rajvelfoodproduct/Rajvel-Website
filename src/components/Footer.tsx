"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ShieldCheck, ArrowUpRight } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS, PRODUCTS } from "@/data/siteData";
import { useQuoteModal } from "./QuoteModalContext";

export function Footer() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <footer className="bg-[#0F3922] text-[#E6EFE4]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-white/10">
        {/* Brand Summary */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white p-0.5 shadow-md">
              <img
                src={COMPANY_INFO.logo}
                alt="Raj Vel Food Products"
                width={112}
                height={112}
                loading="lazy"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p className="font-bold tracking-[0.08em] text-white text-base">
                RAJ VEL FOOD PRODUCTS
              </p>
              <p className="text-[11px] tracking-[0.18em] text-[#CFE484] uppercase mt-0.5">
                Salem, Tamil Nadu
              </p>
            </div>
          </div>

          <p className="text-sm text-[#C7D6C9] leading-relaxed max-w-sm">
            Bringing pure gram flour and multi-grain flour essentials to home
            kitchens, sweets and snacks, caterers, and wholesale food businesses
            with consistent quality and honest care.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/15 px-4 py-2 text-xs text-[#D5EA88]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>FSSAI Lic. No: {COMPANY_INFO.fssai}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#CFE484]">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#D4E1D6] hover:text-white transition-colors"
                >
                  {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#CFE484]">
            Our Range
          </h4>
          <ul className="space-y-3">
            {PRODUCTS.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex items-start justify-between gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-3.5 py-2.5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#D5EA88] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#B7C9BA]">{product.subtitle}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#CFE484] shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#CFE484]">
            Salem Facility &amp; Desk
          </h4>
          <div className="space-y-3 text-sm text-[#D4E1D6]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#CFE484] shrink-0 mt-1" />
              <p className="leading-relaxed">
                {COMPANY_INFO.addressLine1}
                <br />
                {COMPANY_INFO.addressLine2}
                <br />
                {COMPANY_INFO.addressLine3}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#CFE484] shrink-0 mt-1" />
              <div className="flex flex-col">
                <a
                  href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_INFO.phones[0]}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#CFE484] shrink-0" />
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="hover:text-white transition-colors break-all"
              >
                {COMPANY_INFO.email}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openQuoteModal()}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#D5EA88] hover:bg-[#E4F4A6] text-[#124328] text-[11px] font-bold tracking-[0.14em] uppercase px-5 py-2.5 transition-colors cursor-pointer"
          >
            Request Wholesale Quote
          </button>
        </div>
      </div>

      {/* Bottom Legal & Motto Strip matching Figma Footer */}
      <div className="bg-[#0B2D1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#C7D7C9]">
          <p>RAJ VEL FOOD PRODUCTS • SALEM, TAMIL NADU</p>
          <p className="text-[#D5EA88] font-semibold">
            {COMPANY_INFO.footerMotto}
          </p>
        </div>
      </div>
    </footer>
  );
}

