import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { BLOG_ARTICLES, COMPANY_INFO } from "@/data/siteData";

const ARTICLE_COVERS: Record<string, string> = {
  "pure-gram-flour-vs-multi-grain-flour": "/images/grain-blend.jpg",
  "why-milling-temperature-and-grain-cleaning-matter": "/images/grains.jpg",
  "storing-30kg-gram-flour-bags-for-maximum-freshness":
    "/images/dishes/murukku-pakoda.jpg",
};

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return {
      title: "Article Not Found | Raj Vel Food Products",
    };
  }
  return {
    title: `${article.title} | Raj Vel Food Products`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Raj Vel Food Products`,
      description: article.excerpt,
      type: "article",
      images: [ARTICLE_COVERS[article.slug] || "/images/grains.jpg"],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug);
  const coverImage = ARTICLE_COVERS[article.slug] || "/images/grains.jpg";

  return (
    <div className="grain-surface bg-[#FAF5E8] py-8 sm:py-12">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase text-[#286B43] hover:text-[#103822] mb-5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Notes
        </Link>

        <div className="rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 shadow-sm overflow-hidden">
          <div className="h-48 sm:h-60 w-full overflow-hidden bg-[#F2E9D3] relative">
            <img
              src={coverImage}
              alt={article.title}
              width={900}
              height={500}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3.5 left-3.5 rounded-full bg-[#103822]/90 text-[#D5EA88] text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1">
              {article.category}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#4A5E52]">
              <span>{article.date}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <h1 className="font-serif-display text-2xl sm:text-3xl text-[#10291B] leading-snug">
              {article.title}
            </h1>

            <div className="space-y-3.5 text-sm sm:text-base text-[#1F3528] leading-relaxed pt-1">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-5 mt-5 border-t border-[#103822]/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#286B43] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                FSSAI Lic. No: {COMPANY_INFO.fssai}
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#103822] hover:bg-[#1A5434] text-white text-xs font-bold tracking-[0.12em] uppercase px-5 py-2.5 transition-colors"
              >
                View Flours
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {otherArticles.length > 0 && (
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 p-4 hover:shadow-sm transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#286B43]">
                    {other.category}
                  </span>
                  <h2 className="font-serif-display text-base sm:text-lg text-[#10291B] group-hover:text-[#286B43] transition-colors mt-0.5">
                    {other.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] uppercase text-[#103822]">
                  Read
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </section>
        )}
      </article>
    </div>
  );
}
