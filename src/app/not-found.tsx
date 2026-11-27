import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grain-surface min-h-[65svh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg text-center space-y-5">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#276942]">
          PAGE NOT FOUND
        </p>
        <h1 className="font-serif-display text-4xl sm:text-5xl text-[#132A1C]">
          We couldn&apos;t find that grain page.
        </h1>
        <p className="text-sm text-[#5A6B60] leading-relaxed">
          Let&apos;s take you back to the Raj Vel Food Products homepage or our
          product range.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#124328] text-white text-xs font-bold tracking-[0.15em] uppercase px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-[#124328]/30 text-[#124328] text-xs font-bold tracking-[0.15em] uppercase px-6 py-3"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}

