"use client";

import {
  type RefObject,
  memo
} from "react";
import { useSettingsStore } from "@/store/settings-store";

type PreviewPanelProps = {
  html: string;
  previewRef: RefObject<HTMLDivElement | null>;
  previewMode?: "web" | "pdf";
};

export const PreviewPanel = memo(function PreviewPanel({
  html,
  previewRef,
  previewMode = "web"
}: PreviewPanelProps) {
  const { activeFont } = useSettingsStore();

  const getFontFamilyStyle = () => {
    if (activeFont === "Inter") {
      return "var(--font-sans)";
    }
    if (activeFont === "Times New Roman") {
      return '"Times New Roman", Times, Georgia, serif';
    }
    return `'${activeFont}', sans-serif`;
  };

  return (
    <section className="flex h-full min-h-80 flex-1 flex-col overflow-hidden bg-white dark:bg-background">
      <div
        // className={previewMode === "pdf" ? "pdf-preview-canvas" : ""}
        className="overflow-y-scroll"
      >
        <div
        // className={previewMode === "pdf" ? "pdf-page-stack" : ""}
        // style={
        //   previewMode === "pdf"
        //     ? ({
        //         ["--pdf-page-count" as string]: String(pageCount)
        //       } as CSSProperties)
        //     : undefined
        // }
        >
          <div
            ref={previewRef}
            style={{ fontFamily: getFontFamilyStyle() }}
            className={`mx-auto min-h-full prose prose-neutral prose-base dark:prose-invert
prose-hr:mt-1 prose-hr:mb-3
prose-code:before:content-none prose-code:after:content-none 
prose-code:px-1 prose-code:py-0.5 prose-code:rounded

[&_th]:border
[&_td]:border

[&_table]:border 
[&_table]:border-gray-400
[&_table]:w-full
[&_th]:px-3
[&_th]:py-2
[&_td]:px-3
[&_td]:py-2
${previewMode === "pdf" ? "pdf-page-content" : "px-9 py-8"}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </section>
  );
});
