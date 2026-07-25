"use client";

import { useEffect, useState } from "react";
import { useImageCleanupWorker } from "@/hooks/use-image-cleaner";

type UnusedImage = {
  id: string;
  name: string;
  size: number;
  createdAt: number;
};

export default function Page() {
  const { worker, scan } = useImageCleanupWorker();

  const [progress, setProgress] = useState({
    processed: 0,
    total: 0
  });

  const [unusedImages, setUnusedImages] = useState<UnusedImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!worker.current) return;

    const handleMessage = (e: MessageEvent) => {
      switch (e.data.type) {
        case "progress":
          setProgress({
            processed: e.data.processed,
            total: e.data.total
          });
          break;

        case "complete":
          setUnusedImages(e.data.unused);
          setLoading(false);
          break;

        case "error":
          console.error(e.data.error);
          setLoading(false);
          break;
      }
    };

    worker.current.addEventListener("message", handleMessage);

    return () => {
      worker.current?.removeEventListener("message", handleMessage);
    };
  }, [worker]);

  const handleScan = () => {
    setLoading(true);
    setUnusedImages([]);
    scan();
  };

  return (
    <div>
      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan"}
      </button>

      <p>
        Progress: {progress.processed} / {progress.total}
      </p>

      <h2>Unused Images ({unusedImages.length})</h2>

      <ul>
        {unusedImages.map((image) => (
          <li key={image.id}>
            <strong>{image.name}</strong>
            <br />
            {(image.size / 1024).toFixed(1)} KB
          </li>
        ))}
      </ul>
    </div>
  );
}
