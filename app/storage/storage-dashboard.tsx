"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  DatabaseIcon,
  File02Icon,
  Image01Icon,
  PackageIcon,
  TextFontIcon
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { deleteDocument, getDocuments } from "@/db/documents";
import { deleteFont, getAllFonts, type StoredFont } from "@/db/font";
import { deleteImage, getAllImages, type StoredImage } from "@/db/image";
import { cn } from "@/lib/utils";
import { useStorageStore } from "@/store/storage-store";
import type { MarkdownFile } from "@/store/file-store";

const MEGABYTE = 1024 * 1024;
const FALLBACK_USED_BYTES = 620 * MEGABYTE;
const FALLBACK_QUOTA_BYTES = 1024 * MEGABYTE;

type StorageCategory = {
  name: StorageCategoryName;
  sizeBytes: number;
  icon: IconSvgElement;
  tone: string;
  itemCount: number;
};

type StorageCategoryName = "Documents" | "Images" | "Fonts" | "Other";

type StorageItem = {
  id: string;
  name: string;
  detail: string;
  sizeBytes: number;
  createdAt: number;
};

const categoryShells: Omit<StorageCategory, "sizeBytes" | "itemCount">[] = [
  {
    name: "Documents",
    icon: File02Icon,
    tone: "bg-chart-1/10 text-chart-1 ring-chart-1/20"
  },
  {
    name: "Images",
    icon: Image01Icon,
    tone: "bg-chart-2/10 text-chart-2 ring-chart-2/20"
  },
  {
    name: "Fonts",
    icon: TextFontIcon,
    tone: "bg-chart-5/10 text-chart-5 ring-chart-5/20"
  },
  {
    name: "Other",
    icon: PackageIcon,
    tone: "bg-muted text-muted-foreground ring-border"
  }
];

