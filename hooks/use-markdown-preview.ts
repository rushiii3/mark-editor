"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import type { TocHeading } from "@/components/editor/types";
import { processMarkdownPreview } from "@/lib/editor/markdown-preview";

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

export function useMarkdownPreview(markdown: string, enabled: boolean) {
  const [state, setState] = useState(INITIAL_STATE);

  const requestIdRef = useRef(0);
  const previousMarkdownRef = useRef("");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (previousMarkdownRef.current === markdown) {
      return;
    }

    previousMarkdownRef.current = markdown;

    const requestId = ++requestIdRef.current;

    const timer = window.setTimeout(async () => {
      try {
        const result = await processMarkdownPreview(markdown);

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
  }, [markdown, enabled]);

  return state;
}
