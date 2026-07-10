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
  if (length < 5000) return 150; // Under ~1000 words: 150ms
  if (length < 25000) return 250; // Under ~5000 words: 250ms
  if (length < 100000) return 400; // Under ~20,000 words: 400ms
  return 750; // Large files / 400+ pages: 750ms
};

// Compiled-output cache keyed by `${theme}:${markdown}`. Lets switching
// back to previously-seen content (undo, file switching, toggling
// write/preview) skip the remark/rehype pipeline entirely instead of
// recompiling identical content. FIFO eviction is fine at this size —
// this isn't trying to be a real LRU, just a cheap win.
const previewCache = new Map<
  string,
  { headings: TocHeading[]; html: string }
>();
const MAX_CACHE_ENTRIES = 20;

function cacheResult(
  key: string,
  value: { headings: TocHeading[]; html: string }
) {
  if (previewCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey !== undefined) {
      previewCache.delete(oldestKey);
    }
  }
  previewCache.set(key, value);
}

export function useMarkdownPreview(markdown: string, enabled: boolean) {
  const [state, setState] = useState(INITIAL_STATE);
  const { theme } = useTheme();

  const requestIdRef = useRef(0);
  const previousKeyRef = useRef("");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const resolvedTheme = theme === "dark" ? "dark" : "light";
    const key = `${resolvedTheme}:${markdown}`;

    if (previousKeyRef.current === key) {
      return;
    }

    previousKeyRef.current = key;

    const cached = previewCache.get(key);
    if (cached) {
      startTransition(() => {
        setState({ ...cached, isLoading: false });
      });
      return;
    }

    const requestId = ++requestIdRef.current;
    const debounceDelay = getDebounceDelay(markdown.length);

    // Flip isLoading immediately (not inside the timeout) so a UI
    // indicator can react the moment a recompute is scheduled, not
    // just once it starts running.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true }));

    const timer = window.setTimeout(async () => {
      try {
        const { processMarkdownPreview } =
          await import("@/lib/editor/markdown-preview");
        const result = await processMarkdownPreview(markdown, resolvedTheme);

        if (requestId !== requestIdRef.current) {
          return;
        }

        cacheResult(key, { headings: result.headings, html: result.html });

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
