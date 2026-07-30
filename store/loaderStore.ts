import { create } from "zustand";

export type LoaderStep = { text: string };

interface LoaderState {
  steps: LoaderStep[];
  currentStep: number;
  loading: boolean;
  errorMessage: string | null;

  /** Open the loader with a fixed list of steps, starting at step 0. */
  start: (steps: LoaderStep[]) => void;
  /** Advance to the next step. */
  next: () => void;
  /** Jump to a specific step index. */
  setStep: (index: number) => void;
  /** Mark the current step as failed and keep the loader open. */
  fail: (message: string) => void;
  /** Success — closes the loader and resets state. */
  finish: () => void;
  /** Manual close (e.g. dismiss button after an error). */
  close: () => void;
}

/**
 * Runs `task`, but guarantees the step stays visible for at least `minMs`
 * before moving on — so fast/instant steps don't just flash and disappear.
 *
 * Usage:
 *   await runStep(0, () => generateBlob(markdown));         // default 500ms
 *   await runStep(1, () => zip.generateAsync({...}), 700);  // custom min
 */
export async function runStep<T>(
  index: number,
  task: () => Promise<T> | T,
  minMs = 500
): Promise<T> {
  useLoaderStore.getState().setStep(index);
  const started = Date.now();

  const result = await task();

  const elapsed = Date.now() - started;
  if (elapsed < minMs) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed));
  }

  return result;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  steps: [],
  currentStep: 0,
  loading: false,
  errorMessage: null,

  start: (steps) =>
    set({ steps, currentStep: 0, loading: true, errorMessage: null }),

  next: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, s.steps.length - 1)
    })),

  setStep: (index) => set({ currentStep: index }),

  fail: (message) => set({ errorMessage: message }),

  finish: () =>
    set({ loading: false, currentStep: 0, errorMessage: null, steps: [] }),

  close: () =>
    set({ loading: false, errorMessage: null, currentStep: 0, steps: [] })
}));
