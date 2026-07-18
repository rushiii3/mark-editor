"use client";
import { useCallback, type RefObject } from "react";
import { type EditorView } from "@uiw/react-codemirror";
import type { ToolbarAction } from "@/components/editor/types";
import {
  applyBlockQuote,
  applyBold,
  applyCodeBlock,
  applyHeading,
  applyInlineCode,
  applyItalic,
  applyList,
  applyOrderedList,
  applyRedo,
  applyStrikethrough,
  applyToggle,
  applyTaskList,
  applyUndo,
  applyWrap,
  insertHorizontalLine,
  insertImage,
  insertLink,
  insertTable,
  applyCallout,
  applyLineBreak
} from "@/components/editor/editor-utils";

import { useSettingsStore } from "@/store/settings-store";
import { getImageBlob } from "@/db/image";

type UseToolbarHandlerProps = {
  editorRef: RefObject<EditorView | null>;
  onSidebarToggle: () => void;
  onTocToggle?: () => void;
};

export function useToolbarHandler({
  editorRef,
  onSidebarToggle,
  onTocToggle
}: UseToolbarHandlerProps) {
  const activeFont = useSettingsStore((s) => s.activeFont);
  const handleInsertImage = useCallback(
    (url: string, alt: string) => {
      const editorInstance = editorRef.current;
      if (!editorInstance) {
        return;
      }
      const cmd = `![${alt}](${url})`;
      insertImage(editorInstance, cmd);
    },
    [editorRef]
  );

  const handleTableInput = useCallback(
    (rows: number, columns: number) => {
      const editorInstance = editorRef.current;
      if (!editorInstance) {
        return;
      }

      const headers = Array.from(
        { length: columns },
        (_, index) => `Column ${index + 1}`
      );
      const separator = Array.from({ length: columns }, () => "--------");
      const bodyRows = Array.from(
        { length: rows },
        (_, rowIndex) =>
          `| ${Array.from(
            { length: columns },
            (_, colIndex) => `Cell ${rowIndex + 1}-${colIndex + 1}`
          ).join(" | ")} |`
      );

      const table = [
        "",
        `| ${headers.join(" | ")} |`,
        `| ${separator.join(" | ")} |`,
        ...bodyRows,
        ""
      ].join("\n");

      insertTable(editorInstance, table);
    },
    [editorRef]
  );

  const handleLinkInput = useCallback(
    (url: string, altText: string) => {
      const editorInstance = editorRef.current;
      if (!editorInstance) {
        return;
      }

      const cmd = `[${altText}](${url})`;
      insertLink(editorInstance, cmd);
    },
    [editorRef]
  );

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  }

  async function embedLocalImages(markdown: string) {
    const regex = /!\[([^\]]*)\]\(local-image:([^)]+)\)/g;

    let result = markdown;

    const matches = [...markdown.matchAll(regex)];

    for (const match of matches) {
      const [fullMatch, alt, imageId] = match;

      const blob = await getImageBlob(imageId);
      if (!blob) continue;

      const base64 = await blobToBase64(blob);

      result = result.replace(fullMatch, `![${alt}](${base64})`);
    }

    return result;
  }
  const handleToolbarAction = useCallback(
    async (action: ToolbarAction) => {
      const editorInstance = editorRef.current;
      if (!editorInstance) {
        return;
      }

      if (action === "export-pdf") {
        const markdown = editorInstance.state.doc.toString();
        try {
          const { generateMarkdownPdfBlob } =
            await import("@/lib/editor/pdf-generator");
          const blob = await generateMarkdownPdfBlob(markdown, activeFont);
          const url = URL.createObjectURL(blob);
          console.log(url);
          const link = document.createElement("a");
          link.href = url;
          link.download = "document.pdf";
          link.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        }
        return;
      }
      if (action === "export-html") {
      }
      if (action === "export-md") {
        try {
          const markdown = editorInstance.state.doc.toString();

          const exportMarkdown = await embedLocalImages(markdown);

          if (!exportMarkdown) {
            return null;
          }

          console.log(exportMarkdown);

          const blob = new Blob([exportMarkdown], {
            type: "text/markdown;charset=utf-8"
          });

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "document.md";

          document.body.appendChild(link);
          link.click();
          link.remove();

          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        }
      }

      switch (action) {
        case "undo":
          applyUndo(editorInstance);
          break;
        case "redo":
          applyRedo(editorInstance);
          break;
        case "h1":
          applyHeading(editorInstance, 1);
          break;
        case "h2":
          applyHeading(editorInstance, 2);
          break;
        case "h3":
          applyHeading(editorInstance, 3);
          break;
        case "h4":
          applyHeading(editorInstance, 4);
          break;
        case "h5":
          applyHeading(editorInstance, 5);
          break;
        case "h6":
          applyHeading(editorInstance, 6);
          break;
        case "bold":
          applyBold(editorInstance);
          break;
        case "italic":
          applyItalic(editorInstance);
          break;
        case "underline":
          applyWrap(editorInstance, "<u>", "</u>");
          break;
        case "strikethrough":
          applyStrikethrough(editorInstance);
          break;
        case "hr":
          insertHorizontalLine(editorInstance);
          break;
        case "code":
          applyInlineCode(editorInstance);
          break;
        case "code-block":
          applyCodeBlock(editorInstance);
          break;
        case "toggle":
          applyToggle(editorInstance);
          break;
        case "checkbox":
          applyTaskList(editorInstance);
          break;
        case "unordered-list":
          applyList(editorInstance);
          break;
        case "ordered-list":
          applyOrderedList(editorInstance);
          break;
        case "quote":
          applyBlockQuote(editorInstance);
          break;
        case "note":
          applyCallout(editorInstance, "note");
          break;
        case "tip":
          applyCallout(editorInstance, "tip");
          break;
        case "important":
          applyCallout(editorInstance, "important");
          break;
        case "warning":
          applyCallout(editorInstance, "warning");
          break;
        case "caution":
          applyCallout(editorInstance, "caution");
          break;
        case "info":
          applyCallout(editorInstance, "info");
          break;
        case "success":
          applyCallout(editorInstance, "success");
          break;
        case "error":
          applyCallout(editorInstance, "error");
          break;
        case "lb":
          applyLineBreak(editorInstance);
          break;
        case "file":
          onSidebarToggle();
          break;
        case "toc":
          onTocToggle?.();
          break;

        default:
          break;
      }
    },
    [editorRef, activeFont, onSidebarToggle, onTocToggle]
  );

  return {
    handleInsertImage,
    handleTableInput,
    handleLinkInput,
    handleToolbarAction
  };
}
