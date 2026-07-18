import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [
      "@react-pdf/renderer",
      "mermaid",
      "canvg",
      "remark",
      "remarkGfm",
      "remarkDirective"
    ]
  }
};

export default nextConfig;
