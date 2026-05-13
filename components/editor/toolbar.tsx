"use client";

import { useState, type ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  Cancel01Icon,
  CheckListIcon,
  ChevronDown,
  CodeIcon,
  File01Icon,
  FileCode,
  FileExportIcon,
  FullscreenIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  HelpCircleFreeIcons,
  IdeaIcon,
  ImageUploadFreeIcons,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  LeftToRightListTriangleIcon,
  Link01FreeIcons,
  Plus,
  Quote,
  Settings05Icon,
  SolidLine01Icon,
  Sun01Icon,
  TableIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";

import type { EditorViewMode, ToolbarAction } from "@/components/editor/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ToolbarProps = {
  onAction: (action: ToolbarAction) => void;
  onToggleTheme: () => void;
  onViewModeChange: (mode: EditorViewMode) => void;
  viewMode: EditorViewMode;
};

type IconAction = {
  action: ToolbarAction;
  icon: IconSvgElement;
  label: string;
};

const HISTORY_ACTIONS: IconAction[] = [
  { action: "undo", icon: ArrowTurnBackwardIcon, label: "Undo" },
  { action: "redo", icon: ArrowTurnForwardIcon, label: "Redo" },
];

const FORMATTING_ACTIONS: IconAction[] = [
  { action: "bold", icon: TextBoldIcon, label: "Bold" },
  { action: "italic", icon: TextItalicIcon, label: "Italic" },
  { action: "underline", icon: TextUnderlineIcon, label: "Underline" },
  { action: "strikethrough", icon: TextStrikethroughIcon, label: "Strikethrough" },
  { action: "hr", icon: SolidLine01Icon, label: "Horizontal Rule" },
];

const CODE_ACTIONS: IconAction[] = [
  { action: "code", icon: CodeIcon, label: "Inline Code" },
  { action: "code-block", icon: FileCode, label: "Code Block" },
];

const INSERT_ACTIONS: IconAction[] = [
  { action: "link", icon: Link01FreeIcons, label: "Link" },
  { action: "table", icon: TableIcon, label: "Table" },
  { action: "image", icon: ImageUploadFreeIcons, label: "Image" },
];

const LIST_ACTIONS: IconAction[] = [
  { action: "toggle", icon: LeftToRightListTriangleIcon, label: "Toggle" },
  { action: "checkbox", icon: CheckListIcon, label: "Task List" },
  { action: "unordered-list", icon: LeftToRightListBulletIcon, label: "Bulleted List" },
  { action: "ordered-list", icon: LeftToRightListNumberIcon, label: "Ordered List" },
];

const HEADINGS: IconAction[] = [
  { action: "h1", icon: Heading1, label: "Heading 1" },
  { action: "h2", icon: Heading2, label: "Heading 2" },
  { action: "h3", icon: Heading3, label: "Heading 3" },
  { action: "h4", icon: Heading4, label: "Heading 4" },
  { action: "h5", icon: Heading5, label: "Heading 5" },
  { action: "h6", icon: Heading6, label: "Heading 6" },
];

const CALLOUTS: Array<{ action: ToolbarAction; label: string }> = [
  { action: "note", label: "Note" },
  { action: "tip", label: "Tip" },
  { action: "important", label: "Important" },
  { action: "warning", label: "Warning" },
  { action: "caution", label: "Caution" },
  { action: "info", label: "Info" },
  { action: "success", label: "Success" },
  { action: "error", label: "Error" },
];

function IconButton({
  action,
  onAction,
}: {
  action: IconAction;
  onAction: (action: ToolbarAction) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="h-8 rounded-md px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => onAction(action.action)}
        >
          <HugeiconsIcon icon={action.icon} size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{action.label}</TooltipContent>
    </Tooltip>
  );
}

function ToolTipWrapper({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
  );
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
    return;
  }

  void document.exitFullscreen();
}

function getBaseName(name: string) {
  const lastDot = name.lastIndexOf(".");
  return lastDot === -1 ? name : name.slice(0, lastDot);
}

function getExtension(name: string) {
  const lastDot = name.lastIndexOf(".");
  return lastDot === -1 ? "" : name.slice(lastDot);
}

