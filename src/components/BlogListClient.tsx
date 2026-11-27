"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/siteData";
import { Reveal, StaggerCard, StaggerGrid } from "@/components/MotionPrimitives";

const ARTICLE_COVERS: Record<string, string> = {
  "pure-gram-flour-vs-multi-grain-flour": "/images/grain-blend.jpg",
  "why-milling-temperature-and-grain-cleaning-matter": "/images/grains.jpg",
  "storing-30kg-gram-flour-bags-for-maximum-freshness":
    "/images/dishes/murukku-pakoda.jpg",
};

const DEFAULT_CATEGORIES = [
  "ALL",
  "INGREDIENT GUIDE",
  "QUALITY & PROCESS",
  "KITCHEN OPERATIONS",
];

function getCover(article: BlogArticle): string {
  return (
    article.coverImage ||
    ARTICLE_COVERS[article.slug] ||
    "/images/grains.jpg"
  );
}

export function BlogListClient({
  articles = BLOG_ARTICLES,
}: {
  articles?: BlogArticle[];
}) {
  const [activeCat, setActiveCat] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    articles.forEach((a) => {
      if (a.category) set.add(a.category.toUpperCase());
    });
    return Array.from(set);
  }, [articles]);

  const visibleArticles =
    activeCat === "ALL"
      ? articles
      : articles.filter((a) => a.category.toUpperCase() === activeCat);

  return (
    <div className="grain-surface bg-[#FAF5E8]">
      {/* Compact Header */}
      <section className="py-10 sm:py-14 border-b border-[#103822]/10 bg-[#FFFDF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#286B43]">
                  THE GRAIN JOURNAL
                </p>
                <h1 className="font-serif-display text-2xl sm:text-4xl text-[#10291B] mt-1">
                  Milling &amp; Kitchen Notes
                </h1>
              </div>

              <div
                role="tablist"
                aria-label="Filter articles by category"
                className="flex flex-wrap gap-1.5"
              >
                {categories.map((cat) => {
                  const active = activeCat === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCat(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase transition-all cursor-pointer ${
                        active
                          ? "bg-[#103822] text-[#D5EA88]"
                          : "bg-[#FAF5E8] text-[#4A5E52] border border-[#103822]/12 hover:text-[#10291B]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Compact 3-Column Article Grid */}
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleArticles.map((article) => (
              <StaggerCard key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group h-full rounded-2xl bg-[#FFFDF7] border border-[#103822]/12 shadow-sm hover:shadow-md overflow-hidden transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 overflow-hidden relative bg-[#F2E9D3]">
                      <img
                        src={getCover(article)}
                        alt={article.title}
                        width={600}
                        height={400}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#103822]/90 text-[#D5EA88] text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#4A5E52]">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>

                      <h2 className="font-serif-display text-lg sm:text-xl text-[#10291B] leading-snug group-hover:text-[#286B43] transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#4A5E52] leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-4 pt-3 border-t border-[#103822]/8 flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] uppercase text-[#103822] group-hover:text-[#286B43]">
                      Read Note
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
