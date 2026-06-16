import { AppDB, getDB } from "./database";
import type { MarkdownFile } from "@/store/file-store";

export async function getDocuments() {
  const db = await getDB();

  return db.getAllFromIndex("documents", "by-createdAt");
}

export async function saveDocument(document: AppDB["documents"]["value"]) {
  const db = await getDB();

  await db.put("documents", document);
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
