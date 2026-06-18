"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
};

export function Hero() {
  const [activeTab, setActiveTab] = useState<"write" | "split" | "pdf">(
    "split"
  );

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-125 pointer-events-none opacity-40 select-none">
        <div className="absolute -top-25 left-1/4 w-75 h-75 rounded-full bg-amber-500/20 blur-[120px]"></div>
        <div className="absolute -top-12.5 right-1/4 w-100 h-100 rounded-full bg-emerald-500/10 blur-[150px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-500 font-semibold px-3 py-1 text-xs">
              MIT Licensed
            </Badge>
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-semibold px-3 py-1 text-xs">
              Open Source
            </Badge>
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500 font-semibold px-3 py-1 text-xs">
              Works Offline
            </Badge>
            <Badge variant="outline" className="border-purple-500/20 bg-purple-500/10 text-purple-500 font-semibold px-3 py-1 text-xs">
              Privacy First
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
          >
            The local-first, markdown & PDF studio for developers.
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mt-6 text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed"
          >
            Write clean markdown, generate pixel-perfect A4 documents, and format notes inside a sandboxed client environment. No tracking, no vendor lock-in.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl font-semibold text-base px-8 py-6 shadow-xl shadow-primary/10 transition-all duration-200 hover:-translate-y-px"
            >
              <Link href="/editor">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-6 text-base font-semibold text-slate-300 hover:text-white transition-all duration-200"
            >
              <a
                href="https://github.com/rushiii3/mark-editor"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-icon="inline-start">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                Star on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Interactive Preview Mockup */}
          <motion.div
            variants={itemVariants}
            className="w-full mt-16 md:mt-20"
          >
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "write" | "split" | "pdf")}
              className="w-full rounded-2xl border border-white/10 bg-[#0F0F0F] p-1.5 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Mockup Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#141414]">
                {/* Window buttons */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>

                {/* View Modes */}
                <TabsList className="bg-white/5 p-0.5 border border-white/5 h-8">
                  <TabsTrigger value="write" className="px-3 py-1 text-[11px] data-[state=active]:bg-white/10 data-[state=active]:text-white">Write</TabsTrigger>
                  <TabsTrigger value="split" className="px-3 py-1 text-[11px] data-[state=active]:bg-white/10 data-[state=active]:text-white">Split View</TabsTrigger>
                  <TabsTrigger value="pdf" className="px-3 py-1 text-[11px] data-[state=active]:bg-white/10 data-[state=active]:text-white">PDF Guide</TabsTrigger>
                </TabsList>

                {/* Action */}
                <div className="flex items-center gap-2">
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-500">
                    Auto-saved
                  </div>
                </div>
              </div>

              {/* Mockup Body Content */}
              <div className="relative h-80 md:h-112.5 bg-[#0A0A0A] flex text-left font-sans text-sm">
                {/* Left Explorer column (Split & Write views) */}
                {activeTab !== "pdf" && (
                  <div className="hidden sm:flex flex-col w-40 md:w-50 border-r border-white/5 bg-[#0D0D0D] p-3 text-slate-500 select-none">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mb-4">
                      Files
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 rounded-md px-2 py-1.5 font-medium text-xs">
                        <span>📄</span> <span className="truncate">index.md</span>
                      </div>
                      <div className="flex items-center gap-2 hover:bg-white/5 rounded-md px-2 py-1.5 text-xs">
                        <span>📄</span>{" "}
                        <span className="truncate">cv-draft.md</span>
                      </div>
                      <div className="flex items-center gap-2 hover:bg-white/5 rounded-md px-2 py-1.5 text-xs">
                        <span>📄</span>{" "}
                        <span className="truncate">invoice-june.md</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editor Workspace Panels */}
                <div className="flex-1 flex overflow-hidden">
                  <TabsContent value="write" className="flex-1 flex mt-0">
                    <div className="flex-1 flex flex-col p-4 font-mono text-slate-300 text-xs md:text-sm bg-[#0C0C0C] overflow-y-auto">
                      <div className="text-slate-600 select-none mb-1">1 # Markdown PDF Studio</div>
                      <div className="text-slate-600 select-none mb-1">2 </div>
                      <div className="text-slate-600 select-none mb-1">3 Write in **Markdown** and preview instantly.</div>
                      <div className="text-slate-600 select-none mb-1">4 </div>
                      <div className="text-slate-600 select-none mb-1">5 :::callout[note]</div>
                      <div className="text-amber-500/80 select-none mb-1">6 Your data never leaves your device.</div>
                      <div className="text-slate-600 select-none mb-1">7 :::</div>
                      <div className="text-slate-600 select-none mb-1">8 </div>
                      <div className="text-slate-600 select-none mb-1">9 ## Features</div>
                      <div className="text-slate-600 select-none mb-1">10 - **Fast** and local-first</div>
                      <div className="text-slate-600 select-none mb-1">11 - **HTML5** & PDF output</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="split" className="flex-1 flex mt-0 h-full">
                    {/* Left Pane (Editor) */}
                    <div className="flex-1 flex flex-col p-4 font-mono text-slate-300 text-xs md:text-sm bg-[#0C0C0C] border-r border-white/5 overflow-y-auto">
                      <div className="text-slate-600 select-none mb-1">1 # Markdown PDF Studio</div>
                      <div className="text-slate-600 select-none mb-1">2 </div>
                      <div className="text-slate-600 select-none mb-1">3 Write in **Markdown** and preview instantly.</div>
                      <div className="text-slate-600 select-none mb-1">4 </div>
                      <div className="text-slate-600 select-none mb-1">5 :::callout[note]</div>
                      <div className="text-amber-500/80 select-none mb-1">6 Your data never leaves your device.</div>
                      <div className="text-slate-600 select-none mb-1">7 :::</div>
                      <div className="text-slate-600 select-none mb-1">8 </div>
                      <div className="text-slate-600 select-none mb-1">9 ## Features</div>
                      <div className="text-slate-600 select-none mb-1">10 - **Fast** and local-first</div>
                      <div className="text-slate-600 select-none mb-1">11 - **HTML5** & PDF output</div>
                    </div>

                    {/* Right Pane (Live Preview) */}
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-white text-slate-900">
                      <div className="prose prose-sm leading-relaxed text-slate-800">
                        <h1 className="text-xl font-extrabold tracking-tight border-b pb-2 text-black mb-3">
                          Markdown PDF Studio
                        </h1>
                        <p className="text-xs">
                          Write in <strong>Markdown</strong> and preview instantly.
                        </p>
                        <div className="my-4 border-l-4 border-amber-500 bg-amber-50 p-3 rounded">
                          <p className="text-xs font-semibold text-amber-800">
                            📝 Note: Your data never leaves your device.
                          </p>
                        </div>
                        <h2 className="text-sm font-semibold border-b pb-1 mt-4 mb-2 text-black">
                          Features
                        </h2>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          <li>
                            <strong>Fast</strong> and local-first
                          </li>
                          <li>
                            <strong>HTML5</strong> & PDF output
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pdf" className="flex-1 flex mt-0 h-full">
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-900 items-center py-8">
                      <div className="w-[300px] md:w-[380px] min-h-[400px] md:min-h-[500px] bg-white text-slate-900 p-8 shadow-2xl relative border-t-4 border-amber-500">
                        {/* A4 guide header indicator */}
                        <div className="absolute top-2 right-2 text-[8px] font-bold text-slate-400 tracking-wider uppercase border border-slate-200 rounded px-1.5 py-0.5 select-none">
                          A4 Page 1
                        </div>
                        <h1 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4 text-black">
                          Markdown PDF Studio
                        </h1>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Write in <strong>Markdown</strong> and preview instantly.
                        </p>
                        <div className="border-l-4 border-amber-500 bg-amber-50 p-3 mb-4 rounded">
                          <p className="text-[11px] font-medium text-amber-800">
                            📝 Note: Your data never leaves your device.
                          </p>
                        </div>
                        <h2 className="text-sm font-bold border-b border-slate-100 pb-1 mb-2 text-black">
                          Features
                        </h2>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          <li>
                            <strong>Fast</strong> and local-first
                          </li>
                          <li>
                            <strong>HTML5</strong> & PDF output
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
