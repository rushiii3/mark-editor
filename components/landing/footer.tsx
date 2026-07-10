"use client";

import Link from "next/link";

const footerLink = [
  {
    title: "Product",
    link: [
      {
        title: "Workspace",
        url: "/editor",
        isExternal: false
      },
      {
        title: "Features",
        url: "#features",
        isExternal: false
      },
      {
        title: "How it works",
        url: "#workflow",
        isExternal: false
      }
    ]
  },
  {
    title: "Community",
    link: [
      {
        title: "GitHub",
        url: "https://github.com/rushiii3/mark-editor",
        isExternal: true
      },
      {
        title: "Issues",
        url: "https://github.com/rushiii3/mark-editor/issues",
        isExternal: true
      },
      {
        title: "Discussions",
        url: "https://github.com/rushiii3/mark-editor/discussions",
        isExternal: true
      }
    ]
  },
  {
    title: "Legal",
    link: [
      {
        title: "MIT License",
        url: "https://github.com/rushiii3/mark-editor/blob/main/LICENSE",
        isExternal: true
      },
      {
        title: "Privacy Policy",
        url: "#features",
        isExternal: false
      },
      {
        title: "Terms of Service",
        url: "#workflow",
        isExternal: false
      }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 py-12 md:py-16 text-foreground/60 text-xs sm:text-sm font-sans">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/5 pb-12">
          {/* Logo column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-amber-600 font-semibold  text-xs">
                M
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                Manus
              </span>
            </Link>
            <p className="text-xs text-foreground/50 max-w-xs leading-relaxed">
              A local-first, privacy-focused Markdown editor and PDF studio
              built for developer workflows. Free, open source, and
              offline-first.
            </p>
          </div>

          {/* Product links */}

          {footerLink.map((link, index) => (
            <div className="space-y-3" key={link.title + index}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {link.title}
              </h4>
              <ul className="space-y-2">
                {link.link.map((value, index) => (
                  <li key={value.title + index}>
                    <Link
                      href={value.url}
                      target={value.isExternal ? "_blank" : "_self"}
                      rel={value.isExternal ? "noreferrer" : undefined}
                      className="hover:text-foreground transition-colors"
                    >
                      {value.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} Manus Project. All rights
            reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/rushiii3/mark-editor"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              GitHub Repo
            </Link>
            <span>&bull;</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
