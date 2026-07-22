import { create } from "zustand";
import { getAllFonts } from "@/db/font";
import { getSetting, setSetting } from "@/db/setting";

interface SettingsState {
  activeFont: string;
  customFonts: string[];
  setActiveFont: (font: string) => void;
  loadCustomFonts: () => Promise<void>;
  showHeader: boolean;
  toggleHeader: () => void;
  lineWrapping: boolean;
  toggleLineWrapping: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeFont:
    typeof window !== "undefined"
      ? localStorage.getItem("manus-active-font") || "Inter"
      : "Inter",
  customFonts: [],
  showHeader: true,
  lineWrapping: true,
  setActiveFont: (font: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("manus-active-font", font);
    }
    set({ activeFont: font });
  },

  loadCustomFonts: async () => {
    try {
      const fonts = await getAllFonts();
      const uniqueFamilies = Array.from(new Set(fonts.map((f) => f.family)));
      set({ customFonts: uniqueFamilies });
    } catch (err) {
      console.error("Failed to load custom fonts from DB:", err);
    }
  },

  loadSettings: async () => {
    try {
      const lineWrappingSetting = await getSetting<boolean>(
        "editor.lineWrapping"
      );
      if (lineWrappingSetting !== undefined) {
        set({ lineWrapping: lineWrappingSetting });
      }
    } catch (err) {
      console.error("Failed to load settings from DB:", err);
    }
  },

  toggleHeader: async () => {
    set((state) => ({
      showHeader: !state.showHeader
    }));
  },

  toggleLineWrapping: async () => {
    set((state) => ({
      lineWrapping: !state.lineWrapping
    }));
    await setSetting(
      "editor.lineWrapping",
      useSettingsStore.getState().lineWrapping
    );
  }
}));
