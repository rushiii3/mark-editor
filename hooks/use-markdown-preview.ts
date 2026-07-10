"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import type { TocHeading } from "@/components/editor/types";
import { useTheme } from "next-themes";

type MarkdownPreviewState = {
  headings: TocHeading[];
  html: string;
  isLoading: boolean;
};

const INITIAL_STATE: MarkdownPreviewState = {
  headings: [],
  html: "<p>Open preview to render this document.</p>",
  isLoading: false
};

const getDebounceDelay = (length: number) => {
  if (length < 5000) return 150;      // Under ~1000 words: 150ms
  if (length < 25000) return 250;     // Under ~5000 words: 250ms
  if (length < 100000) return 400;    // Under ~20,000 words: 400ms
  return 750;                         // Large files / 400+ pages: 750ms
};

export function useMarkdownPreview(
  markdown: string,
  enabled: boolean
  // theme: string | undefined
) {
  const [state, setState] = useState(INITIAL_STATE);
  const { theme } = useTheme();

  const requestIdRef = useRef(0);
  const previousKeyRef = useRef("");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const key = `${theme}:${markdown}`;

    if (previousKeyRef.current === key) {
      return;
    }

    previousKeyRef.current = key;

    const requestId = ++requestIdRef.current;
    const debounceDelay = getDebounceDelay(markdown.length);

    const timer = window.setTimeout(async () => {
      try {
        const { processMarkdownPreview } = await import(
          "@/lib/editor/markdown-preview"
        );
        const result = await processMarkdownPreview(
          markdown,
          theme === "dark" ? "dark" : "light"
        );
        console.log(theme);

        if (requestId !== requestIdRef.current) {
          return;
        }

        startTransition(() => {
          setState({
            headings: result.headings,
            html: result.html,
            isLoading: false
          });
        });
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setState({
          headings: [],
          html: "<p>Failed to render preview.</p>",
          isLoading: false
        });
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [markdown, enabled, theme]);

  return state;
}
