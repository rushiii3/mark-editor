"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel,
  Github,
  Hamburger,
  Hamburger01FreeIcons,
  Hamburger02Icon
} from "@hugeicons/core-free-icons";

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform duration-200">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">Manus</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium ">
            <Link href="#features" className=" transition-colors">
              Features
            </Link>
            <Link href="#why-open-source" className=" transition-colors">
              Open Source
            </Link>
            <Link href="#workflow" className=" transition-colors">
              Workflow
            </Link>
            <Link href="#community" className=" transition-colors">
              Community
            </Link>
            <Link href="#faq" className=" transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="">
              <Link
                href="https://github.com/rushiii3/mark-editor"
                target="_blank"
                rel="noreferrer"
              >
                <HugeiconsIcon icon={Github} />
                Star
                <Badge
                  // variant=""
                  className="ml-1 h-4 px-1.5 text-[9px] bg-foreground/10 text-foreground border-transparent"
                >
                  1.2k
                </Badge>
              </Link>
            </Button>
            {mounted ? (
              <AnimatedThemeToggler
                theme={resolvedTheme as "light" | "dark"}
                onThemeChange={(newTheme) => setTheme(newTheme)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
            )}
            <Button asChild size="lg">
              <Link href="/editor">Open Editor</Link>
            </Button>
          </div>

          {/* Mobile Menu Btn */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center rounded-lg p-2 text-foreground/40 "
          >
            {mobileMenuOpen ? (
              <HugeiconsIcon icon={Cancel} />
            ) : (
              <HugeiconsIcon icon={Hamburger} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-2xl border border-foreground/20 bg-card p-4 flex flex-col gap-4 text-foreground animate-in fade-in slide-in-from-top-4 duration-200">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className=" py-1.5"
            >
              Features
            </Link>
            <Link
              href="#why-open-source"
              onClick={() => setMobileMenuOpen(false)}
              className=" py-1.5"
            >
              Open Source
            </Link>
            <Link
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className=" py-1.5"
            >
              Workflow
            </Link>
            <Link
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className=" py-1.5"
            >
              Community
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className=" py-1.5"
            >
              FAQ
            </Link>

            <Separator className="bg-foreground/10" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-1.5 text-foreground/40">
                <span className="text-sm font-medium">Theme</span>
                {mounted ? (
                  <AnimatedThemeToggler
                    theme={resolvedTheme as "light" | "dark"}
                    onThemeChange={(newTheme) => setTheme(newTheme)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
                )}
              </div>
              <Button asChild variant="outline" size="lg" className="">
                <Link
                  href="https://github.com/rushiii3/mark-editor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <HugeiconsIcon icon={Github} />
                  Star
                  <Badge className="ml-1 h-4 px-1.5 text-[9px] bg-foreground/10 text-foreground border-transparent">
                    1.2k
                  </Badge>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full  font-semibold hover:-translate-y-px transition-all"
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
