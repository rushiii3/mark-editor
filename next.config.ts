import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true
  },

  experimental: {
    optimizePackageImports: ["@react-pdf/renderer", "mermaid", "canvg"]
  }
};

export default nextConfig;
