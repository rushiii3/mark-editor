"use client";

import { usePlatformStore } from "@/store/platform";

const Page = () => {
  const { runtime, os, isReady } = usePlatformStore();
  if (!isReady) {
    return null;
  }
  return (
    <div>
      <h1>Platform Detection</h1>
      <p>Runtime: {runtime}</p>
      <p>OS: {os}</p>
    </div>
  );
};

export default Page;
