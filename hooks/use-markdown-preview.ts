"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import type { TocHeading } from "@/components/editor/types";
import { processMarkdownPreview } from "@/lib/editor/markdown-preview";
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

    const timer = window.setTimeout(async () => {
      try {
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
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [markdown, enabled, theme]);

  return state;
}
