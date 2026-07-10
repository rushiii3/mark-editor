"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is it really free and open source?",
    a: "Yes, Manus is 100% free and open-source under the MIT license. You can inspect the code, modify it, host it yourself, or contribute directly to the repository."
  },
  {
    q: "Does it work completely offline?",
    a: "Yes. Once loaded, the application runs entirely inside your browser's client sandbox. All markdown compiling, image compressions, and PDF print exports happen client-side without any server dependencies."
  },
  {
    q: "Where is my document data stored?",
    a: "Your notes, documents, and uploaded images are saved locally to your browser's IndexedDB. We have no tracking, database telemetry, or remote servers. Your data is private to your device."
  },
  {
    q: "Can I self-host this application?",
    a: "Absolutely. Since it is a client-first static React application built on Next.js App Router, you can build it (`next build`) and deploy the static exports to Vercel, Netlify, Cloudflare Pages, or run it locally."
  },
  {
    q: "How does the image upload feature work?",
    a: "When you upload an image, a local compression utility optimizes it, converts it to a binary Blob, and writes it directly to the local IndexedDB database. You can reference it in your Markdown code via standard local-image URI IDs."
  },
  {
    q: "How can I contribute to the project?",
    a: "We welcome all contributions! You can visit our GitHub repository to report issues, suggest features, participate in discussions, or submit pull requests with improvements."
  }
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-20 md:py-28 border-t border-foreground/10 bg-background text-foreground"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">
            Frequently Asked Questions
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-sm sm:text-base font-bold hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
