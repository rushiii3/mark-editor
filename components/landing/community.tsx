"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  ConversationIcon,
  PullRequest,
  Warning
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const communityBlocks = [
  {
    icon: Warning,
    title: "Report Issues",
    description:
      "Found a rendering bug or want a new markdown extension? Open a GitHub issue, and our contributors will review it.",
    link: "https://github.com/rushiii3/mark-editor/issues"
  },
  {
    icon: PullRequest,
    title: "Pull Requests",
    description:
      "Want to implement a new feature? We love contributions. Fork the codebase, modify it, and open a pull request.",
    link: "https://github.com/rushiii3/mark-editor/pulls"
  },
  {
    icon: ConversationIcon,
    title: "Discussions",
    description:
      "Share your custom markdown styles, document templates, or suggest architectural upgrades in our community hub.",
    link: "https://github.com/rushiii3/mark-editor/discussions"
  }
];

export function Community() {
  return (
    <section
      id="community"
      className="relative py-20 md:py-28 overflow-hidden border-t border-foreground/10"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Community
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight  mt-3">
            Open for Collaboration
          </h3>
          <p className="max-w-xl text-foreground/40 mt-4 text-xs sm:text-sm leading-relaxed">
            Manus is shaped by developer feedback. Contribute to security
            improvements, style templates, or code cleanups directly on GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityBlocks.map((block, index) => (
            <LazyMotion features={domAnimation} key={block.title}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex"
              >
                <Card className="flex flex-col justify-between w-full bg-card/40">
                  <CardHeader className="flex flex-col gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/5 mb-5 group-hover:scale-105 transition-transform duration-300">
                      <HugeiconsIcon icon={block.icon} />
                    </div>
                    <CardTitle className="text-lg font-bold  tracking-tight">
                      {block.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-foreground/40 leading-relaxed">
                      {block.description}
                    </p>
                  </CardContent>

                  <CardFooter className="border-t border-foreground/10 pt-4">
                    <a
                      href={block.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary  transition-colors"
                    >
                      Learn More
                      <span>&rarr;</span>
                    </a>
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
