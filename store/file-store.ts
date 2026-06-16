import { deleteDocument, getDocuments, saveDocument } from "@/db/documents";
import { create } from "zustand";

export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface FileStore {
  files: MarkdownFile[];
  activeFileId: string | null;

  createFile(): void;

  deleteFile(id: string): void;

  renameFile(id: string, name: string): void;

  updateContent(id: string, content: string): void;

  setActiveFile(id: string): void;

  loadFiles(): void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  activeFileId: null,

  loadFiles: async () => {
    const files = await getDocuments();

    set({
      files,
      activeFileId: files[0]?.id ?? null
    });
  },

  createFile: async () => {
    const file: MarkdownFile = {
      id: crypto.randomUUID(),
      name: "Untitled.md",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await saveDocument(file);
    set((state) => ({
      files: [file, ...state.files],
      activeFileId: file.id
    }));
  },

  deleteFile: async (id) => {
    await deleteDocument(id);

    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      activeFileId:
        state.activeFileId === id
          ? (state.files.find((f) => f.id !== id)?.id ?? null)
          : state.activeFileId
    }));
  },

  renameFile: async (id, name) => {
    set((state) => {
      const files = state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              name,
              updatedAt: Date.now()
            }
          : file
      );

      saveDocument(files.find((f) => f.id === id)!);

      return { files };
    });
  },

  updateContent: async (id, content) => {
    set((state) => {
      const files = state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              content,
              updatedAt: Date.now()
            }
          : file
      );

      saveDocument(files.find((f) => f.id === id)!);

      return { files };
    });
  },

  setActiveFile(id) {
    set({ activeFileId: id });
  }
}));
