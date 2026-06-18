"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const communityBlocks = [
  {
    icon: (
      <svg
        className="h-6 w-6 text-emerald-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    title: "Report Issues",
    description:
      "Found a rendering bug or want a new markdown extension? Open a GitHub issue, and our contributors will review it.",
    link: "https://github.com/rushiii3/mark-editor/issues"
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    title: "Pull Requests",
    description:
      "Want to implement a new feature? We love contributions. Fork the codebase, modify it, and open a pull request.",
    link: "https://github.com/rushiii3/mark-editor/pulls"
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-purple-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
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
      className="relative py-20 md:py-28 overflow-hidden border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            Community
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3">
            Open for Collaboration
          </h3>
          <p className="max-w-xl text-slate-400 mt-4 text-xs sm:text-sm leading-relaxed">
            Manus is shaped by developer feedback. Contribute to security
            improvements, style templates, or code cleanups directly on GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityBlocks.map((block, index) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex"
            >
              <Card className="flex flex-col justify-between w-full hover:border-white/10 transition-all duration-200 bg-card/40">
                <CardHeader className="flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 mb-5 group-hover:scale-105 transition-transform duration-300">
                    {block.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-white tracking-tight">{block.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {block.description}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-white/5 pt-4">
                  <a
                    href={block.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Learn More
                    <span>&rarr;</span>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