function formatStorage(bytes: number) {
  if (bytes >= 1024 * MEGABYTE) {
    const value = bytes / (1024 * MEGABYTE);
    return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)} GB`;
  }

  return `${Math.round(bytes / MEGABYTE).toLocaleString("en-US")} MB`;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(timestamp);
}

function getDocumentSize(document: MarkdownFile) {
  return new Blob([document.content]).size;
}

function toDocumentItem(document: MarkdownFile): StorageItem {
  return {
    id: document.id,
    name: document.name,
    detail: `Updated ${formatDate(document.updatedAt)}`,
    sizeBytes: getDocumentSize(document),
    createdAt: document.createdAt
  };
}

function toImageItem(image: StoredImage): StorageItem {
  return {
    id: image.id,
    name: image.name,
    detail: `${image.type || "Image"} - Added ${formatDate(image.createdAt)}`,
    sizeBytes: image.size || image.blob.size,
    createdAt: image.createdAt
  };
}

function toFontItem(font: StoredFont): StorageItem {
  return {
    id: font.id,
    name: font.family,
    detail: `${font.weight} - ${font.style} - Added ${formatDate(font.createdAt)}`,
    sizeBytes: font.blob.size,
    createdAt: font.createdAt
  };
}

async function getStorageItems() {
  const [documents, images, fonts] = await Promise.all([
    getDocuments(),
    getAllImages(),
    getAllFonts()
  ]);

  return { documents, images, fonts };
}

export function StorageDashboard() {
  const [selectedCategoryName, setSelectedCategoryName] =
    useState<StorageCategoryName>("Images");
  const [documents, setDocuments] = useState<MarkdownFile[]>([]);
  const [images, setImages] = useState<StoredImage[]>([]);
  const [fonts, setFonts] = useState<StoredFont[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const usage = useStorageStore((state) => state.usage);
  const quota = useStorageStore((state) => state.quota);
  const percentage = useStorageStore((state) => state.percentage);
  const supported = useStorageStore((state) => state.supported);
  const loading = useStorageStore((state) => state.loading);
  const refresh = useStorageStore((state) => state.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function loadStorageItems() {
    setIsLoadingItems(true);
    const nextItems = await getStorageItems();

    setDocuments(nextItems.documents);
    setImages(nextItems.images);
    setFonts(nextItems.fonts);
    setIsLoadingItems(false);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const nextItems = await getStorageItems();

      if (cancelled) return;

      setDocuments(nextItems.documents);
      setImages(nextItems.images);
      setFonts(nextItems.fonts);
      setIsLoadingItems(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const documentItems = documents.map(toDocumentItem);
  const imageItems = images.map(toImageItem);
  const fontItems = fonts.map(toFontItem);
  const hasQuota = supported && quota > 0;
  const usedBytes = supported && usage > 0 ? usage : FALLBACK_USED_BYTES;
  const quotaBytes = hasQuota ? quota : FALLBACK_QUOTA_BYTES;
  const knownCategoryTotal = [...documentItems, ...imageItems, ...fontItems].reduce(
    (total, item) => total + item.sizeBytes,
    0
  );
  const otherBytes = Math.max(usedBytes - knownCategoryTotal, 0);
  const storageCategories: StorageCategory[] = categoryShells.map((category) => {
    if (category.name === "Documents") {
      return {
        ...category,
        itemCount: documentItems.length,
        sizeBytes: documentItems.reduce((total, item) => total + item.sizeBytes, 0)
      };
    }

    if (category.name === "Images") {
      return {
        ...category,
        itemCount: imageItems.length,
        sizeBytes: imageItems.reduce((total, item) => total + item.sizeBytes, 0)
      };
    }

    if (category.name === "Fonts") {
      return {
        ...category,
        itemCount: fontItems.length,
        sizeBytes: fontItems.reduce((total, item) => total + item.sizeBytes, 0)
      };
    }

    return {
      ...category,
      itemCount: otherBytes > 0 ? 1 : 0,
      sizeBytes: otherBytes
    };
  });
  const usagePercentage = hasQuota
    ? Math.min(Math.round((usedBytes / quotaBytes) * 100), 100)
    : percentage || 62;
  const quotaSummary = hasQuota
    ? `${formatStorage(usedBytes)} used of ${formatStorage(quotaBytes)}`
    : "Quota unavailable";
  const categoryTotal = storageCategories.reduce(
    (total, category) => total + category.sizeBytes,
    0
  );
  const selectedCategory =
    storageCategories.find((category) => category.name === selectedCategoryName) ??
    storageCategories[0];
  const selectedItemsByCategory: Record<StorageCategoryName, StorageItem[]> = {
    Documents: documentItems,
    Images: imageItems,
    Fonts: fontItems,
    Other: []
  };
  const selectedItems = selectedItemsByCategory[selectedCategory.name];
  const canDeleteSelectedItems = selectedCategory.name !== "Other";

  async function handleDeleteItem(itemId: string) {
    if (selectedCategory.name === "Other") return;

    setDeletingItemId(itemId);

    try {
      if (selectedCategory.name === "Documents") {
        await deleteDocument(itemId);
      }

      if (selectedCategory.name === "Images") {
        await deleteImage(itemId);
      }

      if (selectedCategory.name === "Fonts") {
        await deleteFont(itemId);
      }

      await Promise.all([loadStorageItems(), refresh()]);
    } finally {
      setDeletingItemId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Settings</span>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Storage</span>
          </nav>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              Storage
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              A centralized view of the local resources saved by the editor,
              including the browser quota when it is available.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-1">
                <CardTitle>Storage overview</CardTitle>
                <CardDescription>
                  Local usage across saved documents, image assets, font files,
                  and supporting data.
                </CardDescription>
              </div>
              <CardAction>
                <Badge variant={hasQuota ? "secondary" : "outline"}>
                  {loading
                    ? "Checking quota"
                    : hasQuota
                      ? "Quota available"
                      : "Quota unavailable"}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4 rounded-lg bg-muted/40 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <div
                  className="flex size-20 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
                  aria-hidden="true"
                >
                  <HugeiconsIcon icon={DatabaseIcon} size={34} />
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Current usage
                      </span>
                      <span className="text-2xl font-semibold tracking-normal">
                        {formatStorage(usedBytes)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-semibold tracking-normal">
                        {usagePercentage}%
                      </span>
                      <span className="sr-only"> storage used</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Progress
                      aria-label="Storage usage"
                      aria-valuetext={`${usagePercentage}% storage used`}
                      className="h-3"
                      value={usagePercentage}
                    />
                    <p className="text-sm text-muted-foreground">
                      {quotaSummary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Used
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {formatStorage(usedBytes)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Quota
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {hasQuota ? formatStorage(quotaBytes) : "Quota unavailable"}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Categories
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {storageCategories.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Storage breakdown</CardTitle>
              <CardDescription>
                Categorized local resources currently tracked by the editor.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {storageCategories.map((category) => (
                <button
                  aria-pressed={selectedCategory.name === category.name}
                  className={cn(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    selectedCategory.name === category.name &&
                      "bg-muted text-foreground ring-1 ring-border"
                  )}
                  key={category.name}
                  onClick={() => setSelectedCategoryName(category.name)}
                  type="button"
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md ring-1",
                      category.tone
                    )}
                    aria-hidden="true"
                  >
                    <HugeiconsIcon icon={category.icon} size={18} />
                  </div>
                  <span className="truncate font-medium">{category.name}</span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatStorage(category.sizeBytes)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {category.itemCount} {category.itemCount === 1 ? "item" : "items"}
                    </span>
                  </span>
                </button>
              ))}
            </CardContent>

            <Separator />

            <CardFooter className="justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total listed resources
              </span>
              <span className="font-mono text-sm font-semibold">
                {formatStorage(categoryTotal)}
              </span>
            </CardFooter>
          </Card>
        </section>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-1">
              <CardTitle>{selectedCategory.name} cleanup</CardTitle>
              <CardDescription>
                {canDeleteSelectedItems
                  ? `All ${selectedCategory.name.toLowerCase()} saved in local storage.`
                  : "Browser and application overhead that cannot be itemized yet."}
              </CardDescription>
            </div>
            <CardAction>
              <Badge variant="outline">
                {formatStorage(selectedCategory.sizeBytes)} total
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {isLoadingItems ? (
              <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
                Loading stored {selectedCategory.name.toLowerCase()}...
              </div>
            ) : selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <div
                  className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={item.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-semibold">
                        {item.name}
                      </h2>
                      <Badge variant="secondary">
                        {formatStorage(item.sizeBytes)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <Button
                    disabled={deletingItemId === item.id}
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="destructive"
                  >
                    {deletingItemId === item.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
                {canDeleteSelectedItems
                  ? `No ${selectedCategory.name.toLowerCase()} are stored locally.`
                  : "No itemized cleanup records are available for this category."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
