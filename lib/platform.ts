import { platform } from "@tauri-apps/plugin-os";

export type Runtime = "tauri" | "web";

export interface PlatformInfo {
  runtime: Runtime;
  os: string;
  isTauri: boolean;
  isWeb: boolean;
  isDesktop: boolean;
  isMobile: boolean;
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export async function getPlatformInfo(): Promise<PlatformInfo> {
  if (isTauriRuntime()) {
    const os = await platform();

    return {
      runtime: "tauri",
      os,
      isTauri: true,
      isWeb: false,
      isDesktop: true,
      isMobile: false
    };
  }

  const mobile = isMobileBrowser();

  return {
    runtime: "web",
    os: mobile ? "mobile" : "desktop",
    isTauri: false,
    isWeb: true,
    isDesktop: !mobile,
    isMobile: mobile
  };
}
