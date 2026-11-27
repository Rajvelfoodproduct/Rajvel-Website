import type { Metadata } from "next";
import { ProductsShowcaseClient } from "@/components/ProductsShowcaseClient";

export const metadata: Metadata = {
  title: "Our Flour Collection — Semmai, Uzhavan & Aruvi | Raj Vel Food Products",
  description:
    "Explore Semmai Pure Gram Flour, Uzhavan Multi-Grain Flour, and Aruvi Multi-Grain Flour. Compare ingredients, culinary applications, and wholesale specifications.",
  openGraph: {
    title: "Our Flour Collection — Semmai, Uzhavan & Aruvi | Raj Vel Food Products",
    description:
      "Compare Semmai Pure Gram Flour, Uzhavan Multi-Grain Flour, and Aruvi Multi-Grain Flour crafted in Salem, Tamil Nadu.",
    images: ["/images/semmai.webp"],
  },
};

export default function ProductsPage() {
  return <ProductsShowcaseClient />;
}
