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
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b px-6 bg-background/70 backdrop-blur-xl z-20 transition-all duration-300 border-border/60">
      {/* Brand Section */}
      <div className="flex items-center gap-3.5">
        <Button asChild size="icon-sm" variant="ghost" className="rounded-xl hover:bg-muted/60 transition-colors">
          <Link href="/editor">
            <ArrowLeft className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 font-bold text-white shadow-md shadow-blue-500/25 text-sm tracking-wide">
            M
          </div>
          <div>
            <h1 className="text-xs font-bold leading-none tracking-tight text-foreground/90">Manus Publisher</h1>
            <p className="text-[9px] text-muted-foreground/80 font-medium mt-0.5">Layout Selector & Formatting</p>
          </div>
        </div>
      </div>

      {/* Target Selector & Sync Utilities */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 border border-border/50 bg-muted/40 hover:bg-muted/60 hover:border-border/80 transition-all px-3 py-1.5 rounded-xl shadow-xs">
          <FileText className="size-3.5 text-indigo-500" />
          <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase">File:</span>
          {files.length > 0 ? (
            <select
              value={editingFileId || ""}
              onChange={(e) => setEditingFileId(e.target.value)}
              className="text-xs bg-transparent font-semibold border-none outline-none text-foreground/90 py-0.5 cursor-pointer focus:ring-0 focus:outline-none"
            >
              {files.map((file) => (
                <option key={file.id} value={file.id} className="bg-popover text-foreground font-medium">
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
          className="text-xs border border-border/40 hover:border-border/80 hover:bg-muted/40 rounded-xl gap-1.5 px-3 py-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-muted-foreground hover:text-foreground font-medium"
        >
          <Copy className="size-3.5 text-indigo-500/80" />
          Apply to All
        </Button>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground hover:border-destructive/20 border border-transparent font-medium transition-all duration-200 gap-1.5 px-3 py-1.5 cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          Reset Design
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-border/60" />

        {/* Primary Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => triggerMockExport("pdf")}
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 border-none px-3.5 py-1.5"
          >
            <Download className="size-3.5 text-white/90" />
            Export PDF
          </Button>
          <Button
            onClick={() => triggerMockExport("html")}
            variant="outline"
            size="sm"
            className="text-xs hover:bg-muted/40 cursor-pointer gap-1.5 rounded-xl border-border/60 font-medium px-3.5 py-1.5 transition-all duration-200"
          >
            <Globe className="size-3.5 text-indigo-500/80" />
            Export HTML
          </Button>
        </div>
      </div>
    </header>
  );
}

