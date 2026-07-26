import { useImageStore } from "@/store/imageStore";
import { imageToWebpBlob } from "./image-compression";
export const LOCAL_IMAGE_PREFIX = "local-image:";

export async function uploadLocalImage(
  file: File
): Promise<{ url: string; alt: string }> {
  try {
    const addImage = useImageStore.getState().addImage;
    const filename = file.name.replace(/\.[^.]+$/, "");
    const blob = await imageToWebpBlob(file, 0.75, 1600);
    const id = await addImage(blob, filename);
    const url = `${LOCAL_IMAGE_PREFIX}${id}`;
    return { url, alt: filename };
  } catch (error) {
    throw error;
  }
}
