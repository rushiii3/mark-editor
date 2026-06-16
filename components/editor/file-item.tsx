"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { MarkdownFile } from "@/store/file-store";

type FileItemProps = {
  file: MarkdownFile;
  active: boolean;

  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
};

export function FileItem({
  file,
  active,
  onSelect,
  onDelete,
  onRename
}: FileItemProps) {
  const [editing, setEditing] = useState(false);

  function getBaseName(name: string) {
    const index = name.lastIndexOf(".");
    return index === -1 ? name : name.slice(0, index);
  }

  function getExtension(name: string) {
    const index = name.lastIndexOf(".");
    return index === -1 ? "" : name.slice(index);
  }

  return (
    <div
      onClick={() => onSelect(file.id)}
      onDoubleClick={() => setEditing(true)}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 transition-colors",
        active && "bg-primary text-primary-foreground"
      )}
    >
      <HugeiconsIcon icon={File01Icon} size={16} />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={getBaseName(file.name)}
            className="w-full border-none bg-transparent text-sm outline-none"
            onFocus={(e) => e.target.select()}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                setEditing(false);
              }
            }}
            onChange={(e) =>
              onRename(file.id, e.target.value + getExtension(file.name))
            }
          />
        ) : (
          <span className="block truncate text-sm">{file.name}</span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.id);
        }}
        className={cn(
          "ml-auto opacity-0 transition-opacity",
          "group-hover:opacity-100",
          active && "opacity-100"
        )}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
    </div>
  );
}
