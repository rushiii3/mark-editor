"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Create",
    description:
      "Launch a new sandbox container instantly with a single click. No accounts or registrations required."
  },
  {
    num: "02",
    title: "Write",
    description:
      "Draft documents using Monaco's core formatting shortcuts, syntax highlighting, and live rendering."
  },
  {
    num: "03",
    title: "Structure",
    description:
      "Insert interactive Callouts, custom Collapse accordions, Page Breaks, and Badges using Slash command overlays."
  },
  {
    num: "04",
    title: "Auto-Save",
    description:
      "Work with confidence. Your changes are automatically debounced and saved locally to IndexedDB."
  },
  {
    num: "05",
    title: "Export",
    description:
      "Print pixel-perfect PDFs with pre-configured A4 margins or copy sanitized HTML to your clipboard."
  }
];

export function Workflow() {
  return (
    <section id="workflow" className="relative  py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            How it Works
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight  mt-3">
            Streamlined Document Lifecycles
          </h3>
        </div>

        <div className="relative mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Horizontal line for desktop layout */}
          <div className="hidden md:block absolute top-6.75 left-10 right-10 h-0.5 bg-linear-to-r from-amber-500/20 via-emerald-500/20 to-transparent -z-10"></div>

          {steps.map((step, index) => (
            <LazyMotion features={domAnimation} key={step.num}>
              <m.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left relative"
              >
                {/* Step indicator dot */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/10 bg-card text-primary font-bold font-mono text-lg shadow-3xl group-hover:border-amber-500 transition-colors duration-200">
                  {step.num}
                </div>

                <h4 className="text-lg font-bold  mt-6 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-foreground/40 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </m.div>
            </LazyMotion>
          ))}
        </div>
      </div>
    </section>
  );
}
