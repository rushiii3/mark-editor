import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export const DB_NAME = "markdown-editor";
export const DB_VERSION = 2;

export interface AppDB extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      name: string;
      blob: Blob;
      createdAt: number;
      size: number;
      type: string;
    };
    indexes: {
      "by-createdAt": number;
      "by-name": string;
    };
  };

  documents: {
    key: string;
    value: {
      id: string;
      name: string;
      content: string;
      createdAt: number;
      updatedAt: number;
    };
    indexes: {
      "by-createdAt": number;
      "by-updatedAt": number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

export function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is unavailable on the server.");
  }

  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", {
            keyPath: "id"
          });

          store.createIndex("by-createdAt", "createdAt");
          store.createIndex("by-name", "name");
        }

        if (!db.objectStoreNames.contains("documents")) {
          const store = db.createObjectStore("documents", {
            keyPath: "id"
          });

          store.createIndex("by-createdAt", "createdAt");
          store.createIndex("by-updatedAt", "updatedAt");
        }
      }
    });
  }

  return dbPromise;
}
