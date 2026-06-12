"use client";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, File01Icon, Plus } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

export function Sidebar() {
  const [files, setFiles] = useState([
    { id: 1, name: "Untitled.md" },
    { id: 2, name: "Notes.md" }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function getBaseName(name: string) {
    const lastDot = name.lastIndexOf(".");
    return lastDot === -1 ? name : name.slice(0, lastDot);
  }

  function getExtension(name: string) {
    const lastDot = name.lastIndexOf(".");
    return lastDot === -1 ? "" : name.slice(lastDot);
  }
  const addFile = () => {
    setFiles((current) => [
      { id: Date.now(), name: "Untitled.md" },
      ...current
    ]);
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
    <aside className="editor-sidebar border-border/80 bg-card/80 flex w-full shrink-0 flex-col border-b backdrop-blur h-full md:border-r md:border-b-0">
      <div className="border-border/70 flex items-center justify-between border-b px-5 py-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            File Explorer
          </p>
        </div>
        <Button size="icon-lg" onClick={addFile}>
          <HugeiconsIcon icon={Plus} size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1 rounded-md border px-2 py-1.5 whitespace-nowrap">
        <div className="flex flex-col h-max gap-2">
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
                          : currentFile
                      )
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
                  className="invisible cursor-pointer text-primary group-hover:visible ml-auto"
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </aside>
  );
}
