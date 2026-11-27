import type { Metadata } from "next";
import { ServicesClient } from "@/components/ServicesClient";

export const metadata: Metadata = {
  title: "Wholesale & B2B Flour Supply — Salem | Raj Vel Food Products",
  description:
    "Direct Salem mill wholesale supply of Semmai Pure Gram Flour, Uzhavan Multi-Grain Flour, and Aruvi Multi-Grain Flour for sweet stalls, snack units, caterers, and distributors.",
  openGraph: {
    title: "Wholesale & B2B Flour Supply | Raj Vel Food Products",
    description:
      "Build your 30 kg wholesale bag order or request direct mill pricing for sweet shops, snack factories, hotels, and regional distributors.",
    images: ["/images/dishes/mysore-pak.jpg"],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
