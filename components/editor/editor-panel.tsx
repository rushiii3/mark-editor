"use client";

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import type { SlashCommand, SlashMenuState } from "@/components/editor/types";

type EditorPanelProps = {
  markdown: string;
  onChange: (value: string) => void;
  onMount: OnMount;
  slashMenuState: SlashMenuState;
  slashCommands: SlashCommand[];
  onSelectSlashCommand: (id: SlashCommand["id"]) => void;
  onCloseSlashMenu: () => void;
};

export function EditorPanel({
  markdown,
  onChange,
  onMount,
  slashMenuState,
  slashCommands,
  onSelectSlashCommand,
  onCloseSlashMenu,
}: EditorPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!slashMenuState.open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onCloseSlashMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onCloseSlashMenu, slashMenuState.open]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-full flex-1 flex-col overflow-hidden bg-background"
    >
      <div className="relative flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={markdown}
          onChange={(value) => onChange(value ?? "")}
          onMount={onMount}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            wordWrap: "on",
            lineNumbers: "on",
            lineNumbersMinChars: 2,
            glyphMargin: false,
            folding: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 20 },
            smoothScrolling: true,
            contextmenu: false,
            automaticLayout: true,
            overviewRulerBorder: false,
            renderLineHighlight: "none",
            hideCursorInOverviewRuler: true,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        />

        {slashMenuState.open ? (
          <div
            className="absolute z-20 min-w-48 overflow-hidden rounded-xl border bg-popover shadow-xl"
            style={{
              top: slashMenuState.top,
              left: slashMenuState.left,
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <div className="border-b px-3 py-2 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Slash Commands
            </div>
            <div className="p-2">
              {slashCommands.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectSlashCommand(command.id)}
                >
                  {command.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
