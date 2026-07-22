import { useFileStore } from "@/store/file-store";
import { Save } from "lucide-react";
import React from "react";
import { SaveStatusIndicator } from "./footer/SaveStatusIndicator";
type EditorFooterProps = {
  words: number;
  chars: number;
  readingMinutes: number;
  cursorPosition: {
    line: number;
    column: number;
  };
  wrap: boolean;
};
const EditorFooter = ({
  words,
  chars,
  readingMinutes,
  cursorPosition,
  wrap
}: EditorFooterProps) => {
  const saveStatus = useFileStore((s) => s.saveStatus);

  return (
    <footer className="min-h-9 items-center gap-6 overflow-x-auto px-4 text-sm text-muted-foreground flex ">
      <span className="text-nowrap">Words: {words}</span>
      <span className="text-nowrap">Chars: {chars}</span>
      <span className="text-nowrap">Reading: {readingMinutes} min</span>
      <span className="text-nowrap">Wrap: {wrap ? "On" : "Off"}</span>
      <span className="text-nowrap">
        Ln {cursorPosition.line}, Col {cursorPosition.column}
      </span>
      {/* <span className="ml-auto text-emerald-600 text-nowrap">
        All changes saved
      </span> */}
      <div className="ml-auto flex items-center gap-2">
        <SaveStatusIndicator status={saveStatus} />
      </div>

      <span className="text-nowrap">UTF-8</span>
      <span className="text-nowrap">Markdown</span>
    </footer>
  );
};

export default EditorFooter;
