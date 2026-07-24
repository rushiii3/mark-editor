import { create } from "zustand";

interface StorageState {
  usage: number;
  quota: number;
  percentage: number;
  supported: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useStorageStore = create<StorageState>((set) => ({
  usage: 0,
  quota: 0,
  percentage: 0,
  supported: true,
  loading: true,

  refresh: async () => {
    if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
      set({
        supported: false,
        loading: false
      });
      return;
    }

    const estimate = await navigator.storage.estimate();

    const usage = estimate.usage ?? 0;
    const quota = estimate.quota ?? 0;

    set({
      usage,
      quota,
      percentage: quota ? Math.round((usage / quota) * 100) : 0,
      supported: true,
      loading: false
    });
  }
}));
