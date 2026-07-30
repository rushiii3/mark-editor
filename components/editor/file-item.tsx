"use client";

import { memo, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { MarkdownFile } from "@/store/file-store";
import { LazyMotion, domAnimation, m } from "framer-motion";

type FileItemProps = {
  file: MarkdownFile;
  active: boolean;

  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
};

export const FileItem = memo(function FileItem({
  file,
  active,
  onSelect,
  onDelete,
  onRename
}: FileItemProps) {
  const [editing, setEditing] = useState(false);

  function getBaseName(name: string) {
    const trimmed = name.trim();

    if (!trimmed) {
      return "Untitled";
    }

    const index = trimmed.lastIndexOf(".");
    return index === -1 ? trimmed : trimmed.slice(0, index);
  }

  function getExtension(name: string) {
    const index = name.lastIndexOf(".");
    return index === -1 ? "" : name.slice(index);
  }

  const [name, setName] = useState(getBaseName(file.name));

  useEffect(() => {
    setName(getBaseName(file.name));
  }, [file.name]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        layout
        initial={{
          opacity: 0,
          x: -12,
          scale: 0.98
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1
        }}
        exit={{
          opacity: 0,
          x: 12,
          scale: 0.98
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut"
        }}
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
              value={name}
              className="w-full border-none bg-transparent text-sm outline-none"
              onFocus={(e) => e.target.select()}
              onBlur={() => {
                const finalName = name.trim() || "Untitled";

                onRename(file.id, finalName + getExtension(file.name));
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const finalName = name.trim() || "Untitled";

                  onRename(file.id, finalName + getExtension(file.name));
                  setEditing(false);
                }

                if (e.key === "Escape") {
                  setName(getBaseName(file.name));
                  setEditing(false);
                }
              }}
              onChange={(e) => setName(e.target.value)}
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
      </m.div>
    </LazyMotion>
  );
});
