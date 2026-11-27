import type { Metadata } from "next";
import { ContactClient } from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Raj Vel Food Products — Kadayampatti, Salem | Wholesale Desk",
  description:
    "Contact Raj Vel Food Products at SF. No. 135/1, Near Royal Garden, Nadupatty Post, Kadayampatti, Salem (T.N) for wholesale gram flour and multi-grain flour orders.",
  openGraph: {
    title: "Contact Raj Vel Food Products — Salem, Tamil Nadu",
    description:
      "Call +91 96773 93659 or message our Salem wholesale desk for Semmai, Uzhavan, and Aruvi bulk orders.",
    images: ["/images/logo.jpeg"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
