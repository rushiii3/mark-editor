import { useEffect, useState } from "react";
import { useFileStore } from "@/store/file-store";
import { getDocument } from "@/db/documents";

export function useDocumentPersistence() {
  // const [markdown, setMarkdown] = useState(initialContent);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const loading = useFileStore((s) => s.loading);
  const setSaveStatus = useFileStore((s) => s.setSaveStatus);
  const updateContent = useFileStore((s) => s.updateContent);
  const activeFile = useFileStore((state) =>
    state.files.find((f) => f.id === state.activeFileId)
  );
  const [markdown, setMarkdown] = useState(activeFile?.content ?? "");

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
    console.log("Markdown changed:", loading, activeFileId, markdown);
    if (!activeFileId || loading) return;
    setSaveStatus("saving");
    const timeout = setTimeout(() => {
      void updateContent(activeFileId, markdown);
    }, 500);

    return () => clearTimeout(timeout);
  }, [markdown, activeFileId, updateContent, setSaveStatus, loading]);

  return {
    markdown,
    setMarkdown
  };
}
