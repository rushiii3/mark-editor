"use client";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CellularNetworkOfflineIcon,
  Code,
  Document,
  EngineIcon,
  MedicalFileFreeIcons,
  SaveAll
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const features = [
  {
    icon: EngineIcon,
    title: "GFM Markdown Engine",
    description:
      "Supports GitHub-flavored markdown, KaTeX math symbols, emojis, and custom containers like alerts and collapsibles."
  },
  {
    icon: Document,
    title: "A4 PDF Page Guides",
    description:
      "Preview documents with precise A4 height indicators and inject custom page breaks to guarantee beautiful PDF print outs."
  },
  {
    icon: CellularNetworkOfflineIcon,
    title: "Offline-First Sandbox",
    description:
      "No servers, no tracking. The app loads instantly, runs completely client-side in the browser, and saves all data locally."
  },
  {
    icon: MedicalFileFreeIcons,
    title: "Local Media Gallery",
    description:
      "Upload local images directly into your workspace. They are compressed, stored in IndexedDB, and resolved instantly in live preview."
  },
  {
    icon: Code,
    title: "Monaco Core Editor",
    description:
      "Features VS Code's editor core, including autocomplete, multi-cursor, slash command overlays, and stable line wrapping."
  },
  {
    icon: SaveAll,
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
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            A Better Way to Write
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight  mt-3 max-w-2xl">
            Everything you need for clean documents, offline and secure.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <LazyMotion features={domAnimation} key={feature.title}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex"
              >
                <Card className="group relative flex flex-col w-full transition-all duration-300 bg-card/40">
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/0 transition-all duration-500 opacity-60"></div>

                  <CardHeader className="flex flex-col gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-primary group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300">
                      <HugeiconsIcon icon={feature.icon} size={30} />
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </m.div>
            </LazyMotion>
          ))}
        </div>
      </div>
    </section>
  );
}
