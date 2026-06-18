import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { WhyOpenSource } from "@/components/landing/why-open-source";
import { Workflow } from "@/components/landing/workflow";
import { ProductPreview } from "@/components/landing/preview";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Community } from "@/components/landing/community";

export const metadata = {
  title: "Manus - Local-First Developer Markdown Studio",
  description:
    "A free, open-source, offline-ready markdown editor and PDF studio with slash commands, A4 print visualizer, and local storage persistence.",
  keywords: [
    "Markdown",
    "Editor",
    "PDF Export",
    "Local-First",
    "Open Source",
    "Developer tools"
  ],
  openGraph: {
    title: "Manus - Local-First Markdown Studio",
    description:
      "Write clean markdown, generate pixel-perfect A4 documents offline.",
    type: "website"
  }
};

export default function Home() {
  return (
    <div suppressHydrationWarning className="scroll-smooth">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <WhyOpenSource />
        <ProductPreview />
        <Workflow />
        <Testimonials />
        <Community />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
