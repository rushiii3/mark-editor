import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true
  },

  experimental: {
    optimizePackageImports: [
      "@react-pdf/renderer",
      "mermaid",
      "canvg",
      "monaco-editor",
      "@monaco-editor/react",
      "remark",
      "remarkGfm",
      "remarkDirective"
    ]
  }
};

export default nextConfig;
