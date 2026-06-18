"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The local-first architecture is a game changer. All my notes and images stay completely inside my browser database, avoiding third-party servers. Plus, the PDF rendering margins are pixel-perfect.",
    author: "Alex Rivera",
    role: "Senior Frontend Engineer",
    avatar: "AR"
  },
  {
    quote:
      "Writing documents in Monaco with full autocomplete and custom slash commands is incredibly fast. Highly responsive UI with zero lag, and the open-source MIT license means I can trust it.",
    author: "Elena Rostova",
    role: "Fullstack Developer",
    avatar: "ER"
  },
  {
    quote:
      "I use Markups for all my technical design docs and resumes. The A4 page guide visualizer lets me layout multi-page documents perfectly without clipping elements. Clean HTML copies are a nice touch.",
    author: "Marcus Chen",
    role: "Software Architect",
    avatar: "MC"
  }
];

export function Testimonials() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            Testimonials
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3">
            Loved by Developers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-[#0F0F0F] hover:border-white/10 transition-colors duration-250 relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/0 transition-all duration-300 opacity-60"></div>

              <div className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                &ldquo;{t.quote}&rdquo;
              </div>

              <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4 relative z-10">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
