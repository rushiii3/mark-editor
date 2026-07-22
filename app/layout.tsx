import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { Outfit, Merriweather, Fira_Code } from "next/font/google";

// const fontSans = Outfit({
//   subsets: ["latin"],
//   variable: "--font-sans"
// });

// const fontSerif = Merriweather({
//   subsets: ["latin"],
//   variable: "--font-serif"
// });

// const fontMono = Fira_Code({
//   subsets: ["latin"],
//   variable: "--font-mono"
// });

export const viewport: Viewport = {
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: "Mark Editor",
  description: "Offline-first Markdown to PDF editor",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Manus | Mark Editor"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Manus" />
      </head>
      <body
        className="min-h-dvh
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
    pl-[env(safe-area-inset-left)]
    pr-[env(safe-area-inset-right)]"
        // className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased min-h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
