"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoaderStore } from "@/store/loaderStore";

type StepStatus = "pending" | "active" | "done" | "error";

/**
 * Mount this ONCE, near the root of your app (e.g. in layout.tsx).
 * Control it from anywhere via `useLoaderStore()` — no props needed.
 */
export function MultiStepLoader() {
  const { steps, currentStep, loading, errorMessage, close } = useLoaderStore();

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={errorMessage ? close : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4">
              {steps.map((step, index) => {
                const status: StepStatus =
                  errorMessage && index === currentStep
                    ? "error"
                    : index < currentStep
                      ? "done"
                      : index === currentStep
                        ? "active"
                        : "pending";

                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: status === "pending" ? 0.4 : 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3"
                  >
                    <StepIcon status={status} />
                    <span
                      className={cn(
                        "text-sm",
                        status === "done" && "text-neutral-400 line-through",
                        status === "active" && "font-medium text-white",
                        status === "pending" && "text-neutral-500",
                        status === "error" && "text-red-400"
                      )}
                    >
                      {step.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            {errorMessage && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-sm text-red-400">{errorMessage}</p>
                <button
                  onClick={close}
                  className="mt-3 text-xs text-neutral-400 underline hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done")
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />;
  if (status === "active")
    return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white" />;
  if (status === "error")
    return <XCircle className="h-5 w-5 shrink-0 text-red-500" />;
  return (
    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-neutral-700" />
  );
}
