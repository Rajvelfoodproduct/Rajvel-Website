import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/siteData";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: "Product Not Found | Raj Vel Food Products",
    };
  }
  return {
    title: `${product.name} — ${product.subtitle} | Raj Vel Food Products`,
    description: product.fullDescription,
    openGraph: {
      title: `${product.name} — ${product.subtitle} | Raj Vel Food Products`,
      description: product.fullDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <ProductDetailClient product={product} otherProducts={otherProducts} />
  );
}
