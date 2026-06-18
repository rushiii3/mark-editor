"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 md:py-16 text-slate-500 text-xs sm:text-sm font-sans">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/5 pb-12">
          {/* Logo column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 font-semibold text-black text-xs">
                M
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Manus
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              A local-first, privacy-focused Markdown editor and PDF studio
              built for developer workflows. Free, open source, and
              offline-first.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/editor"
                  className="hover:text-white transition-colors"
                >
                  Workspace
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="hover:text-white transition-colors"
                >
                  How it works
                </a>
              </li>
            </ul>
          </div>

          {/* Community links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/rushiii3/mark-editor"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rushiii3/mark-editor/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rushiii3/mark-editor/discussions"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Discussions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/rushiii3/mark-editor/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  MIT License
                </a>
              </li>
              <li>
                <span className="text-slate-600">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-600">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} Manus Project. All rights
            reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rushiii3/mark-editor"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              GitHub Repo
            </a>
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
