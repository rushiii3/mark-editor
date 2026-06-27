import { getImageBlob } from "@/db/image";

const cache = new Map<string, string>();

export async function resolveLocalImages(html: string) {
  const parser = new DOMParser();

  const document = parser.parseFromString(html, "text/html");

  const images = document.querySelectorAll("img");

  await Promise.all(
    Array.from(images).map(async (img) => {
      const src = img.getAttribute("src");

      if (!src || !src.startsWith("local-image:")) {
        return;
      }

      const id = src.replace("local-image:", "");

      let url = cache.get(id);

      if (!url) {
        const blob = await getImageBlob(id);

        if (!blob) {
          return;
        }

        url = URL.createObjectURL(blob);

        cache.set(id, url);
      }

      img.setAttribute("src", url);
    })
  );
  return document.body.innerHTML;
}
