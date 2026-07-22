"use client";

import { Activity, useCallback, useEffect, useRef, useState } from "react";
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
// import { useMonacoHandler } from "@/hooks/use-monaco-handler";
import { useToolbarHandler } from "@/hooks/use-toolbar-handler";
import { insertSnippet } from "@/components/editor/editor-utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFileStore } from "@/store/file-store";
import { useSettingsStore } from "@/store/settings-store";
import { useCodeMirrorHandler } from "@/hooks/use-codemirror-handler";
import EditorFooter from "./editor-footer";

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
- Toolbar actions powered by CodeMirror
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
  console.log("EditorWorkspace rendered");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
  const [prevIsTablet, setPrevIsTablet] = useState(isTablet);

  const [viewMode, setViewMode] = useState<EditorViewMode>(
    isMobile ? "write" : "split"
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile && !isTablet);
  const [tocOpen, setTocOpen] = useState(false);

  const { customFonts, loadCustomFonts, showHeader } = useSettingsStore();
  const [fontStylesHtml, setFontStylesHtml] = useState("");
  const loadFiles = useFileStore((state) => state.loadFiles);
  // const loadFileById = useFileStore((state) => state.loadFileById);

  // Load custom fonts on initial mount
  useEffect(() => {
    loadCustomFonts();
    loadFiles();
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
  // useEffect(() => {
  //   if (!activeFileId) return;

  //   loadFileById(activeFileId);
  // }, [activeFileId]);

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

  const {
    editorRef,
    cursorPosition,
    slashMenuState,
    closeSlashMenu,
    handleCreateEditor,
    handleUpdate
  } = useCodeMirrorHandler();

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

  const getEditorInfo = () => {
    const editorInstance = editorRef.current;
    if (!editorInstance) {
      return true;
    }
    const { lineWrapping } = editorInstance;
    return lineWrapping;
  };

  //   const handleHtmlExport = async () => {
  //     const html = `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8" />
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //   <title>Document</title>
  //       <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  // <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  // </head>
  // <body class="mx-auto text-black p-3 max-w-3xl min-h-full prose prose-gray prose-base dark:prose-invert
  // prose-hr:mt-1 prose-hr:mb-3
  // prose-code:before:content-none prose-code:after:content-none
  // prose-code:px-1 prose-code:py-0.5 prose-code:rounded
  // prose-img:rounded
  // [&_th]:border
  // [&_td]:border

  // [&_table]:border
  // [&_table]:border-gray-400
  // [&_table]:w-full
  // [&_th]:px-3
  // [&_th]:py-2
  // [&_td]:px-3
  // [&_td]:py-2">
  //   ${previewHtml}
  // </body>
  // </html>`;

  //     const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8" });
  //     const url = URL.createObjectURL(htmlBlob);

  //     console.log(url);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     // link.download = "document.html";
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // link.remove();

  //     // URL.revokeObjectURL(url);
  //   };

  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const chars = markdown.length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  // const isDrawer = isMobile || isTablet;
  const showSidebar = !isDrawer && sidebarOpen;
  const showTOC = !isMobile && !isTablet;

  const heightClass = showHeader
    ? "h-[calc(100dvh-9.7rem)]"
    : "h-[calc(100dvh-5.9rem)]";

  const editor = (
    <EditorPanel
      markdown={markdown}
      onChange={setMarkdown}
      slashMenuState={slashMenuState}
      slashCommands={slashCommands}
      onSelectSlashCommand={handleSlashCommand}
      onCloseSlashMenu={closeSlashMenu}
      handleCreateEditor={handleCreateEditor}
      handleUpdate={handleUpdate}
    />
  );

  const preview = <PreviewPanel html={previewHtml} previewRef={previewRef} />;

  const toc = (
    <TableOfContentsPanel
      headings={headings}
      activeHeadingId={activeHeadingId}
      onSelect={handleSelectHeading}
    />
  );

  const contentPane = (
    <div className={heightClass}>
      <Activity mode={viewMode === "write" ? "visible" : "hidden"}>
        {editor}
      </Activity>

      <Activity mode={viewMode === "preview" ? "visible" : "hidden"}>
        {showTOC ? (
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={78}>{preview}</ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={22} minSize={18}>
              {toc}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          preview
        )}
      </Activity>

      <Activity mode={viewMode === "split" ? "visible" : "hidden"}>
        <ResizablePanelGroup orientation="horizontal">
          {showSidebar && (
            <>
              <ResizablePanel defaultSize={15}>
                <Sidebar />
              </ResizablePanel>

              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={showSidebar ? 45 : 50} minSize={30}>
            {editor}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={showTOC ? 37 : 50} minSize={28}>
            {preview}
          </ResizablePanel>

          {showTOC && (
            <>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={13}>{toc}</ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </Activity>
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

      {/*<Button onClick={handleHtmlExport}>HTMl</Button>*/}
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

      <EditorFooter
        words={words}
        chars={chars}
        readingMinutes={readingMinutes}
        cursorPosition={cursorPosition}
        wrap={getEditorInfo() ? true : false}
      />
    </main>
  );
}
