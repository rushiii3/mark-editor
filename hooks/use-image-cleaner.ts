import { useEffect, useRef } from "react";

export function useImageCleanupWorker() {
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/workers/image-cleanup.worker.ts", import.meta.url),
      {
        type: "module"
      }
    );

    return () => workerRef.current?.terminate();
  }, []);

  const scan = () => {
    workerRef.current?.postMessage({
      type: "scan"
    });
  };

  return {
    worker: workerRef,
    scan
  };
}
