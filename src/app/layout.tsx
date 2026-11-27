import type { Metadata } from "next";
import "./globals.css";
import { COMPANY_INFO } from "@/data/siteData";
import { SITE_URL, serializeJsonLd } from "@/lib/siteConfig";
import { QuoteModalProvider } from "@/components/QuoteModalContext";
import { CartProvider } from "@/components/CartContext";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WholesaleQuoteModal } from "@/components/WholesaleQuoteModal";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  title: "Raj Vel Food Products | Pure Gram Flour & Multi-Grain Flour — Salem",
  description:
    "Discover Semmai, Uzhavan, and Aruvi — pure gram flour and multi-grain flour blends crafted with care in Salem, Tamil Nadu for home kitchens, sweets and snacks, and food businesses.",
  openGraph: {
    title: "Raj Vel Food Products | Pure Gram Flour & Multi-Grain Flour — Salem",
    description:
      "Discover Semmai, Uzhavan, and Aruvi — pure gram flour and multi-grain flour blends crafted in Kadayampatti, Salem, Tamil Nadu.",
    url: SITE_URL,
    type: "website",
    locale: "en_IN",
    siteName: "Raj Vel Food Products",
    images: ["/images/semmai.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raj Vel Food Products | Pure Gram Flour & Multi-Grain Flour",
    description:
      "Semmai, Uzhavan, and Aruvi — pure gram flour and multi-grain flour blends manufactured in Salem, Tamil Nadu.",
    images: ["/images/semmai.webp"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_INFO.name,
  url: SITE_URL,
  email: COMPANY_INFO.email,
  telephone: COMPANY_INFO.phones[0],
  logo: `${SITE_URL}${COMPANY_INFO.logo}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY_INFO.addressLine1} ${COMPANY_INFO.addressLine2}`,
    addressLocality: "Salem",
    addressRegion: "Tamil Nadu",
    postalCode: "636351",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Outfit:wght@400..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF5E8] text-[#10291B] antialiased selection:bg-[#D5EA88] selection:text-[#103822]">
        <CartProvider>
          <QuoteModalProvider>
            <ScrollProgressBar />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WholesaleQuoteModal />
            <CartDrawer />
          </QuoteModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
