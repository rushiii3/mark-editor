import { useFileStore } from "@/store/file-store";
import { SaveStatusIndicator } from "./footer/SaveStatusIndicator";
import { Button } from "../ui/button";
import { useSettingsStore } from "@/store/settings-store";
import { memo } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
import { useStorageStore } from "@/store/storage-store";
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
  const toggleLineWrapping = useSettingsStore(
    (state) => state.toggleLineWrapping
  );
  const { percentage } = useStorageStore();

  return (
    <footer className="min-h-9 items-center gap-6 overflow-x-auto px-4 text-sm text-muted-foreground flex ">
      <span className="text-nowrap">Words: {words}</span>
      <span className="text-nowrap">Chars: {chars}</span>
      <span className="text-nowrap">Reading: {readingMinutes} min</span>
      <span className="text-nowrap">
        Wrap:{" "}
        <Button variant="ghost" onClick={toggleLineWrapping} className="p-0">
          {wrap ? "On" : "Off"}
        </Button>
      </span>
      <span className="text-nowrap">
        Ln {cursorPosition.line}, Col {cursorPosition.column}
      </span>
      {/* <span className="ml-auto text-emerald-600 text-nowrap">
        All changes saved
      </span> */}
      <div className="ml-auto flex items-center gap-2">
        <SaveStatusIndicator status={saveStatus} />
      </div>
      <div>
        <Field className="w-full max-w-sm gap-1">
          <FieldLabel className="text-xs font-bold" htmlFor="progress-storage">
            <span>Storage</span>
            <span className="ml-auto">{percentage}%</span>
          </FieldLabel>
          <Progress value={percentage} id="progress-storage" />
        </Field>
      </div>
      {/* <span className="text-nowrap">UTF-8</span>
      <span className="text-nowrap">Markdown</span> */}
    </footer>
  );
};

export default memo(EditorFooter);
