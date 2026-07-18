"use client";

import React, { useEffect, useState } from "react";

type Platform =
  | "tauri-macos"
  | "tauri-windows"
  | "tauri-linux"
  | "web-mobile"
  | "web-desktop";

function getPlatform(): Platform {
  if (typeof window === "undefined") {
    return "web-desktop";
  }

  // Detect Tauri
  const isTauri = "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("mac")) {
      return "tauri-macos";
    }

    if (platform.includes("win")) {
      return "tauri-windows";
    }

    if (platform.includes("linux")) {
      return "tauri-linux";
    }
  }

  // Detect web mobile
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  return isMobile ? "web-mobile" : "web-desktop";
}

const Page = () => {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  if (!platform) {
    return <div>Detecting platform...</div>;
  }

  return (
    <div>
      <h1>Platform Detection</h1>

      <p>
        Current Platform: <strong>{platform}</strong>
      </p>

      {platform.startsWith("tauri") && (
        <p>Running inside the Tauri desktop application.</p>
      )}

      {platform === "web-mobile" && <p>Running in a mobile web browser.</p>}

      {platform === "web-desktop" && <p>Running in a desktop web browser.</p>}
    </div>
  );
};

export default Page;
