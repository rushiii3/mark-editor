"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";

export function CTA() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden border-t border-foreground/10">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            // className="rounded-3xl border border-white/10 bg-background px-8 py-16 text-center shadow-2xl relative overflow-hidden"
          >
            <Card className="bg-card/40">
              <CardContent className="text-center px-8 py-16">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to write beautiful, secure documents?
                </h3>
                <p className="max-w-xl mx-auto text-sm sm:text-base text-foreground/50 mt-4 leading-relaxed">
                  Manus is completely free, runs client-side in your browser,
                  and auto-saves your changes to local storage. Give it a star
                  or open the editor to start coding.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    // className="w-full sm:w-auto rounded-xl font-semibold px-8 py-6 shadow-lg shadow-primary/10 hover:-translate-y-px transition-all"
                  >
                    <Link href="/editor">Open the Editor</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    // className="w-full sm:w-auto font-semibold text-base px-8 py-6 shadow-xl shadow-primary/10 transition-all duration-200 hover:-translate-y-px"
                  >
                    <Link
                      href="https://github.com/rushiii3/mark-editor"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <HugeiconsIcon icon={GithubIcon} className="mr-2" /> Star
                      on GitHub
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
