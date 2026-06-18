"use client";

import { motion } from "framer-motion";

export function WhyOpenSource() {
  return (
    <section
      id="why-open-source"
      className="relative  py-20 md:py-28 overflow-hidden"
    >
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none select-none"></div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              MIT Licensed
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3 leading-tight">
              Why Open Source & Local-First?
            </h3>
            <p className="text-slate-400 mt-6 leading-relaxed">
              We believe developers deserve tools that respect their
              independence. Markups runs entirely in your browser’s sandbox,
              using your local storage as a database.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    Full Privacy Audit
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Anyone can inspect the code to verify that no documents or
                    analytics are transmitted to remote servers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    No Vendor Lock-in
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Your data is stored in standard Markdown and
                    SQLite/IndexedDB structures. Export your notes in bulk at
                    any moment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    Community Driven Development
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Found a bug? Want a feature? Fork the repository and open a
                    pull request. We actively review contributions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Inspect Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-[#0F0F0F] p-4 shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4 select-none">
              <span className="text-xs text-slate-500 font-mono">
                DevTools &gt; Application &gt; IndexedDB
              </span>
            </div>

            <div className="font-mono text-[11px] sm:text-xs text-slate-400 space-y-2 leading-relaxed overflow-x-auto">
              <div className="text-slate-600">
                {"// Document storage inspect"}
              </div>
              <div>
                <span className="text-emerald-500">IndexedDB</span>.open(
                <span className="text-amber-500">
                  &quot;markdown-editor&quot;
                </span>
                , <span className="text-blue-400">2</span>)
              </div>
              <div className="pl-4">
                .onUpgrade(<span className="text-purple-400">db</span> =&gt;
                &#123;
              </div>
              <div className="pl-8">
                db.createObjectStore(
                <span className="text-amber-500">&quot;documents&quot;</span>,
                &#123; keyPath:{" "}
                <span className="text-amber-500">&quot;id&quot;</span> &#125;)
              </div>
              <div className="pl-8 text-slate-500">
                {"// Index files by date for fast loading"}
              </div>
              <div className="pl-8">
                store.createIndex(
                <span className="text-amber-500">&quot;by-createdAt&quot;</span>
                , <span className="text-amber-500">&quot;createdAt&quot;</span>)
              </div>
              <div className="pl-4">&#125;)</div>

              <div className="border-t border-white/5 pt-3 mt-3">
                <span className="text-slate-600">
                  {"// Active DB Schema Value"}
                </span>
              </div>
              <div className="bg-[#0A0A0A] p-3 rounded-lg border border-white/5 space-y-1 text-slate-300">
                <div>&#123;</div>
                <div className="pl-4">
                  <span className="text-amber-500">id</span>:
                  &quot;69e13455-e138-4f26-aa16-9b689260f202&quot;,
                </div>
                <div className="pl-4">
                  <span className="text-amber-500">name</span>:
                  &quot;Untitled.md&quot;,
                </div>
                <div className="pl-4">
                  <span className="text-amber-500">content</span>: &quot;#
                  Welcome to Markups...&quot;,
                </div>
                <div className="pl-4">
                  <span className="text-amber-500">createdAt</span>:
                  1718582400000,
                </div>
                <div className="pl-4">
                  <span className="text-amber-500">updatedAt</span>:
                  1718582400500
                </div>
                <div>&#125;</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
