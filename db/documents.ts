import { AppDB, getDB } from "./database";
import type { MarkdownFile } from "@/store/file-store";
import { mapStorageError } from "./errors/mapStorageError";

export async function getDocuments() {
  const db = await getDB();
  const documents = await db.getAllFromIndex("documents", "by-createdAt");

  return documents.reverse();
}

export async function saveDocument(
  document: AppDB["documents"]["value"]
): Promise<void> {
  try {
    const db = await getDB();
    await db.put("documents", document);
  } catch (error) {
    throw mapStorageError(error);
  }
}

export async function deleteDocument(id: string) {
  const db = await getDB();
  await db.delete("documents", id);
}

export async function saveDocuments(files: MarkdownFile[]) {
  const db = await getDB();

  const tx = db.transaction("documents", "readwrite");

  await tx.store.clear();

  for (const file of files) {
    await tx.store.put(file);
  }

  await tx.done;
}

export async function getDocument(id: string) {
  const db = await getDB();

  return db.get("documents", id);
}

export async function updateDocument(
  id: string,
  updates: Partial<AppDB["documents"]["value"]>
): Promise<void> {
  try {
    const db = await getDB();

    const existing = await db.get("documents", id);

    if (!existing) {
      throw new Error(`Document with id "${id}" not found.`);
    }

    await db.put("documents", {
      ...existing,
      ...updates
    });
  } catch (error) {
    throw mapStorageError(error);
  }
}
