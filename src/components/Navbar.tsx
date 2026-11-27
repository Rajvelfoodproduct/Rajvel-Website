"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Mail, ArrowRight, ShoppingBag } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS } from "@/data/siteData";
import { useQuoteModal } from "./QuoteModalContext";
import { useCart } from "./CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { openQuoteModal } = useQuoteModal();
  const { openCart, totalBags } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const mobileOpen = openMenuPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#103822] text-[#E9EFE5] text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.14em] uppercase">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-3">
          <p className="truncate font-medium">{COMPANY_INFO.tagline}</p>
          <div className="hidden md:flex items-center gap-4 shrink-0 text-[#D5EA88]/95 font-medium normal-case tracking-wide">
            <a
              href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3" />
              {COMPANY_INFO.phones[0]}
            </a>
            <span className="opacity-40" aria-hidden="true">
              |
            </span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#FFFDF7]/95 backdrop-blur-md border-[#103822]/12 shadow-[0_10px_30px_-15px_rgba(16,56,34,0.18)]"
            : "bg-[#FFFDF7] border-[#103822]/8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#103822]/15 bg-white shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src={COMPANY_INFO.logo}
                alt="Raj Vel Food Products Logo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-[13px] min-[380px]:text-[15px] sm:text-base font-extrabold tracking-[0.05em] text-[#103822] truncate">
                RAJ VEL FOOD
              </span>
              <span className="text-[9px] font-bold tracking-[0.26em] text-[#286B43] mt-1">
                PRODUCTS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
                    isActive
                      ? "text-[#103822]"
                      : "text-[#4A5E52] hover:text-[#103822]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2.5px] rounded-full bg-[#84B844]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA, Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open wholesale cart (${totalBags} bags)`}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white hover:bg-[#E5EEDD] border border-[#103822]/18 text-[#103822] text-[11px] font-bold tracking-[0.12em] uppercase px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#103822]" />
              <span className="hidden xl:inline">Cart</span>
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-extrabold tabular-nums transition-colors ${
                  totalBags > 0
                    ? "bg-[#103822] text-[#D5EA88]"
                    : "bg-[#E5EEDD] text-[#103822]"
                }`}
              >
                {totalBags}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openQuoteModal()}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-[11px] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              GET A WHOLESALE QUOTE
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenMenuPath((prev) => (prev === pathname ? null : pathname))
              }
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              className="lg:hidden p-2.5 rounded-xl border border-[#103822]/15 text-[#103822] hover:bg-[#103822]/5 transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#FFFDF7] border-b border-[#103822]/15 shadow-xl"
          >
            <div className="px-4 sm:px-6 py-5 flex flex-col gap-1.5 max-h-[calc(100svh-100px)] overflow-y-auto">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
                      isActive
                        ? "bg-[#103822] text-white"
                        : "text-[#10291B] hover:bg-[#103822]/8"
                    }`}
                  >
                    {item.label}
                    <ArrowRight className="w-4 h-4 opacity-60" />
                  </Link>
                );
              })}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuPath(null);
                    openQuoteModal();
                  }}
                  className="w-full rounded-full bg-[#103822] text-white text-xs font-bold tracking-[0.14em] uppercase py-3.5 px-5 text-center cursor-pointer"
                >
                  GET A WHOLESALE QUOTE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuPath(null);
                    openCart();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E5EEDD] text-[#103822] text-xs font-bold tracking-[0.14em] uppercase py-3.5 px-5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  VIEW CART ({totalBags})
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#103822]/10 flex flex-col gap-2 text-xs text-[#4A5E52]">
                <a
                  href={`tel:${COMPANY_INFO.primaryPhoneRaw}`}
                  className="flex items-center gap-2 font-semibold text-[#10291B] hover:text-[#286B43]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#286B43]" />
                  {COMPANY_INFO.phones[0]}
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-2 hover:text-[#103822] break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#286B43] shrink-0" />
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
