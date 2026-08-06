import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Globe,
  Copy,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EditorHeaderProps {
  files: Array<{ id: string; name: string }>;
  editingFileId: string | null;
  setEditingFileId: (id: string) => void;
  handleApplyToAll: () => Promise<void>;
  handleReset: () => void;
  triggerMockExport: (type: "pdf" | "html") => void;
}

export function EditorHeader({
  files,
  editingFileId,
  setEditingFileId,
  handleApplyToAll,
  handleReset,
  triggerMockExport
}: EditorHeaderProps) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b px-6 bg-card/60 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <Button asChild size="icon-sm" variant="ghost" className="rounded-lg">
          <Link href="/editor">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">Manus Publisher</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Layout Selector & Formatting</p>
          </div>
        </div>
      </div>

      {/* Project Selector & Apply utilities */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-border/80 bg-muted/20 px-2.5 py-1 rounded-lg">
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Editing File:</span>
          {files.length > 0 ? (
            <select
              value={editingFileId || ""}
              onChange={(e) => setEditingFileId(e.target.value)}
              className="text-xs bg-transparent font-medium border-none outline-none text-foreground py-0.5 cursor-pointer"
            >
              {files.map((file) => (
                <option key={file.id} value={file.id} className="bg-card text-foreground">
                  {file.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-semibold italic text-muted-foreground">No files loaded</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleApplyToAll}
          disabled={files.length <= 1}
          className="text-xs border border-border/30 hover:border-border/80 gap-1.5 transition-all"
        >
          <Copy className="size-3.5" />
          Apply to All
        </Button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs hover:bg-destructive/10 hover:text-destructive transition-colors gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Reset Design
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Export Dropdowns */}
        <Button
          onClick={() => triggerMockExport("pdf")}
          size="sm"
          className="text-xs font-semibold gap-1.5 cursor-pointer shadow-md shadow-primary/20 hover:scale-[1.01] transition-transform"
        >
          <Download className="size-3.5" />
          Export PDF
        </Button>
        <Button
          onClick={() => triggerMockExport("html")}
          variant="outline"
          size="sm"
          className="text-xs hover:bg-accent hover:text-accent-foreground cursor-pointer gap-1.5"
        >
          <Globe className="size-3.5" />
          Export HTML
        </Button>
      </div>
    </header>
  );
}
