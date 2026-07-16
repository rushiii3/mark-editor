"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      "Writing documents in CodeMirror with custom slash commands is incredibly fast. Highly responsive UI with zero lag, and the open-source MIT license means I can trust it.",
    author: "Elena Rostova",
    role: "Fullstack Developer",
    avatar: "ER"
  },
  {
    quote:
      "I use Manus for all my technical design docs and resumes. The A4 page guide visualizer lets me layout multi-page documents perfectly without clipping elements. Clean HTML copies are a nice touch.",
    author: "Marcus Chen",
    role: "Software Architect",
    avatar: "MC"
  }
];

export function Testimonials() {
  return (
    <section className="relative py-20 md:py-28 border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight  mt-3">
            Loved by Developers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <LazyMotion features={domAnimation} key={t.author}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex"
              >
                <Card className="flex flex-col justify-between w-full hover:border-foreground/10 transition-colors duration-250 bg-card/40">
                  <CardContent className="text-sm text-foreground/70 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </CardContent>
                  <CardFooter className="flex items-center gap-3 border-t border-foreground/10 pt-4">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold  tracking-tight">
                        {t.author}
                      </h4>
                      <p className="text-[11px] text-foreground/50 mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </m.div>
            </LazyMotion>
          ))}
        </div>
      </div>
    </section>
  );
}
