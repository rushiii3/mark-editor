import { getDB } from "./database";

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const setting = await db.get("settings", key);
  return setting?.value as T | undefined;
}

export async function setSetting<T>(key: string, value: T) {
  const db = await getDB();
  await db.put("settings", {
    key,
    value,
    updatedAt: Date.now()
  });
}
