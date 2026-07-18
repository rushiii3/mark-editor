import { useImageStore } from "@/store/imageStore";
import { imageToWebpBlob } from "./image-compression";
export const LOCAL_IMAGE_PREFIX = "local-image:";

export async function uploadLocalImage(
  file: File
): Promise<{ url: string; alt: string }> {
  // Access store outside of React components via getState to avoid React Hooks rules
  console.log("Uploading local image:", file.name);
  const addImage = useImageStore.getState().addImage;
  const filename = file.name.replace(/\.[^.]+$/, "");
  const blob = await imageToWebpBlob(file, 0.75, 1600);

  const id = await addImage(blob, filename);

  const url = `${LOCAL_IMAGE_PREFIX}${id}`;
  console.log(`Image uploaded: ${url} with alt text: ${filename}`);

  return { url, alt: filename };
}
