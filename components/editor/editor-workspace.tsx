"use client";

import { useCallback, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { editor, IRange, Position } from "monaco-editor";
import { useTheme } from "next-themes";

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
  insertSnippet,
  insertTable,
  applyCallout,
  applyLineBreak
} from "@/components/editor/editor-utils";
import { EditorPanel } from "@/components/editor/editor-panel";
import { PreviewPanel } from "@/components/editor/preview-panel";
import { TableOfContentsPanel } from "@/components/editor/table-of-contents-panel";
import { Toolbar } from "@/components/editor/toolbar";
import type {
  EditorViewMode,
  SlashCommand,
  SlashMenuState,
  // TocHeading,
  ToolbarAction
} from "@/components/editor/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar";
import { useMarkdownPreview } from "@/hooks/use-markdown-preview";

const starterMarkdown = `# Markdown PDF Studio

Write in **Markdown**, preview your document in real time, and export a polished PDF when you're ready.

:::collapse[Click me]
Hidden content
:::


## Features

- Live preview with GitHub-flavored Markdown
- Toolbar actions powered by Monaco
- Slash commands for fast formatting
- Client-side PDF export

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

Try typing \`/\` in the editor to open the command menu.`;

const slashCommands: SlashCommand[] = [
  { id: "h1", label: "Heading 1" },
  { id: "h2", label: "Heading 2" },
  { id: "bold", label: "Bold" },
  { id: "page-break", label: "Page Break" }
];

