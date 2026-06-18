"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { EditorPanel } from "@/components/editor/editor-panel";
import { PreviewPanel } from "@/components/editor/preview-panel";
import { TableOfContentsPanel } from "@/components/editor/table-of-contents-panel";
import { Toolbar } from "@/components/editor/toolbar";
import type { EditorViewMode, SlashCommand } from "@/components/editor/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar";
import { useMarkdownPreview } from "@/hooks/use-markdown-preview";
import { useDocumentPersistence } from "@/hooks/use-document-persistence";
import { useMonacoHandler } from "@/hooks/use-monaco-handler";
import { useToolbarHandler } from "@/hooks/use-toolbar-handler";
import { insertSnippet } from "@/components/editor/editor-utils";

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
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewEnabled = viewMode !== "write";

  // 1. Hook: Document state & IndexedDB auto-saving
  const { markdown, setMarkdown } = useDocumentPersistence(starterMarkdown);

  // 2. Hook: Monaco editor callbacks & cursor position state
  const {
    editorRef,
    cursorPosition,
    slashMenuState,
    handleEditorMount,
    closeSlashMenu
  } = useMonacoHandler();

  // 3. Hook: Live markdown compilation
  const { headings, html: previewHtml } = useMarkdownPreview(
    markdown,
    previewEnabled
  );

  // 4. Sidebar toggler callback
  const handleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // 5. Hook: Toolbar actions mapping & PDF exporter setup
  const {
    handleInsertImage,
    handleTableInput,
    handleLinkInput,
    handleToolbarAction
  } = useToolbarHandler({
    editorRef,
    onSidebarToggle: handleSidebar
  });

  // 6. Theme switcher callback
  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // 7. Table of contents heading scroll handler
  const handleSelectHeading = useCallback((id: string) => {
    const target = previewRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(id)}`
    );

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, []);

  // 8. Editor slash menu command trigger callback
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
    [closeSlashMenu, editorRef, slashMenuState.range]
  );

  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const chars = markdown.length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  const contentPane = (
    <div className="h-[calc(100vh-150px)]">
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
        onInsertImage={handleInsertImage}
        onInsertTable={handleTableInput}
        onInsertLink={handleLinkInput}
      />

      {contentPane}

      <Separator />

      <footer className=" min-h-9 items-center gap-6 overflow-x-auto px-4 text-sm text-muted-foreground md:flex hidden">
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
