/// <reference lib="webworker" />

import { getDocuments } from "@/db/documents";
import { getAllImages } from "@/db/image";

export type UnusedImage = {
  id: string;
  name: string;
  size: number;
  createdAt: number;
};

const IMAGE_REGEX = /local-image:([a-f0-9-]+)/gi;

function collectReferencedImages(content: string): Set<string> {
  const ids = new Set<string>();

  let match: RegExpExecArray | null;

  while ((match = IMAGE_REGEX.exec(content)) !== null) {
    ids.add(match[1]);
  }

  return ids;
}

self.onmessage = async (event: MessageEvent<{ type: "scan" }>) => {
  if (event.data.type !== "scan") return;

  try {
    const documents = await getDocuments();
    const images = await getAllImages();

    const referenced = new Set<string>();

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];

      const ids = collectReferencedImages(doc.content);

      ids.forEach((id) => referenced.add(id));

      self.postMessage({
        type: "progress",
        processed: i + 1,
        total: documents.length
      });
    }

    const unused: UnusedImage[] = images
      .filter((image) => !referenced.has(image.id))
      .map((image) => ({
        id: image.id,
        name: image.name,
        size: image.size,
        createdAt: image.createdAt
      }));

    self.postMessage({
      type: "complete",
      unused
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
