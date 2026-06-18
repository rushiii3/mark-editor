"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    title: "GFM Markdown Engine",
    description:
      "Supports GitHub-flavored markdown, KaTeX math symbols, emojis, and custom containers like alerts and collapsibles."
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: "A4 PDF Page Guides",
    description:
      "Preview documents with precise A4 height indicators and inject custom page breaks to guarantee beautiful PDF print outs."
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    title: "Offline-First Sandbox",
    description:
      "No servers, no tracking. The app loads instantly, runs completely client-side in the browser, and saves all data locally."
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Local Media Gallery",
    description:
      "Upload local images directly into your workspace. They are compressed, stored in IndexedDB, and resolved instantly in live preview."
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: "Monaco Core Editor",
    description:
      "Features VS Code's editor core, including autocomplete, multi-cursor, slash command overlays, and stable line wrapping."
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Instant Auto-Save",
    description:
      "A built-in debounced save listener automatically stores your active document to local IndexedDB on every keystroke."
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            A Better Way to Write
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3 max-w-2xl">
            Everything you need for clean documents, offline and secure.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className="group relative flex flex-col w-full hover:border-white/10 transition-all duration-300 bg-card/40">
                {/* Card glowing light effect */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/0 transition-all duration-500 opacity-60"></div>

                <CardHeader className="flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-amber-500 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-white tracking-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
