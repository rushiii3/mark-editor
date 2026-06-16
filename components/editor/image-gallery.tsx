"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useImageStore } from "@/store/imageStore";

type ImageGalleryProps = {
  onInsert: (url: string, alt: string) => void;
};

export function ImageGallery({ onInsert }: ImageGalleryProps) {
  const images = useImageStore((state) => state.images);
  const loadImages = useImageStore((state) => state.loadImages);
  const removeImage = useImageStore((state) => state.removeImage);

  useEffect(() => {
    loadImages();
  }, []);

  async function handleDelete(id: string) {
    await removeImage(id);
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image) => (
        <div key={image.id} className="overflow-hidden rounded-lg border">
          <div className="relative aspect-square w-full">
            <Image
              src={image.objectUrl}
              alt={image.name}
              className="object-contain"
              fill
            />
          </div>

          <div className="space-y-2 p-2">
            <p className="truncate text-xs">{image.name}</p>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  onInsert(`local-image:${image.id}`, `${image.name}`)
                }
              >
                Insert
              </Button>

              <Button
                onClick={() => handleDelete(image.id)}
                variant={"destructive"}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {images.length === 0 && (
        <div className="col-span-full py-10 text-center text-muted-foreground">
          No images uploaded
        </div>
      )}
    </div>
  );
}
