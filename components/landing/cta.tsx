"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden border-t border-white/5">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] pointer-events-none opacity-30 select-none -z-10">
        <div className="absolute top-0 left-1/4 w-[250px] h-[250px] rounded-full bg-amber-500/20 blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-500/10 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-[#0F0F0F] px-8 py-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Accent light border */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ready to write beautiful, secure documents?
          </h3>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Manus is completely free, runs client-side in your browser, and
            auto-saves your changes to local storage. Give it a star or open the
            editor to start coding.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl font-semibold px-8 py-6 shadow-lg shadow-primary/10 hover:-translate-y-px transition-all"
            >
              <Link href="/editor">Open the Editor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-6 text-sm font-semibold text-slate-300 hover:text-white hover:-translate-y-px transition-all"
            >
              <a
                href="https://github.com/rushiii3/mark-editor"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="h-4.5 w-4.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  data-icon="inline-start"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                Star on GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
