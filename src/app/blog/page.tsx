import type { Metadata } from "next";
import { BlogListClient } from "@/components/BlogListClient";

export const metadata: Metadata = {
  title: "The Grain Journal — Milling & Kitchen Insights | Raj Vel Food Products",
  description:
    "Practical insights from Raj Vel Food Products' Salem mill on pure gram flour vs. multi-grain flour, grain cleaning, milling temperature, and bulk flour storage.",
  openGraph: {
    title: "The Grain Journal | Raj Vel Food Products",
    description:
      "Notes on grain selection, milling fineness, and commercial kitchen performance from Kadayampatti, Salem.",
    images: ["/images/grain-blend.jpg"],
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
