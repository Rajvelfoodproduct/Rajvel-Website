"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS, type ProductItem } from "@/data/siteData";

export const MIN_CART_BAGS = 1;
export const MAX_CART_BAGS = 500;

export interface CartItem {
  slug: ProductItem["slug"];
  quantity: number; // Number of 30 kg bags
}

interface CartContextValue {
  items: CartItem[];
  isCartOpen: boolean;
  totalBags: number;
  totalKg: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    slug: ProductItem["slug"],
    bags?: number,
    openDrawer?: boolean
  ) => void;
  updateQty: (slug: ProductItem["slug"], delta: number) => void;
  setQty: (slug: ProductItem["slug"], bags: number) => void;
  removeItem: (slug: ProductItem["slug"]) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "rvf_wholesale_cart_v1";
const VALID_SLUGS = new Set<string>(PRODUCTS.map((p) => p.slug));

function clampBagQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_CART_BAGS;
  return Math.min(MAX_CART_BAGS, Math.max(MIN_CART_BAGS, Math.floor(value)));
}

function sanitizeStoredCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<ProductItem["slug"], number>();

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const candidate = entry as { slug?: unknown; quantity?: unknown };
    if (
      typeof candidate.slug === "string" &&
      VALID_SLUGS.has(candidate.slug) &&
      typeof candidate.quantity === "number" &&
      Number.isFinite(candidate.quantity) &&
      candidate.quantity >= MIN_CART_BAGS
    ) {
      const slug = candidate.slug as ProductItem["slug"];
      const prev = merged.get(slug) ?? 0;
      merged.set(slug, clampBagQuantity(prev + Math.floor(candidate.quantity)));
    }
  }

  return Array.from(merged.entries()).map(([slug, quantity]) => ({
    slug,
    quantity,
  }));
}

const CartContext = createContext<CartContextValue>({
  items: [],
  isCartOpen: false,
  totalBags: 0,
  totalKg: 0,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  updateQty: () => {},
  setQty: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && saved.length <= 4096) {
          const parsed: unknown = JSON.parse(saved);
          setItems(sanitizeStoredCart(parsed));
        }
      } catch {
        // Clear corrupted cart payloads cleanly
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore storage cleanup errors
        }
      } finally {
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write issues cleanly
    }
  }, [items, hydrated]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    slug: ProductItem["slug"],
    bags = 1,
    openDrawer = true
  ) => {
    if (!VALID_SLUGS.has(slug)) return;
    const qtyToAdd = clampBagQuantity(bags);
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug
            ? { ...i, quantity: clampBagQuantity(i.quantity + qtyToAdd) }
            : i
        );
      }
      return [...prev, { slug, quantity: qtyToAdd }];
    });
    if (openDrawer) setIsCartOpen(true);
  };

  const updateQty = (slug: ProductItem["slug"], delta: number) => {
    if (!VALID_SLUGS.has(slug) || !Number.isFinite(delta)) return;
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.slug !== slug) return i;
          const next = Math.floor(i.quantity + delta);
          return next <= 0
            ? { ...i, quantity: 0 }
            : { ...i, quantity: Math.min(MAX_CART_BAGS, next) };
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const setQty = (slug: ProductItem["slug"], bags: number) => {
    if (!VALID_SLUGS.has(slug) || !Number.isFinite(bags)) return;
    if (bags <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    const clamped = clampBagQuantity(bags);
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === slug);
      if (exists) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: clamped } : i
        );
      }
      return [...prev, { slug, quantity: clamped }];
    });
  };

  const removeItem = (slug: ProductItem["slug"]) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const clearCart = () => setItems([]);

  const totalBags = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalKg = totalBags * 30;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        totalBags,
        totalKg,
        openCart,
        closeCart,
        addToCart,
        updateQty,
        setQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
