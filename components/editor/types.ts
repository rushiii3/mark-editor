import type { IRange } from "monaco-editor";

export type ToolbarAction =
  | "undo"
  | "redo"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "hr"
  | "code"
  | "code-block"
  | "link"
  | "table"
  | "image"
  | "toggle"
  | "checkbox"
  | "unordered-list"
  | "ordered-list"
  | "quote"
  | "export-pdf"
  | "note"
  | "tip"
  | "important"
  | "warning"
  | "caution"
  | "info"
  | "success"
  | "error"
  | "lb";
export type EditorViewMode = "write" | "split" | "preview" | "pdf";

export type SlashCommandId = "h1" | "h2" | "bold" | "page-break";

export type SlashMenuState = {
  open: boolean;
  top: number;
  left: number;
  range: IRange | null;
};

export type SlashCommand = {
  id: SlashCommandId;
  label: string;
};

export type TocHeading = {
  id: string;
  text: string;
  level: number;
};
