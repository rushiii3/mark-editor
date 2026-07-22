"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import CodeMirror, { EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { markdown as markdownExtenstion } from "@codemirror/lang-markdown";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { SlashCommand, SlashMenuState } from "@/components/editor/types";
import { useSettingsStore } from "@/store/settings-store";

type EditorPanelProps = {
  markdown: string;
  onChange: (value: string) => void;
  slashMenuState: SlashMenuState;
  slashCommands: SlashCommand[];
  onSelectSlashCommand: (id: SlashCommand["id"]) => void;
  onCloseSlashMenu: () => void;
  handleCreateEditor: (view: EditorView) => void;
  handleUpdate: (update: ViewUpdate) => void;
};

const markdownHighlightStyleDark = HighlightStyle.define([
  {
    tag: tags.heading1,
    // fontSize: "1.6em",
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.heading2,
    // fontSize: "1.4em",
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.heading3,
    // fontSize: "1.25em",
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.heading4,
    // fontSize: "1.1em",
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.heading5,
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.heading6,
    // fontWeight: "700",
    color: "#82aaff"
  },
  {
    tag: tags.strong,
    //  fontWeight: "700",
    color: "#f78c6c"
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#c3e88d" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "#676e95" },
  { tag: tags.link, color: "#89ddff", textDecoration: "underline" },
  { tag: tags.url, color: "#89ddff" },
  { tag: tags.quote, fontStyle: "italic", color: "#a6accd" },
  {
    tag: tags.monospace,
    color: "#c792ea",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  { tag: tags.contentSeparator, color: "#676e95" },
  { tag: tags.list, color: "#ffcb6b" },
  { tag: tags.processingInstruction, color: "#676e95" }
]);

const markdownHighlightStyleLight = HighlightStyle.define([
  {
    tag: tags.heading1,
    // fontSize: "1.6em",
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.heading2,
    // fontSize: "1.4em",
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.heading3,
    // fontSize: "1.25em",
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.heading4,
    // fontSize: "1.1em",
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.heading5,
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.heading6,
    // fontWeight: "700",
    color: "#1a56db"
  },
  {
    tag: tags.strong,
    // fontWeight: "700",
    color: "#c2410c"
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#15803d" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "#6b7280" },
  { tag: tags.link, color: "#0369a1", textDecoration: "underline" },
  { tag: tags.url, color: "#0369a1" },
  { tag: tags.quote, fontStyle: "italic", color: "#57534e" },
  {
    tag: tags.monospace,
    color: "#9333ea",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  { tag: tags.contentSeparator, color: "#6b7280" },
  { tag: tags.list, color: "#b45309" },
  { tag: tags.processingInstruction, color: "#6b7280" }
]);

export function EditorPanel({
  markdown,
  onChange,
  slashMenuState,
  slashCommands,
  onSelectSlashCommand,
  onCloseSlashMenu,
  handleCreateEditor,
  handleUpdate
}: EditorPanelProps) {
  const lineWrapping = useSettingsStore((state) => state.lineWrapping);

  const containerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const extensions = useMemo(
    () => [
      markdownExtenstion(),
      lineWrapping ? EditorView.lineWrapping : [],
      syntaxHighlighting(
        isDark ? markdownHighlightStyleDark : markdownHighlightStyleLight
      )
    ],
    [isDark, lineWrapping]
  );

  useEffect(() => {
    if (!slashMenuState.open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onCloseSlashMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [slashMenuState.open, onCloseSlashMenu]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-full flex-1 flex-col overflow-hidden bg-background"
    >
      <div className="relative flex-1 overflow-hidden">
        <CodeMirror
          value={markdown}
          height="100%"
          extensions={extensions}
          theme={isDark ? vscodeDark : vscodeLight}
          onChange={(value) => onChange(value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            autocompletion: false,
            searchKeymap: true,
            history: true,
            drawSelection: true,
            dropCursor: true,
            indentOnInput: true,
            bracketMatching: true,
            syntaxHighlighting: true
          }}
          style={{
            height: "100%",
            fontSize: "1em",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
          onCreateEditor={handleCreateEditor}
          onUpdate={handleUpdate}
        />

        {slashMenuState.open && (
          <div
            className="absolute z-100 min-w-48 overflow-hidden rounded-xl border bg-popover shadow-xl"
            style={{
              top: slashMenuState.top - 120,
              left: slashMenuState.left - 220
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Slash Commands
            </div>

            <div className="p-2">
              {slashCommands.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectSlashCommand(command.id)}
                >
                  {command.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
