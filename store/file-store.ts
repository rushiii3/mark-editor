import { deleteDocument, getDocuments, saveDocument } from "@/db/documents";
import { SaveStatus } from "@/types";
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
  saveStatus: SaveStatus;
  loading: boolean;
  setSaveStatus(status: SaveStatus): void;
  createFile(): void;

  deleteFile(id: string): void;

  renameFile(id: string, name: string): void;

  updateContent(id: string, content: string): void;

  setActiveFile(id: string): void;

  loadFiles(): void;

  // loadFileById(id: string): void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  activeFileId: null,
  saveStatus: "idle",
  loading: false,

  loadFiles: async () => {
    set({ loading: true });
    const files = await getDocuments();

    set({
      files,
      activeFileId: files[0]?.id ?? null,
      loading: false
    });
  },

  // loadFileById: async (id: string) => {
  //   set({ loading: true });
  //   const file = await getDocument(id);

  //   if (file) {
  //     set({
  //       files: [
  //         file,
  //         ...useFileStore.getState().files.filter((f) => f.id !== id)
  //       ],
  //       activeFileId: id,
  //       loading: false
  //     });
  //   } else {
  //     set({ loading: false });
  //   }
  // },

  createFile: async () => {
    const file: MarkdownFile = {
      id: crypto.randomUUID(),
      name: "Untitled.md",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      await saveDocument(file);
      set((state) => ({
        files: [file, ...state.files],
        activeFileId: file.id,
        saveStatus: "idle"
      }));
    } catch (error) {
      console.error("Error saving document:", error);
      set({ saveStatus: "save_failed" });
      return;
    }
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
    let updatedFile: MarkdownFile | undefined;

    set((state) => {
      const files = state.files.map((file) => {
        if (file.id !== id) return file;

        updatedFile = {
          ...file,
          content,
          updatedAt: Date.now()
        };

        return updatedFile;
      });

      return {
        files,
        saveStatus: "saving",
        saveError: undefined
      };
    });

    if (!updatedFile) return;

    try {
      // throw new DOMException("Storage quota exceeded", "QuotaExceededError");
      await saveDocument(updatedFile);

      set({
        saveStatus: "saved"
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        set({
          saveStatus: "storage_full"
        });
      } else {
        set({
          saveStatus: "save_failed"
        });
      }
    }
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
  setActiveFile(id) {
    set({ activeFileId: id, saveStatus: "idle" });
  }
}));
