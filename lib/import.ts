import { getDocument, saveDocument } from "@/db/documents";
import { getImage, saveImageBlob } from "@/db/image";
import JSZip from "jszip";
export interface Metadata {
  format: "mdpack";
  version: number;

  project: {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
  };

  editor: {
    name: string;
    version: string;
  };
}

export interface Settings {
  theme: string;
  page: {
    size: string;
    margin: number;
  };
}
export interface ImportedMarkdown {
  type: "markdown";
  markdown: string;
  name: string;
}

interface ImageManifest {
  id: string;
  file: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: number;
}

interface Manifest {
  images: ImageManifest[];
}

async function importMarkdown(file: File): Promise<ImportedMarkdown> {
  const markdown = await file.text();
  await saveDocument({
    id: crypto.randomUUID(),
    name: file.name,
    content: markdown,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  return {
    type: "markdown",
    name: file.name,
    markdown: await file.text()
  };
}

export interface ImportedProject {
  type: "mdpack";
  metadata: Metadata;
  settings: Settings;
  markdown: string;
  images: ImportedImage[];
}

export type ImportResult = ImportedMarkdown | ImportedProject;

export async function importProject(
  file: File,
  task: {
    runStep<T>(step: number, fn: () => Promise<T> | T): Promise<T>;
  }
): Promise<ImportResult> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith(".md")) {
    return task.runStep(0, () => importMarkdown(file));
  }

  if (lower.endsWith(".mdpack")) {
    return importMdpack(file, task);
  }

  throw new Error("Unsupported file format.");
}

export interface MdpackData {
  metadata: Metadata;
  settings: Settings;
  manifest: Manifest;
  markdown: string;
}

export interface ImportedImage {
  path: string;
  filename: string;
  blob: Blob;
}

const REQUIRED_FILES = ["metadata.json", "settings.json"] as const;

async function importMdpack(
  file: File,
  {
    runStep
  }: {
    runStep<T>(step: number, fn: () => Promise<T> | T): Promise<T>;
  }
): Promise<ImportedProject> {
  const zip = await runStep(0, () => JSZip.loadAsync(file));

  await runStep(1, () => {
    validateStructure(zip);
  });

  const data = await runStep(2, () => readData(zip));

  const images = await runStep(3, () => extractImages(zip));

  const imageMap = await runStep(4, () => saveImages(images, data.manifest));

  const markdown = await runStep(5, () =>
    Promise.resolve(rewriteMarkdownImages(data.markdown, imageMap))
  );

  await runStep(6, () => saveMarkdownFile(markdown, data.metadata.project));

  return {
    type: "mdpack",
    ...data,
    markdown,
    images
  };
}

async function saveImages(
  images: ImportedImage[],
  manifest: Manifest
): Promise<Map<string, string>> {
  console.log("Images : ", images);
  console.log("Manifest : ", manifest);
  const imageMap = new Map<string, string>();
  for (const image of images) {
    const manifestEntry = manifest.images.find(
      (entry) => entry.file === image.path
    );
    if (!manifestEntry) continue;

    const existingImage = await getImage(manifestEntry.id);

    if (!existingImage) {
      const id = await saveImageBlob(image.blob, image.filename);
      imageMap.set(image.filename, id);
    } else {
      const extension =
        existingImage.type.split("/")[1] ||
        existingImage.id.split(".").pop() ||
        "webp";

      const file = `images/${existingImage.id}.${extension}`;
      imageMap.set(existingImage.id, file);
    }
  }
  return imageMap;
}

function validateStructure(zip: JSZip) {
  // Validate required JSON files
  for (const file of REQUIRED_FILES) {
    if (!zip.file(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }

  // Find any markdown file
  const markdownFiles = Object.values(zip.files).filter(
    (file) => !file.dir && file.name.toLowerCase().endsWith(".md")
  );

  if (markdownFiles.length === 0) {
    throw new Error("Missing markdown (.md) file.");
  }

  if (markdownFiles.length > 1) {
    throw new Error(
      "Archive contains multiple markdown files. Expected only one."
    );
  }
}

async function readData(zip: JSZip): Promise<MdpackData> {
  const metadata: Metadata = JSON.parse(
    await zip.file("metadata.json")!.async("text")
  );

  const settings = JSON.parse(await zip.file("settings.json")!.async("text"));

  const markdownFile = Object.values(zip.files).find(
    (file) => !file.dir && file.name.toLowerCase().endsWith(".md")
  );

  if (!markdownFile) {
    throw new Error("Markdown file not found.");
  }

  const markdown = await markdownFile.async("text");

  const manifest = JSON.parse(await zip.file("manifest.json")!.async("text"));

  return {
    metadata,
    settings,
    manifest,
    markdown
  };
}

async function extractImages(zip: JSZip): Promise<ImportedImage[]> {
  const images: ImportedImage[] = [];
  for (const file of Object.values(zip.files)) {
    if (file.dir) continue;

    if (!file.name.startsWith("images/")) continue;

    images.push({
      path: file.name,
      filename: file.name.split("/").pop()!,
      blob: await file.async("blob")
    });
  }
  return images;
}

export function rewriteMarkdownImages(
  markdown: string,
  imageMap: Map<string, string>
) {
  return markdown.replace(
    /!\[([^\]]*)\]\(images\/([^)]+)\)/g,
    (_, alt: string, filename: string) => {
      const id = imageMap.get(filename);

      if (!id) {
        return `![${alt}](images/${filename})`;
      }

      return `![${alt}](local-image:${id})`;
    }
  );
}

async function saveMarkdownFile(
  markdown: string,
  project: Metadata["project"]
): Promise<void> {
  const existing = await getDocument(project.id);
  if (!existing) {
    await saveDocument({
      id: project.id,
      name: project.name,
      content: markdown,
      createdAt: project.createdAt,
      updatedAt: Date.now()
    });
    return;
  } else {
    await saveDocument({
      id: project.id,
      name: existing.name,
      content: markdown,
      createdAt: existing.createdAt,
      updatedAt: Date.now()
    });
  }
}
