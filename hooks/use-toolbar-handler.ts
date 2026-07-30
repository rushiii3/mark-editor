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
import jszip from "jszip";

import { useSettingsStore } from "@/store/settings-store";
import { getImageBlob } from "@/db/image";
import { useFileStore } from "@/store/file-store";
import JSZip from "jszip";
import { runStep, useLoaderStore } from "@/store/loaderStore";

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
  const { start, setStep, fail, finish } = useLoaderStore.getState();
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

  async function exportImages(zip: JSZip, markdown: string): Promise<string> {
    const regex = /!\[([^\]]*)\]\(local-image:([^)]+)\)/g;

    let updatedMarkdown = markdown;

    for (const match of markdown.matchAll(regex)) {
      const [fullMatch, alt, imageId] = match;

      const blob = await getImageBlob(imageId);
      if (!blob) continue;

      // Preserve extension if possible
      const extension =
        blob.type.split("/")[1] || imageId.split(".").pop() || "webp";

      zip.file(`images/${imageId}.${extension}`, blob);

      updatedMarkdown = updatedMarkdown.replace(
        fullMatch,
        `![${alt}](images/${imageId}.${extension})`
      );
    }

    return updatedMarkdown;
  }

  const handleToolbarAction = useCallback(
    async (action: ToolbarAction) => {
      const editorInstance = editorRef.current;
      if (!editorInstance) {
        return;
      }

      if (action === "export-pdf") {
        start([
          { text: "Reading document" },
          { text: "Rendering PDF" },
          { text: "Preparing download" }
        ]);

        try {
          const markdown = await runStep(0, () =>
            editorInstance.state.doc.toString()
          );

          const blob = await runStep(1, async () => {
            const { generateMarkdownPdfBlob } =
              await import("@/lib/editor/pdf-generator");
            return generateMarkdownPdfBlob(markdown, activeFont);
          });

          await runStep(2, () => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "document.pdf";
            link.click();
            URL.revokeObjectURL(url);
          });

          finish();
        } catch (error) {
          console.error("Failed to generate PDF:", error);
          fail(
            error instanceof Error ? error.message : "Failed to generate PDF"
          );
        }
        return;
      }

      if (action === "export-md") {
        start([
          { text: "Collecting file" },
          { text: "Extracting images" },
          { text: "Building package" },
          { text: "Compressing" },
          { text: "Preparing download" }
        ]);

        try {
          const activeFile = await runStep(0, () =>
            useFileStore
              .getState()
              .files.find((f) => f.id === useFileStore.getState().activeFileId)
          );

          if (!activeFile) {
            fail("No active file to export");
            return;
          }

          const zip = new jszip();

          const markdown = await runStep(1, () =>
            exportImages(zip, activeFile.content)
          );

          await runStep(2, () => {
            const metadata = {
              format: "mdpack",
              version: 1,
              project: {
                id: activeFile.id,
                name: activeFile.name,
                createdAt: activeFile.createdAt,
                updatedAt: activeFile.updatedAt
              },
              editor: { name: "Markdown Editor", version: "1.0.0" }
            };
            const settings = {
              theme: "dark",
              page: { size: "A4", margin: 32 }
            };

            zip.file("metadata.json", JSON.stringify(metadata, null, 2));
            zip.file("settings.json", JSON.stringify(settings, null, 2));
            zip.file(
              `${activeFile.name.replace(/\.md$/i, "") || "Untitled"}.md`,
              markdown
            );
          });

          const blob = await runStep(3, () =>
            zip.generateAsync({
              type: "blob",
              compression: "DEFLATE",
              compressionOptions: { level: 9 }
            })
          );

          await runStep(4, () => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${activeFile.name.replace(/\.md$/i, "") || "Untitled"}.mdpack`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
          });

          finish();
        } catch (error) {
          console.error("Failed to export project:", error);
          fail(
            error instanceof Error ? error.message : "Failed to export project"
          );
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
