"use client";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { Card, CardContent } from "../ui/card";

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
    <section className="relative  py-12  ">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <LazyMotion features={domAnimation} key={stat.id}>
                <m.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card/40">
                    <CardContent className="flex flex-col items-center ">
                      <span className="text-3xl sm:text-4xl font-extrabold  tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-sm font-semibold text-amber-500 mt-2">
                        {stat.label}
                      </span>
                      <span className="text-xs text-foreground/60 mt-1">
                        {stat.subtext}
                      </span>
                    </CardContent>
                  </Card>
                </m.div>
              </LazyMotion>
            ))}
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
