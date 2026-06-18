"use client";

import { motion } from "framer-motion";

const stats = [
  {
    id: 1,
    value: "1,240+",
    label: "GitHub Stars",
    subtext: "Starring active community"
  },
  {
    id: 2,
    value: "16+",
    label: "Contributors",
    subtext: "Community driven codebase"
  },
  {
    id: 3,
    value: "340+",
    label: "Commits",
    subtext: "Active development updates"
  },
  {
    id: 4,
    value: "100%",
    label: "Local-First",
    subtext: "Zero cloud dependencies"
  }
];

export function SocialProof() {
  return (
    <section className="relative  py-12 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-[#0D0D0D] hover:border-white/10 transition-colors duration-200"
            >
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-amber-500 mt-2">
                {stat.label}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                {stat.subtext}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
