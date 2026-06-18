"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-background/80 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform duration-200">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">Manus</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium ">
            <a href="#features" className=" transition-colors">
              Features
            </a>
            <a href="#why-open-source" className=" transition-colors">
              Open Source
            </a>
            <a href="#workflow" className=" transition-colors">
              Workflow
            </a>
            <a href="#community" className=" transition-colors">
              Community
            </a>
            <a href="#faq" className=" transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <a
                href="https://github.com/rushiii3/mark-editor"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" data-icon="inline-start">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                  />
                </svg>
                Star
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[9px] bg-white/10 text-white border-transparent">
                  1.2k
                </Badge>
              </a>
            </Button>
            {mounted ? (
              <AnimatedThemeToggler
                theme={resolvedTheme as "light" | "dark"}
                onThemeChange={(newTheme) => setTheme(newTheme)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
            )}
            <Button
              asChild
              size="lg"
              className="rounded-xl font-semibold shadow-lg shadow-primary/20 hover:-translate-y-px transition-all"
            >
              <Link href="/editor">Open Editor</Link>
            </Button>
          </div>

          {/* Mobile Menu Btn */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center rounded-lg p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-2xl border border-white/10 bg-[#0F0F0F] p-4 flex flex-col gap-4 text-slate-400 animate-in fade-in slide-in-from-top-4 duration-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1.5"
            >
              Features
            </a>
            <a
              href="#why-open-source"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1.5"
            >
              Open Source
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1.5"
            >
              Workflow
            </a>
            <a
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1.5"
            >
              Community
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1.5"
            >
              FAQ
            </a>
            
            <Separator className="bg-white/10" />
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-1.5 text-slate-300">
                <span className="text-sm font-medium">Theme</span>
                {mounted ? (
                  <AnimatedThemeToggler
                    theme={resolvedTheme as "light" | "dark"}
                    onThemeChange={(newTheme) => setTheme(newTheme)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
                )}
              </div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <a
                  href="https://github.com/rushiii3/mark-editor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    data-icon="inline-start"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                    />
                  </svg>
                  Star on GitHub
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl font-semibold hover:-translate-y-px transition-all"
              >
                <Link href="/editor" onClick={() => setMobileMenuOpen(false)}>
                  Open Editor
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
