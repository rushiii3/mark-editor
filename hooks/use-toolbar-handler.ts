import { useCallback, type RefObject } from "react";
import type { editor } from "monaco-editor";
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

type UseToolbarHandlerProps = {
  editorRef: RefObject<editor.IStandaloneCodeEditor | null>;
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

  const handleToolbarAction = useCallback(
    async (action: ToolbarAction) => {
      const editorInstance = editorRef.current;

      if (action === "export-pdf") {
        if (!editorInstance) {
          return;
        }
        const markdown = editorInstance.getValue();
        try {
          const { generateMarkdownPdfBlob } =
            await import("@/lib/editor/pdf-generator");

          const blob = await generateMarkdownPdfBlob(markdown, activeFont);

          // console.log(blob);
          // console.log(blob instanceof Blob);
          // console.log(typeof blob);
          const url = URL.createObjectURL(blob);
          console.log(url);
          const link = document.createElement("a");
          link.href = url;
          // link.target = "_black";
          link.download = "document.pdf";
          link.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        }
        return;
      }

      if (!editorInstance) {
        return;
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
    [editorRef, onSidebarToggle]
  );

  return {
    handleInsertImage,
    handleTableInput,
    handleLinkInput,
    handleToolbarAction
  };
}
