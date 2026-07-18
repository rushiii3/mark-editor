import { platform } from "@tauri-apps/plugin-os";

export async function getPlatform() {
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    const os = await platform();

    return {
      runtime: "tauri" as const,
      os
    };
  }

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  return {
    runtime: "web" as const,
    os: isMobile ? "mobile" : "desktop"
  };
}
