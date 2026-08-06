import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import {
  Sliders,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  FileCode,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutConfig, RegionConfig } from "../types";
import { FONTS, FONT_SIZES } from "../constants";

interface LayoutComposerProps {
  selectedSection: "header" | "footer";
  selectedRegion: "left" | "center" | "right";
  setSelectedSection: (section: "header" | "footer") => void;
  setSelectedRegion: (region: "left" | "center" | "right") => void;
  config: LayoutConfig;
  activeRegionConfig: RegionConfig;
  updateActiveRegion: (key: keyof RegionConfig, value: unknown) => void;
  handleLocalImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrlInput: string;
  setImageUrlInput: (value: string) => void;
  showImagePopover: boolean;
  setShowImagePopover: (show: boolean) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  saveConfig: (newConfig: LayoutConfig) => void;
  resolvedTheme: string | undefined;
}

export function LayoutComposer({
  selectedSection,
  selectedRegion,
  setSelectedSection,
  setSelectedRegion,
  config,
  activeRegionConfig,
  updateActiveRegion,
  handleLocalImageUpload,
  imageUrlInput,
  setImageUrlInput,
  showImagePopover,
  setShowImagePopover,
  inputRef,
  handleDrop,
  handleDragOver,
  saveConfig,
  resolvedTheme
}: LayoutComposerProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
      {/* Section Title */}
      <div>
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Layout Composer</h2>
        </div>
        <p className="text-[11px] text-muted-foreground/80 mt-0.5">
          Select a section in the document grid below, then configure its properties.
        </p>
      </div>

      {/* Visual Split Grid representing Left, Center, Right regions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Interactive Grid
          </span>
          <span className="text-[10px] font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 capitalize">
            Active: {selectedSection} - {selectedRegion}
          </span>
        </div>

        {/* Visual Header Representation */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
            <span>Document Header (Top of Page)</span>
            <span className="text-[9px] text-muted-foreground/50">3 Regions</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border border-border bg-muted/20 p-2 rounded-xl">
            {(["left", "center", "right"] as const).map((region) => {
              const isTarget = selectedSection === "header" && selectedRegion === region;
              const hasText = config.header[region].text.trim() !== "";
              const hasImage = config.header[region].image !== null;
              return (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedSection("header");
                    setSelectedRegion(region);
                  }}
                  className={`flex flex-col items-center justify-center h-16 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    isTarget
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {region}
                  </span>
                  <span className="text-[9px] truncate max-w-full font-mono mt-1 px-1">
                    {hasImage ? "🖼️ Logo" : hasText ? config.header[region].text : "[Empty]"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Footer Representation */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
            <span>Document Footer (Bottom of Page)</span>
            <span className="text-[9px] text-muted-foreground/50">3 Regions</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border border-border bg-muted/20 p-2 rounded-xl">
            {(["left", "center", "right"] as const).map((region) => {
              const isTarget = selectedSection === "footer" && selectedRegion === region;
              const hasText = config.footer[region].text.trim() !== "";
              const hasImage = config.footer[region].image !== null;
              return (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedSection("footer");
                    setSelectedRegion(region);
                  }}
                  className={`flex flex-col items-center justify-center h-16 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    isTarget
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {region}
                  </span>
                  <span className="text-[9px] truncate max-w-full font-mono mt-1 px-1">
                    {hasImage ? "🖼️ Logo" : hasText ? config.footer[region].text : "[Empty]"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editing Controls & Formatting Toolbar for selected region */}
      <div className="flex flex-col border border-border bg-card rounded-xl shadow-xs overflow-hidden">
        <div className="px-4 py-2 border-b border-border/80 bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Property Inspector: {selectedSection.toUpperCase()} &gt; {selectedRegion.toUpperCase()}
          </span>
        </div>

        {/* Properties form */}
        <div className="p-4 space-y-4">
          {/* Font Styling Tools */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Font family selection */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                Font Family
              </label>
              <select
                value={activeRegionConfig.fontFamily}
                onChange={(e) => updateActiveRegion("fontFamily", e.target.value)}
                className="w-full text-xs h-7 px-2 border border-border bg-background rounded-md outline-none focus:border-primary text-foreground"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Font size selection */}
            <div className="flex flex-col gap-1 min-w-[80px]">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                Font Size
              </label>
              <select
                value={activeRegionConfig.fontSize}
                onChange={(e) => updateActiveRegion("fontSize", e.target.value)}
                className="w-full text-xs h-7 px-2 border border-border bg-background rounded-md outline-none focus:border-primary text-foreground"
              >
                {FONT_SIZES.map((fs) => (
                  <option key={fs} value={fs}>
                    {fs}
                  </option>
                ))}
              </select>
            </div>

            {/* Bold / Italic / Underline Toggles */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Weights</label>
              <div className="flex items-center border border-border bg-background rounded-md overflow-hidden h-7">
                <button
                  onClick={() => updateActiveRegion("bold", !activeRegionConfig.bold)}
                  className={`px-2 h-full hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.bold ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  <Bold className="size-3.5" />
                </button>
                <button
                  onClick={() => updateActiveRegion("italic", !activeRegionConfig.italic)}
                  className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.italic ? "bg-primary/10 text-primary italic" : "text-muted-foreground"
                  }`}
                >
                  <Italic className="size-3.5" />
                </button>
                <button
                  onClick={() => updateActiveRegion("underline", !activeRegionConfig.underline)}
                  className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.underline ? "bg-primary/10 text-primary underline" : "text-muted-foreground"
                  }`}
                >
                  <Underline className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Alignment Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                Alignment
              </label>
              <div className="flex items-center border border-border bg-background rounded-md overflow-hidden h-7">
                <button
                  onClick={() => updateActiveRegion("align", "left")}
                  className={`px-2 h-full hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.align === "left" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <AlignLeft className="size-3.5" />
                </button>
                <button
                  onClick={() => updateActiveRegion("align", "center")}
                  className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.align === "center" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <AlignCenter className="size-3.5" />
                </button>
                <button
                  onClick={() => updateActiveRegion("align", "right")}
                  className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors cursor-pointer ${
                    activeRegionConfig.align === "right" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <AlignRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Text Color Selection */}
            <div className="flex flex-col gap-1 min-w-[100px]">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Color</label>
              <div className="flex items-center gap-1.5 h-7">
                <Input
                  type="color"
                  value={activeRegionConfig.color}
                  onChange={(e) => updateActiveRegion("color", e.target.value)}
                  className="size-7 p-0.5 rounded border border-border cursor-pointer bg-transparent"
                />
                <Input
                  type="text"
                  value={activeRegionConfig.color}
                  onChange={(e) => updateActiveRegion("color", e.target.value)}
                  placeholder="#000000"
                  className="text-xs h-7 px-2 bg-background border border-border rounded-md font-mono w-20 text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Logo Image Uploader & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/40 bg-muted/10 p-3 rounded-lg">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block">
                Region Logo / Image
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border border-border/80 hover:bg-muted cursor-pointer font-medium gap-1"
                  onClick={() => {
                    const fileInput = document.getElementById("region-logo-upload") as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                >
                  <Upload className="size-3.5" />
                  Upload Logo
                </Button>
                <Input
                  id="region-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageUpload}
                  className="hidden"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/80 cursor-pointer font-medium gap-1"
                  onClick={() => setShowImagePopover(!showImagePopover)}
                >
                  <ImageIcon className="size-3.5" />
                  Paste URL
                </Button>
              </div>

              {showImagePopover && (
                <div className="flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="text-xs h-7 px-2 border border-border bg-background rounded-md text-foreground flex-1"
                  />
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      if (imageUrlInput.trim() !== "") {
                        updateActiveRegion("image", imageUrlInput.trim());
                        setImageUrlInput("");
                        setShowImagePopover(false);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end items-end">
              {activeRegionConfig.image ? (
                <div className="flex items-center gap-2 border border-border p-1 bg-background rounded-md relative group select-none">
                  <img
                    src={activeRegionConfig.image}
                    alt="Logo preview"
                    className="h-9 w-auto max-w-[120px] object-contain rounded"
                  />
                  <button
                    onClick={() => updateActiveRegion("image", null)}
                    className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-colors shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-150"
                  >
                    <Trash2 className="size-2.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground italic h-9 flex items-center">
                  No logo uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Text Input area (HTML5 drop target) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                Text Template Content
              </label>
              <span className="text-[9px] text-muted-foreground/60">
                Supports markdown-like plain text & raw HTML.
              </span>
            </div>
            <textarea
              ref={inputRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              value={activeRegionConfig.text}
              onChange={(e) => updateActiveRegion("text", e.target.value)}
              placeholder="Type text here, e.g. Confidential Document... or drop variable chips."
              rows={3}
              className="w-full p-2.5 text-xs text-foreground bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono transition-all resize-none shadow-2xs placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      {/* Advanced Scoped CSS Code Area */}
      <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-border/80 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileCode className="size-4 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Advanced Document CSS
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground/60 font-mono">
            Scoped selectors targeting .header and .footer
          </span>
        </div>
        <div className="p-3 bg-muted/10">
          <div className="rounded-lg overflow-hidden border border-border bg-background">
            <CodeMirror
              value={config.advancedCss}
              height="200px"
              theme={resolvedTheme === "dark" ? vscodeDark : vscodeLight}
              onChange={(value) => {
                const newConfig = { ...config, advancedCss: value };
                saveConfig(newConfig);
              }}
              className="text-xs font-mono"
            />
          </div>
          <p className="text-[9px] text-muted-foreground/80 mt-2 flex items-center gap-1 leading-normal">
            <Info className="size-3 text-primary shrink-0" />
            Styles defined here are scoped only to A4 document rendering and won't leak into the app. Custom padding, border-color, and border-styles can be defined.
          </p>
        </div>
      </div>
    </div>
  );
}
