import { getDB } from "./database";

export type StoredImage = {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
  size: number;
  type: string;
};

export async function saveImageBlob(blob: Blob, name: string): Promise<string> {
  const id = crypto.randomUUID();

  const image: StoredImage = {
    id,
    name,
    blob,
    createdAt: Date.now(),
    size: blob.size,
    type: blob.type
  };

  const db = await getDB();

  await db.put("images", image);

  return id;
}

export async function getImage(id: string): Promise<StoredImage | undefined> {
  const db = await getDB();

  return db.get("images", id);
}

export async function getImageBlob(id: string): Promise<Blob | undefined> {
  const image = await getImage(id);

  return image?.blob;
}

export async function getAllImages(): Promise<StoredImage[]> {
  const db = await getDB();

  const images = await db.getAll("images");

  return images.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();

  await db.delete("images", id);
}

export async function clearImages(): Promise<void> {
  const db = await getDB();

  await db.clear("images");
}

export function createImageUrl(image: StoredImage): string {
  return URL.createObjectURL(image.blob);
}
