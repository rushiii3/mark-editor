import { create } from "zustand";
import {
  getAllImages,
  saveImageBlob,
  deleteImage,
  type StoredImage,
  clearImages
} from "@/db/image";

type GalleryImage = StoredImage & {
  objectUrl: string;
};

type ImageStore = {
  images: GalleryImage[];
  isLoading: boolean;

  loadImages: () => Promise<void>;

  addImage: (blob: Blob, name: string) => Promise<string>;

  removeImage: (id: string) => Promise<void>;

  clearImage: () => void;
};

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  isLoading: false,

  async loadImages() {
    set({ isLoading: true });

    const images = await getAllImages();

    const galleryImages = images.map((image) => ({
      ...image,
      objectUrl: URL.createObjectURL(image.blob)
    }));

    set({
      images: galleryImages,
      isLoading: false
    });
  },

  async addImage(blob, name) {
    const id = await saveImageBlob(blob, name);

    await get().loadImages();

    return id;
  },

  async removeImage(id) {
    const image = get().images.find((img) => img.id === id);

    if (image) {
      URL.revokeObjectURL(image.objectUrl);
    }

    await deleteImage(id);

    set({
      images: get().images.filter((img) => img.id !== id)
    });
  },

  async clearImage() {
    await clearImages();
    set({
      images: []
    });
  }
}));
