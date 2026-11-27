"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useQuoteModal } from "@/components/QuoteModalContext";
import { useCart } from "@/components/CartContext";
import type { ProductItem } from "@/data/siteData";

export function OpenQuoteButton({
  productName,
  label = "Request Wholesale Quote",
  variant = "primary",
  className = "",
}: {
  productName?: string;
  label?: string;
  variant?: "primary" | "lime" | "outline-light" | "outline-dark";
  className?: string;
}) {
  const { openQuoteModal } = useQuoteModal();

  const styles =
    variant === "lime"
      ? "bg-[#D5EA88] hover:bg-white text-[#103822]"
      : variant === "outline-light"
      ? "border border-white/30 hover:bg-white/10 text-white"
      : variant === "outline-dark"
      ? "border border-[#103822]/25 hover:border-[#103822] text-[#103822] bg-white/80 hover:bg-white"
      : "bg-[#103822] hover:bg-[#1A5434] text-white shadow-sm";

  return (
    <button
      type="button"
      onClick={() => openQuoteModal(productName)}
      className={`inline-flex items-center justify-center gap-2 rounded-full text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 transition-colors cursor-pointer ${styles} ${className}`}
    >
      {label}
    </button>
  );
}

export function OpenCartButton({
  label = "Open Wholesale Cart",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const { openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 transition-colors cursor-pointer ${className}`}
    >
      <ShoppingBag className="w-4 h-4 text-[#D5EA88]" />
      {label}
    </button>
  );
}

export function AddToCartButton({
  slug,
  bags = 1,
  label = "Add to Cart",
  className = "",
}: {
  slug: ProductItem["slug"];
  bags?: number;
  label?: string;
  className?: string;
}) {
  const { addToCart } = useCart();
  return (
    <button
      type="button"
      onClick={() => addToCart(slug, bags, true)}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.14em] uppercase px-5 py-3 transition-colors cursor-pointer ${className}`}
    >
      <ShoppingBag className="w-3.5 h-3.5 text-[#D5EA88]" />
      {label}
    </button>
  );
}
