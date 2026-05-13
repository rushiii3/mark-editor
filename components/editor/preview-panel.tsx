"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type PreviewPanelProps = {
  html: string;
  previewRef: RefObject<HTMLDivElement | null>;
  previewMode?: "web" | "pdf";
};

export function PreviewPanel({
  html,
  previewRef,
  previewMode = "web",
}: PreviewPanelProps) {
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (previewMode !== "pdf" || !previewRef.current) {
      setPageCount(1);
      return;
    }

    const element = previewRef.current;
    const mmToPx = 3.7795275591;
    const pageHeightPx = 297 * mmToPx;
    const verticalPaddingPx = 38 * mmToPx;

    const updatePageCount = () => {
      const contentHeight = Math.max(
        element.scrollHeight - verticalPaddingPx,
        pageHeightPx,
      );
      setPageCount(Math.max(1, Math.ceil(contentHeight / pageHeightPx)));
    };

    updatePageCount();

    const observer = new ResizeObserver(() => {
      updatePageCount();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [html, previewMode, previewRef]);

  return (
    <section className="flex h-full min-h-[320px] flex-1 flex-col overflow-hidden bg-white dark:bg-background">
      <ScrollArea className="h-full">
        <div className={previewMode === "pdf" ? "pdf-preview-canvas" : ""}>
          <div
            className={previewMode === "pdf" ? "pdf-page-stack" : ""}
            style={
              previewMode === "pdf"
                ? ({
                    ["--pdf-page-count" as string]: String(pageCount),
                  } as CSSProperties)
                : undefined
            }
          >
            <div
              ref={previewRef}
              className={`mx-auto min-h-full w-full prose prose-slate prose-base dark:prose-invert
prose-hr:mt-1 prose-hr:mb-3
prose-code:before:content-none prose-code:after:content-none 
prose-code:px-1 prose-code:py-0.5 prose-code:rounded ${
                previewMode === "pdf" ? "pdf-page-content" : "px-9 py-8"
              }`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
