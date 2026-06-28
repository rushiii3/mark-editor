import { create } from "zustand";
import { getAllFonts } from "@/db/font";

interface SettingsState {
  activeFont: string;
  customFonts: string[];
  setActiveFont: (font: string) => void;
  loadCustomFonts: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeFont:
    typeof window !== "undefined"
      ? localStorage.getItem("manus-active-font") || "Inter"
      : "Inter",
  customFonts: [],

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
  }
}));
