import { getDB } from "./database";

export type StoredFont = {
  id: string;
  family: string;
  weight: string;
  style: string;
  blob: Blob;
  createdAt: number;
};

export async function saveFont(
  family: string,
  weight: string,
  style: string,
  blob: Blob
): Promise<string> {
  const cleanFamily = family.trim();
  const id = `${cleanFamily}-${weight}-${style}`.toLowerCase().replace(/\s+/g, "-");

  const font: StoredFont = {
    id,
    family: cleanFamily,
    weight,
    style,
    blob,
    createdAt: Date.now()
  };

  const db = await getDB();
  await db.put("fonts", font);
  return id;
}

export async function getFont(id: string): Promise<StoredFont | undefined> {
  const db = await getDB();
  return db.get("fonts", id);
}

export async function getFontsByFamily(family: string): Promise<StoredFont[]> {
  const db = await getDB();
  const fonts = await db.getAllFromIndex("fonts", "by-family", family);
  return fonts;
}

export async function getAllFonts(): Promise<StoredFont[]> {
  const db = await getDB();
  const fonts = await db.getAll("fonts");
  return fonts.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteFont(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("fonts", id);
}

export async function deleteFontsByFamily(family: string): Promise<void> {
  const db = await getDB();
  const fonts = await getFontsByFamily(family);
  await Promise.all(fonts.map((f) => db.delete("fonts", f.id)));
}
