import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Dev uses its own cache folder so `npm run build` (which writes to .next)
  // can never clobber the dev server's manifests.
  distDir: isDev ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
