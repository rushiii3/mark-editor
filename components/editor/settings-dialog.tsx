"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/settings-store";
import { saveFont, getAllFonts, deleteFont, type StoredFont } from "@/db/font";
import { Trash2, Upload, Type, Check } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { activeFont, setActiveFont, customFonts, loadCustomFonts } =
    useSettingsStore();

  const [dbFonts, setDbFonts] = useState<StoredFont[]>([]);
  const [uploadName, setUploadName] = useState("");
  const [uploadWeight, setUploadWeight] = useState("normal");
  const [uploadStyle, setUploadStyle] = useState("normal");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"appearance" | "custom-fonts">(
    "appearance"
  );

  const refreshFonts = async () => {
    const all = await getAllFonts();
    setDbFonts(all);
    await loadCustomFonts();
  };

  // Load custom fonts when the settings panel is opened
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      const all = await getAllFonts();

      if (!cancelled) {
        setDbFonts(all);
      }

      await loadCustomFonts();
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Guess family name from the file name
      const guessedName = file.name
        .replace(/\.[^/.]+$/, "") // strip extension
        .replace(/[-_]/g, " ") // replace delimiters with spaces
        .replace(
          /\b(regular|bold|italic|bolditalic|medium|semibold|light)\b/gi,
          ""
        ) // strip weight keywords
        .trim();

      if (!uploadName && guessedName) {
        setUploadName(guessedName);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadName) return;

    setIsUploading(true);
    try {
      const fontBlob = new Blob([await selectedFile.arrayBuffer()], {
        type: "font/ttf"
      });
      await saveFont(uploadName, uploadWeight, uploadStyle, fontBlob);

      // Reset
      setUploadName("");
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "font-file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      await refreshFonts();
    } catch (err) {
      console.error("Failed to upload font:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFont = async (id: string, family: string) => {
    try {
      await deleteFont(id);

      // Reset active font to Inter if the deleted font was currently selected
      if (activeFont === family) {
        setActiveFont("Inter");
      }

      await refreshFonts();
    } catch (err) {
      console.error("Failed to delete font:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 text-foreground bg-popover rounded-xl shadow-2xl border border-border">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Editor Settings
          </DialogTitle>
        </DialogHeader>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-4">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "appearance"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab("custom-fonts")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "custom-fonts"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Fonts
          </button>
          <Link
            href="/storage"
            className="px-4 py-2 text-sm font-medium border-b-2 -mb-px border-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            Storage
          </Link>
        </div>

        {activeTab === "appearance" && (
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Document Font Family
              </Label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {/* Inter (Default) */}
                <button
                  onClick={() => setActiveFont("Inter")}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                    activeFont === "Inter"
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-border hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Type className="size-4 text-muted-foreground" />
                    <span>Inter (Default Sans-Serif)</span>
                  </div>
                  {activeFont === "Inter" && (
                    <Check className="size-4 text-primary" />
                  )}
                </button>

                {/* Custom User Fonts */}
                {customFonts.map((fontFamily) => (
                  <button
                    key={fontFamily}
                    onClick={() => setActiveFont(fontFamily)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                      activeFont === fontFamily
                        ? "border-primary bg-primary/5 text-foreground font-medium"
                        : "border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Type className="size-4 text-muted-foreground" />
                      <span style={{ fontFamily }}>{fontFamily} (Custom)</span>
                    </div>
                    {activeFont === fontFamily && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Note: The font selection will be applied instantly to the markdown
              preview panel and the exported PDF document layout.
            </p>
          </div>
        )}

        {activeTab === "custom-fonts" && (
          <div className="space-y-4 py-1 max-h-[380px] overflow-y-auto">
            {/* Upload Font Form */}
            <form
              onSubmit={handleUploadSubmit}
              className="space-y-3 p-3 rounded-xl border border-border bg-muted/20"
            >
              <h3 className="text-xs font-semibold text-foreground">
                Upload Custom Font (.ttf)
              </h3>

              <div className="space-y-1">
                <Label
                  htmlFor="font-file-input"
                  className="text-[10px] text-muted-foreground"
                >
                  TTF Font File
                </Label>
                <Input
                  id="font-file-input"
                  type="file"
                  accept=".ttf"
                  onChange={handleFileChange}
                  required
                  className="h-9 px-2 py-1.5 text-xs text-foreground bg-background rounded-lg border border-border"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="font-name"
                  className="text-[10px] text-muted-foreground"
                >
                  Font Family Name
                </Label>
                <Input
                  id="font-name"
                  type="text"
                  placeholder="e.g. Playfair Display"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  required
                  className="h-9 text-xs text-foreground bg-background rounded-lg border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="font-weight"
                    className="text-[10px] text-muted-foreground"
                  >
                    Font Weight
                  </Label>
                  <select
                    id="font-weight"
                    value={uploadWeight}
                    onChange={(e) => setUploadWeight(e.target.value)}
                    className="w-full h-9 px-2 text-xs text-foreground bg-background rounded-lg border border-border outline-none focus:border-primary"
                  >
                    <option value="normal">Regular</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="font-style"
                    className="text-[10px] text-muted-foreground"
                  >
                    Font Style
                  </Label>
                  <select
                    id="font-style"
                    value={uploadStyle}
                    onChange={(e) => setUploadStyle(e.target.value)}
                    className="w-full h-9 px-2 text-xs text-foreground bg-background rounded-lg border border-border outline-none focus:border-primary"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUploading}
                className="w-full h-9 mt-2 text-xs rounded-lg gap-2 cursor-pointer"
              >
                <Upload className="size-3.5" />
                {isUploading ? "Uploading..." : "Save Font to IndexedDB"}
              </Button>
            </form>

            {/* Custom Fonts List */}
            <div className="space-y-2 mt-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Uploaded Font Files
              </Label>
              {dbFonts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 italic">
                  No custom fonts uploaded yet.
                </p>
              ) : (
                <div className="divide-y divide-border border rounded-xl overflow-hidden bg-background">
                  {dbFonts.map((font) => (
                    <div
                      key={font.id}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {font.family}
                        </p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          Weight: {font.weight} / Style: {font.style}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFont(font.id, font.family)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg size-8 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
