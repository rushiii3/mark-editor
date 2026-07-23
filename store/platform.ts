import { getPlatformInfo } from "@/lib/platform";
import { create } from "zustand";
interface PlatformState {
  runtime: "tauri" | "web";
  os: string;
  isReady: boolean;
  initialize: () => Promise<void>;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  runtime: "web",
  os: "desktop",
  isReady: false,

  initialize: async () => {
    const platform = await getPlatformInfo();

    set({
      ...platform,
      isReady: true
    });
  }
}));