export function EditorWorkspace() {
  const [markdown, setMarkdown] = useState(starterMarkdown);
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [slashMenuState, setSlashMenuState] = useState<SlashMenuState>({
    open: false,
    top: 0,
    left: 0,
    range: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLElement | null>(null);

  const previewEnabled = viewMode !== "write";
  const { headings, html: previewHtml } = useMarkdownPreview(
    markdown,
    previewEnabled
  );

  const closeSlashMenu = useCallback(() => {
    setSlashMenuState((current) =>
      current.open ? { open: false, top: 0, left: 0, range: null } : current
    );
  }, []);

  const getEditorContainer = useCallback(() => {
    if (editorContainerRef.current) {
      return editorContainerRef.current;
    }

    const editorDomNode = editorRef.current?.getDomNode();
    if (editorDomNode) {
      editorContainerRef.current = editorDomNode;
      return editorDomNode;
    }

    return null;
  }, []);

  const openSlashMenu = useCallback(
    (position: Position, range: IRange) => {
      const editorInstance = editorRef.current;
      const container = getEditorContainer();

      if (!editorInstance || !container) {
        return;
      }

      const visiblePosition =
        editorInstance.getScrolledVisiblePosition(position);

      if (!visiblePosition) {
        return;
      }

      setSlashMenuState({
        open: true,
        top: visiblePosition.top + visiblePosition.height + 12,
        left: Math.min(
          visiblePosition.left + 12,
          Math.max(16, container.clientWidth - 220)
        ),
        range
      });
    },
    [getEditorContainer]
  );

  const handleEditorMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      editorRef.current = editorInstance;
      editorContainerRef.current = editorInstance.getDomNode();

      editorInstance.onDidBlurEditorText(() => {
        closeSlashMenu();
      });

      editorInstance.onKeyDown((event) => {
        if (event.keyCode === monaco.KeyCode.Escape) {
          closeSlashMenu();
        }
      });

      editorInstance.onDidChangeCursorPosition(() => {
        const currentPosition = editorInstance.getPosition();
        if (currentPosition) {
          setCursorPosition({
            line: currentPosition.lineNumber,
            column: currentPosition.column
          });
        }

        setSlashMenuState((current) => {
          if (!current.open) {
            return current;
          }

          const position = editorInstance.getPosition();
          const container = getEditorContainer();

          if (!position || !container) {
            return current;
          }

          const visiblePosition =
            editorInstance.getScrolledVisiblePosition(position);

          if (!visiblePosition) {
            return current;
          }

          return {
            ...current,
            top: visiblePosition.top + visiblePosition.height + 12,
            left: Math.min(
              visiblePosition.left + 12,
              Math.max(16, container.clientWidth - 220)
            )
          };
        });
      });

      editorInstance.onDidChangeModelContent((event) => {
        const change = event.changes.at(-1);

        if (!change) {
          return;
        }

        if (change.text === "/" && change.rangeLength === 0) {
          const position = editorInstance.getPosition();
          if (!position) {
            return;
          }

          const range = new monaco.Range(
            change.range.startLineNumber,
            change.range.startColumn,
            change.range.startLineNumber,
            change.range.startColumn + 1
          );

          openSlashMenu(position, range);
          return;
        }

        closeSlashMenu();
      });
    },
    [closeSlashMenu, getEditorContainer, openSlashMenu]
  );

  const handleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);
  const handleToolbarAction = useCallback(
    async (action: ToolbarAction) => {
      const editorInstance = editorRef.current;

      if (action === "export-pdf") {
        if (!previewRef.current) {
          return;
        }

        const html2pdf = (await import("html2pdf.js")).default;
        await html2pdf()
          .set({
            filename: "document.pdf",
            margin: 10,
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: "#ffffff"
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "portrait"
            }
          })
          .from(previewRef.current)
          .save();

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
        case "link":
          insertLink(editorInstance);
          break;
        case "table":
          insertTable(editorInstance);
          break;
        case "image":
          insertImage(editorInstance);
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
          handleSidebar();
        default:
          break;
      }
    },
    [handleSidebar]
  );

  const handleSelectHeading = useCallback((id: string) => {
    const target = previewRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(id)}`
    );

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const handleSlashCommand = useCallback(
    (id: SlashCommand["id"]) => {
      const editorInstance = editorRef.current;
      const range = slashMenuState.range;

      if (!editorInstance || !range) {
        closeSlashMenu();
        return;
      }

      switch (id) {
        case "h1":
          insertSnippet(editorInstance, "# ");
          break;
        case "h2":
          insertSnippet(editorInstance, "## ");
          break;
        case "bold":
          insertSnippet(editorInstance, "****", 2);
          break;
        case "page-break":
          insertSnippet(editorInstance, '\n<div class="page-break"></div>\n');
          break;
        default:
          break;
      }

      closeSlashMenu();
    },
    [closeSlashMenu, slashMenuState.range]
  );

  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const chars = markdown.length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  const contentPane = (
    <div className="h-[calc(100vh-150px)]">
      {/* Sidebar */}

      {viewMode === "write" ? (
        <EditorPanel
          markdown={markdown}
          onChange={setMarkdown}
          onMount={handleEditorMount}
          slashMenuState={slashMenuState}
          slashCommands={slashCommands}
          onSelectSlashCommand={handleSlashCommand}
          onCloseSlashMenu={closeSlashMenu}
        />
      ) : viewMode === "preview" ? (
        // <div className="h-[calc(100vh-30rem)]">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="78%">
            <PreviewPanel html={previewHtml} previewRef={previewRef} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="22%" minSize="18%">
            <TableOfContentsPanel
              headings={headings}
              activeHeadingId={activeHeadingId}
              onSelect={handleSelectHeading}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup orientation="horizontal">
          {sidebarOpen && (
            <ResizablePanel defaultSize="15%">
              <Sidebar />
            </ResizablePanel>
          )}

          <ResizablePanel defaultSize="50%" minSize="30%">
            <EditorPanel
              markdown={markdown}
              onChange={setMarkdown}
              onMount={handleEditorMount}
              slashMenuState={slashMenuState}
              slashCommands={slashCommands}
              onSelectSlashCommand={handleSlashCommand}
              onCloseSlashMenu={closeSlashMenu}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="37%" minSize="28%">
            <PreviewPanel html={previewHtml} previewRef={previewRef} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="13%">
            <TableOfContentsPanel
              headings={headings}
              activeHeadingId={activeHeadingId}
              onSelect={handleSelectHeading}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Toolbar
        onAction={handleToolbarAction}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleTheme={handleToggleTheme}
      />

      {contentPane}

      <Separator />

      <footer className="flex min-h-9 items-center gap-6 overflow-x-auto px-4 text-sm text-muted-foreground">
        <span>Words: {words}</span>
        <span>Chars: {chars}</span>
        <span>Reading: {readingMinutes} min</span>
        <span>Wrap: On</span>
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
        <span className="ml-auto text-emerald-600">All changes saved</span>
        <span>UTF-8</span>
        <span>Markdown</span>
      </footer>
    </main>
  );
}
