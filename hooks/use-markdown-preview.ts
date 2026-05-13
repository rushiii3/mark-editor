"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import type { TocHeading } from "@/components/editor/types";
import { processMarkdownPreview } from "@/lib/editor/markdown-preview";

type UseMarkdownPreviewOptions = {
  enabled: boolean;
};

type MarkdownPreviewState = {
  headings: TocHeading[];
  html: string;
  isLoading: boolean;
};

const INITIAL_STATE: MarkdownPreviewState = {
  headings: [],
  html: "<p>Open preview to render this document.</p>",
  isLoading: false,
};

export function useMarkdownPreview(
  markdown: string,
  options: UseMarkdownPreviewOptions,
) {
  const deferredMarkdown = useDeferredValue(markdown);
  const [state, setState] = useState<MarkdownPreviewState>(INITIAL_STATE);

  useEffect(() => {
    if (!options.enabled) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      startTransition(() => {
        setState((current) => ({
          ...current,
          isLoading: true,
        }));
      });

      processMarkdownPreview(deferredMarkdown)
        .then((result) => {
          if (cancelled) {
            return;
          }

          startTransition(() => {
            setState({
              headings: result.headings,
              html: result.html,
              isLoading: false,
            });
          });
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          startTransition(() => {
            setState({
              headings: [],
              html: "<p>We couldn&apos;t render the preview for this document.</p>",
              isLoading: false,
            });
          });
        });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [deferredMarkdown, options.enabled]);

  return state;
}
