import { SaveStatus } from "@/types";
import {
  CircleStar,
  LoaderCircle,
  CheckIcon,
  Alert02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  switch (status) {
    case "idle":
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <HugeiconsIcon icon={CircleStar} className="h-3 w-3" />
          Ready
        </div>
      );

    case "saving":
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
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
        <div className="flex items-center gap-2 text-sm text-green-600">
          <HugeiconsIcon icon={CheckIcon} size={16} />
          Saved
        </div>
      );

    case "save_failed":
      return (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <HugeiconsIcon icon={Alert02Icon} size={16} />
          Failed to save
        </div>
      );

    case "storage_full":
      return (
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <HugeiconsIcon icon={Alert02Icon} size={16} />
          Storage full — changes not saved
        </div>
      );
  }
}
