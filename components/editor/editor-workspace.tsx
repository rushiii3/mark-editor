"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

import type { EditorViewMode, SlashCommand } from "@/components/editor/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useMarkdownPreview } from "@/hooks/use-markdown-preview";
import { useDocumentPersistence } from "@/hooks/use-document-persistence";
import { useMonacoHandler } from "@/hooks/use-monaco-handler";
import { useToolbarHandler } from "@/hooks/use-toolbar-handler";
import { insertSnippet } from "@/components/editor/editor-utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFileStore } from "@/store/file-store";
import { useSettingsStore } from "@/store/settings-store";

const EditorPanel = dynamic(
  () =>
    import("@/components/editor/editor-panel").then((mod) => mod.EditorPanel),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-muted-foreground text-xs">Loading Editor...</div>
    )
  }
);

const PreviewPanel = dynamic(
  () =>
    import("@/components/editor/preview-panel").then((mod) => mod.PreviewPanel),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-muted-foreground text-xs">
        Loading Preview...
      </div>
    )
  }
);

const TableOfContentsPanel = dynamic(
  () =>
    import("@/components/editor/table-of-contents-panel").then(
      (mod) => mod.TableOfContentsPanel
    ),
  { ssr: false }
);

const Toolbar = dynamic(
  () => import("@/components/editor/toolbar").then((mod) => mod.Toolbar),
  { ssr: false }
);

const Sidebar = dynamic(() => import("./sidebar").then((mod) => mod.Sidebar), {
  ssr: false
});

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
  const [prevIsTablet, setPrevIsTablet] = useState(isTablet);

  const [viewMode, setViewMode] = useState<EditorViewMode>(
    isMobile ? "write" : "split"
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile && !isTablet);
  const [tocOpen, setTocOpen] = useState(false);

  const { customFonts, loadCustomFonts } = useSettingsStore();
  const [fontStylesHtml, setFontStylesHtml] = useState("");

  // Load custom fonts on initial mount
  useEffect(() => {
    loadCustomFonts();
  }, []);

  // Generate dynamic @font-face style declarations when customFonts state changes
  useEffect(() => {
    let active = true;
    const urlsToRevoke: string[] = [];

    const loadFontStyles = async () => {
      try {
        const { getAllFonts } = await import("@/db/font");
        const allFonts = await getAllFonts();
        if (!active) return;

        let stylesText = "";
        for (const font of allFonts) {
          const fontUrl = URL.createObjectURL(font.blob);
          urlsToRevoke.push(fontUrl);

          stylesText += `
            @font-face {
              font-family: '${font.family}';
              src: url('${fontUrl}') format('truetype');
              font-weight: ${font.weight};
              font-style: ${font.style};
              font-display: swap;
            }
          `;
        }

        setFontStylesHtml(stylesText);
      } catch (err) {
        console.error("Failed to generate custom font styles:", err);
      }
    };

    loadFontStyles();

    return () => {
      active = false;
      setTimeout(() => {
        urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
      }, 100);
    };
  }, [customFonts]);

  if (isMobile !== prevIsMobile || isTablet !== prevIsTablet) {
    setPrevIsMobile(isMobile);
    setPrevIsTablet(isTablet);
    setViewMode(isMobile ? "write" : "split");
    setSidebarOpen(!isMobile && !isTablet);
    setTocOpen(false);
  }

  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  const activeFileId = useFileStore((s) => s.activeFileId);
  const [prevActiveFileId, setPrevActiveFileId] = useState(activeFileId);

  const isDrawer = isMobile || isTablet;

  if (activeFileId !== prevActiveFileId) {
    setPrevActiveFileId(activeFileId);
    if (isDrawer) {
      setSidebarOpen(false);
    }
  }

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

  const handleTocToggle = useCallback(() => {
    setTocOpen((prev) => !prev);
  }, []);

  // 5. Hook: Toolbar actions mapping & PDF exporter setup
  const {
    handleInsertImage,
    handleTableInput,
    handleLinkInput,
    handleToolbarAction
  } = useToolbarHandler({
    editorRef,
    onSidebarToggle: handleSidebar,
    onTocToggle: handleTocToggle
  });

  // 6. Theme switcher callback
  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // 7. Table of contents heading scroll handler
  const handleSelectHeading = useCallback(
    (id: string) => {
      const target = previewRef.current?.querySelector<HTMLElement>(
        `#${CSS.escape(id)}`
      );

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveHeadingId(id);
        if (isDrawer) {
          setTocOpen(false);
        }
      }
    },
    [isDrawer]
  );

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

  // const isDrawer = isMobile || isTablet;
  const showSidebar = !isDrawer && sidebarOpen;
  const showTOC = !isMobile && !isTablet;

  const contentPane = (
    <div className="h-[calc(100vh-155px)]">
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
        showTOC ? (
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
          <PreviewPanel html={previewHtml} previewRef={previewRef} />
        )
      ) : (
        <ResizablePanelGroup orientation="horizontal">
          {showSidebar && (
            <ResizablePanel defaultSize="15%">
              <Sidebar />
            </ResizablePanel>
          )}

          <ResizablePanel
            defaultSize={showSidebar ? "45%" : "50%"}
            minSize="30%"
          >
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
          <ResizablePanel defaultSize={showTOC ? "37%" : "50%"} minSize="28%">
            <PreviewPanel html={previewHtml} previewRef={previewRef} />
          </ResizablePanel>
          {showTOC && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="13%">
                <TableOfContentsPanel
                  headings={headings}
                  activeHeadingId={activeHeadingId}
                  onSelect={handleSelectHeading}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {fontStylesHtml && (
        <style dangerouslySetInnerHTML={{ __html: fontStylesHtml }} />
      )}
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

      {isDrawer && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80 max-w-[85vw] border-r">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      {isDrawer && (
        <Sheet open={tocOpen} onOpenChange={setTocOpen}>
          <SheetContent side="right" className="p-0 w-80 max-w-[85vw] border-l">
            <div className="flex h-full flex-col bg-card">
              <div className="border-b px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Table of Contents
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <TableOfContentsPanel
                  headings={headings}
                  activeHeadingId={activeHeadingId}
                  onSelect={handleSelectHeading}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

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
