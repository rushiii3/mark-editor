"use client";

import { usePlatformStore } from "@/store/platform";
import { useEffect } from "react";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const initialize = usePlatformStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return children;
}
