import { SaveStatus } from "@/types";
import {
  CircleStar,
  LoaderCircle,
  CheckIcon,
  Alert02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePlatformStore } from "@/store/platform";
interface SaveStatusIndicatorProps {
  status: SaveStatus;
}
async function openStorageWindow() {
  let win = await WebviewWindow.getByLabel("storage");

  if (!win) {
    win = new WebviewWindow("storage", {
      title: "Storage",
      url: "/storage",
      width: 900,
      height: 700
    });

    win.once("tauri://created", () => {
      console.log("Storage window created");
    });

    win.once("tauri://error", (e) => {
      console.error(e);
    });
    return;
  }

  await win.setFocus();
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  const { runtime, isReady } = usePlatformStore();
  const handleManageStorage = () => {
    if (isReady && runtime === "tauri") {
      openStorageWindow();
      return;
    }

    window.open("/storage", "_blank", "noopener,noreferrer");
  };

  switch (status) {
    case "idle":
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm text-nowrap">
          <HugeiconsIcon icon={CircleStar} className="h-3 w-3" />
          Ready
        </div>
      );

    case "saving":
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm text-nowrap">
          <HugeiconsIcon
            icon={LoaderCircle}
            className="animate-spin"
            size={16}
          />
          Saving...
        </div>
      );

    case "saved":
      return (
        <div className="flex items-center gap-2 text-sm text-green-600 text-nowrap">
          <HugeiconsIcon icon={CheckIcon} size={16} />
          Saved
        </div>
      );

    case "save_failed":
      return (
        <div className="flex items-center gap-2 text-sm text-red-600 text-nowrap">
          <HugeiconsIcon icon={Alert02Icon} size={16} />
          Failed to save
        </div>
      );

    case "storage_full":
      return (
        <div className="flex items-center gap-2 text-sm text-amber-600 text-nowrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">
                <HugeiconsIcon icon={Alert02Icon} size={16} />
                Storage is full
              </Button>
            </AlertDialogTrigger>{" "}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 mb-3">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    size={16}
                    className="text-amber-600"
                  />{" "}
                  Changes couldn&apos;t be saved
                </AlertDialogTitle>
                <AlertDialogDescription className="text-justify">
                  Your latest changes are still available but couldn&apos;t be
                  saved locally. <br />
                  Free up storage space before closing the application to avoid
                  losing your changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Refresh Storage</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleManageStorage}
                  className="bg-primary"
                >
                  {/* <Link
                    href="/storage"
                    target="_blank"
                    onClick={() => storageWindow.show()}
                  > */}
                  Manage Storage
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
  }
}
