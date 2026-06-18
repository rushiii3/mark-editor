"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus } from "@hugeicons/core-free-icons";

import { FileItem } from "./file-item";
import { useFileStore } from "@/store/file-store";
import { useEffect, memo } from "react";

export const Sidebar = memo(function Sidebar() {
  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);

  const loadFiles = useFileStore((state) => state.loadFiles);
  const createFile = useFileStore((s) => s.createFile);
  const deleteFile = useFileStore((s) => s.deleteFile);
  const renameFile = useFileStore((s) => s.renameFile);
  const setActiveFile = useFileStore((s) => s.setActiveFile);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          File Explorer
        </p>

        <Button size="icon-lg" onClick={createFile}>
          <HugeiconsIcon icon={Plus} size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              active={file.id === activeFileId}
              onSelect={setActiveFile}
              onDelete={deleteFile}
              onRename={renameFile}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
});