export function Toolbar({
  onAction,
  onToggleTheme,
  onViewModeChange,
  viewMode,
}: ToolbarProps) {
  const [files, setFiles] = useState([
    { id: 1, name: "Untitled.md" },
    { id: 2, name: "Notes.md" },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const topMode =
    viewMode === "write"
      ? "write"
      : viewMode === "pdf"
        ? "pdf"
        : viewMode === "preview"
          ? "preview"
          : "split";

  const addFile = () => {
    setFiles((current) => [{ id: Date.now(), name: "Untitled.md" }, ...current]);
    setActiveIndex(0);
    setEditingIndex(null);
  };

  const handleClose = (index: number) => {
    setFiles((current) => {
      const updated = current.filter((_, itemIndex) => itemIndex !== index);

      if (index === activeIndex) {
        setActiveIndex(updated.length === 0 ? 0 : Math.max(0, index - 1));
      } else if (index < activeIndex) {
        setActiveIndex((currentActive) => Math.max(0, currentActive - 1));
      }

      return updated;
    });
  };

  return (
    <header className="border-b bg-background">
      <div className="flex min-h-15 items-center gap-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            M
          </div>
          <div className="text-[2rem] font-semibold tracking-tight text-foreground">
            Markups
          </div>
        </div>

        <Button size="icon-lg" onClick={addFile}>
          <HugeiconsIcon icon={Plus} size={16} />
        </Button>

        <ScrollArea className="w-[500px] rounded-md border bg-muted/40 px-2 py-1.5 whitespace-nowrap">
          <div className="flex w-max gap-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`group flex items-center gap-2 rounded-md border border-border px-2 py-1 ${
                  activeIndex === index ? "bg-primary text-white" : ""
                }`}
                onClick={() => setActiveIndex(index)}
                onDoubleClick={() => setEditingIndex(index)}
              >
                <HugeiconsIcon icon={File01Icon} size={16} />
                {editingIndex === index ? (
                  <input
                    autoFocus
                    className="border-b border-primary bg-transparent text-sm outline-none"
                    onBlur={() => setEditingIndex(null)}
                    onChange={(event) => {
                      const nextBase = event.target.value;
                      const ext = getExtension(file.name);

                      setFiles((current) =>
                        current.map((currentFile, fileIndex) =>
                          fileIndex === index
                            ? { ...currentFile, name: nextBase + ext }
                            : currentFile,
                        ),
                      );
                    }}
                    onFocus={(event) => event.target.select()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === "Escape") {
                        setEditingIndex(null);
                      }
                    }}
                    value={getBaseName(file.name)}
                  />
                ) : (
                  <span className="text-sm">{file.name}</span>
                )}

                {activeIndex !== index ? (
                  <HugeiconsIcon
                    className="invisible cursor-pointer text-primary group-hover:visible"
                    icon={Cancel01Icon}
                    size={16}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClose(index);
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ToggleGroup
          type="single"
          value={topMode}
          onValueChange={(value) => {
            if (
              value === "write" ||
              value === "split" ||
              value === "preview" ||
              value === "pdf"
            ) {
              onViewModeChange(value);
            }
          }}
          variant="outline"
          size="lg"
          className="p-1"
        >
          <ToggleGroupItem value="write" size="lg">
            Write
          </ToggleGroupItem>
          <ToggleGroupItem value="split" size="lg">
            Split
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" size="lg">
            Preview
          </ToggleGroupItem>
          <ToggleGroupItem value="pdf" size="lg">
            PDF
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="lg">
            <HugeiconsIcon icon={HelpCircleFreeIcons} size={16} />
            Help
          </Button>
          <Button variant="ghost" size="lg" onClick={onToggleTheme}>
            <HugeiconsIcon icon={Sun01Icon} size={16} data-icon="inline-start" />
            Theme
          </Button>
          <Button variant="ghost" size="lg">
            <HugeiconsIcon icon={Settings05Icon} size={16} data-icon="inline-start" />
            Settings
          </Button>
          <Button variant="outline" size="lg" onClick={toggleFullScreen}>
            <HugeiconsIcon icon={FullscreenIcon} size={16} data-icon="inline-start" />
            Fullscreen
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex min-h-14 items-center justify-between overflow-x-auto px-4">
        <div className="flex min-w-max items-center rounded-md border border-border/80 bg-background px-2 py-1 shadow-sm">
          {HISTORY_ACTIONS.map((action) => (
            <IconButton key={action.label} action={action} onAction={onAction} />
          ))}
          <Separator orientation="vertical" className="mx-1.5 h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-light">
                Heading <HugeiconsIcon icon={ChevronDown} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Headings</DropdownMenuLabel>
                {HEADINGS.map((heading) => (
                  <DropdownMenuItem
                    key={heading.label}
                    className="text-sm"
                    onClick={() => onAction(heading.action)}
                  >
                    <HugeiconsIcon icon={heading.icon} size={16} />
                    {heading.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-1.5 h-6" />
          {FORMATTING_ACTIONS.map((action) => (
            <IconButton key={action.label} action={action} onAction={onAction} />
          ))}

          <Separator orientation="vertical" className="mx-1.5 h-6" />
          {CODE_ACTIONS.map((action) => (
            <IconButton key={action.label} action={action} onAction={onAction} />
          ))}

          <Separator orientation="vertical" className="mx-1.5 h-6" />
          {INSERT_ACTIONS.map((action) => (
            <IconButton key={action.label} action={action} onAction={onAction} />
          ))}

          <Separator orientation="vertical" className="mx-1.5 h-6" />
          {LIST_ACTIONS.map((action) => (
            <IconButton key={action.label} action={action} onAction={onAction} />
          ))}

          <Separator orientation="vertical" className="mx-1.5 h-6" />
          <IconButton
            action={{ action: "quote", icon: Quote, label: "Block Quote" }}
            onAction={onAction}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-md px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={IdeaIcon} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Callouts</DropdownMenuLabel>
                {CALLOUTS.map((callout) => (
                  <DropdownMenuItem
                    key={callout.label}
                    onClick={() => onAction(callout.action)}
                  >
                    {callout.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex min-w-max items-center gap-2 px-2 py-1">
          <ToolTipWrapper label="Export PDF">
            <Button type="button" size="lg" onClick={() => onAction("export-pdf")}>
              <HugeiconsIcon icon={FileExportIcon} size={16} />
              Export
            </Button>
          </ToolTipWrapper>
        </div>
      </div>
    </header>
  );
}
