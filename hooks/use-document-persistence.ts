import { useEffect, useState } from "react";
import { useFileStore } from "@/store/file-store";
import { getDocument, saveDocument } from "@/db/documents";

export function useDocumentPersistence(initialContent: string) {
  const [markdown, setMarkdown] = useState(initialContent);
  const activeFileId = useFileStore((s) => s.activeFileId);

  useEffect(() => {
    if (!activeFileId) return;

    let isMounted = true;
    const loadDocument = async () => {
      try {
        const document = await getDocument(activeFileId);
        if (isMounted) {
          setMarkdown(document?.content ?? "");
        }
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    void loadDocument();
    return () => {
      isMounted = false;
    };
  }, [activeFileId]);

  useEffect(() => {
    if (!activeFileId) return;

    const timeout = setTimeout(async () => {
      try {
        const existing = await getDocument(activeFileId);
        await saveDocument({
          id: activeFileId,
          name: existing?.name ?? "Untitled",
          content: markdown,
          createdAt: existing?.createdAt ?? Date.now(),
          updatedAt: Date.now(),
        });
      } catch (error) {
        console.error("Failed to auto-save document:", error);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [markdown, activeFileId]);

  return {
    markdown,
    setMarkdown,
  };
}
