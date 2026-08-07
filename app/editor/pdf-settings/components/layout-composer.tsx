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
  Info,
  Layout,
  Settings,
  AlignJustify,
  Sparkles,
  Check,
  GripVertical,
  ShieldCheck,
  Type
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutConfig, RegionConfig } from "../types";
import { FONTS, FONT_SIZES, VARIABLES, TEMPLATES } from "../constants";

interface LayoutComposerProps {
  activeCategory: "layout" | "typography" | "metadata" | "css";
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

  // Metadata / Presets category helpers
  activeTemplate: string;
  handleTemplateSelect: (templateId: string) => void;
  insertVariable: (token: string) => void;
  handleDragStart: (e: React.DragEvent, token: string) => void;
}

export function LayoutComposer({
  activeCategory,
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
  resolvedTheme,
  activeTemplate,
  handleTemplateSelect,
  insertVariable,
  handleDragStart
}: LayoutComposerProps) {

  // Fallbacks for geometry & style settings
  const pageSize = config.pageSize || "A4";
  const orientation = config.orientation || "portrait";
  const margins = config.margins || { top: 20, bottom: 22, left: 18, right: 18 };
  const excludeHeaderFooterFirstPage = !!config.excludeHeaderFooterFirstPage;
  const mirrorHeaderFooterOddEven = !!config.mirrorHeaderFooterOddEven;
  const bodyFontSize = config.bodyFontSize || 12;
  const bodyLineHeight = config.bodyLineHeight || 1.55;
  const bodyAlignment = config.bodyAlignment || "left";
  const paragraphSpacing = config.paragraphSpacing !== undefined ? config.paragraphSpacing : 8;
  const codeBlockTheme = config.codeBlockTheme || "light";
  const watermarkText = config.watermarkText || "";
  const watermarkOpacity = config.watermarkOpacity !== undefined ? config.watermarkOpacity : 0.08;
  const autoCoverPage = !!config.autoCoverPage;

  const updateDocSetting = (key: keyof LayoutConfig, value: unknown) => {
    saveConfig({
      ...config,
      [key]: value
    });
  };

  const updateMargin = (side: "top" | "bottom" | "left" | "right", value: number) => {
    saveConfig({
      ...config,
      margins: {
        ...margins,
        [side]: value
      }
    });
  };

  // Category Header Details
  const getHeaderInfo = () => {
    switch (activeCategory) {
      case "layout":
        return {
          title: "Page Layout & Margin",
          desc: "Configure running header/footer regions, page sizing, orientation, and custom margins.",
          icon: Layout
        };
      case "typography":
        return {
          title: "Typography Settings",
          desc: "Customize body font sizes, line heights, text alignments, spacing, and styling parameters.",
          icon: Type
        };
      case "metadata":
        return {
          title: "Metadata & Security",
          desc: "Apply preset templates, build cover pages, configure diagonal watermarks, and insert dynamic fields.",
          icon: ShieldCheck
        };
      case "css":
        return {
          title: "Advanced Document CSS",
          desc: "Apply custom CSS overrides target scoped class selectors for running header and footer regions.",
          icon: FileCode
        };
    }
  };

  const headerInfo = getHeaderInfo();
  const HeaderIcon = headerInfo.icon;

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-6 bg-background/5">
      {/* Category Header */}
      <div className="flex items-start gap-3 border-b border-border/50 pb-4 shrink-0">
        <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/10 shrink-0">
          <HeaderIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-wider uppercase text-foreground/95">{headerInfo.title}</h2>
          <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium leading-relaxed">
            {headerInfo.desc}
          </p>
        </div>
      </div>

      {/* Category 1: Page Layout and Margin */}
      {activeCategory === "layout" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Visual Page Map Representation (A4 Mini Canvas) */}
          <div className="border border-border/50 bg-muted/10 p-5 rounded-2xl flex flex-col items-center justify-center shadow-3xs select-none">
            <div className="flex justify-between items-center w-full mb-3.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Interactive Layout Map
              </span>
              <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20 capitalize shadow-3xs">
                Editing: {selectedSection} • {selectedRegion}
              </span>
            </div>
            
            {/* Mini A4 Page Wireframe */}
            <div className="relative w-full max-w-[320px] aspect-[1/1.41] bg-card border border-border/80 rounded-xl shadow-md flex flex-col p-4 justify-between transition-all duration-300 overflow-hidden ring-1 ring-border/30">
              
              {/* Header Zone */}
              <div className="border border-dashed border-border bg-muted/20 hover:border-blue-500/40 hover:bg-muted/30 transition-all rounded-lg p-1.5">
                <div className="text-[7.5px] font-extrabold text-muted-foreground/50 uppercase text-center mb-1 tracking-wider select-none">
                  Document Header
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(["left", "center", "right"] as const).map((region) => {
                    const isTarget = selectedSection === "header" && selectedRegion === region;
                    const hasText = config.header[region].text.trim() !== "";
                    const hasImage = config.header[region].image !== null;
                    return (
                      <button
                        key={`header-${region}`}
                        type="button"
                        onClick={() => {
                          setSelectedSection("header");
                          setSelectedRegion(region);
                        }}
                        className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-md transition-all duration-200 border text-center cursor-pointer ${
                          isTarget
                            ? "border-blue-500 bg-blue-500/10 text-blue-650 dark:text-blue-400 shadow-3xs"
                            : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-[7px] font-bold uppercase tracking-wider opacity-60">
                          {region}
                        </span>
                        <span className="text-[7px] truncate max-w-full font-mono mt-0.5 px-0.5 opacity-90 scale-90">
                          {hasImage ? "🖼️ Logo" : hasText ? config.header[region].text : "-"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Body Mock Elements */}
              <div className="flex-1 flex flex-col justify-center py-4 px-2.5 space-y-3 opacity-25 pointer-events-none">
                <div className="space-y-1.5">
                  <div className="h-1.5 w-1/3 bg-muted-foreground/80 rounded-sm" />
                  <div className="h-2 w-full bg-muted-foreground/50 rounded-sm" />
                  <div className="h-2 w-5/6 bg-muted-foreground/50 rounded-sm" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-1/4 bg-muted-foreground/80 rounded-sm" />
                  <div className="h-2 w-full bg-muted-foreground/50 rounded-sm" />
                  <div className="h-2 w-4/5 bg-muted-foreground/50 rounded-sm" />
                </div>
              </div>

              {/* Footer Zone */}
              <div className="border border-dashed border-border bg-muted/20 hover:border-indigo-500/40 hover:bg-muted/30 transition-all rounded-lg p-1.5">
                <div className="grid grid-cols-3 gap-1">
                  {(["left", "center", "right"] as const).map((region) => {
                    const isTarget = selectedSection === "footer" && selectedRegion === region;
                    const hasText = config.footer[region].text.trim() !== "";
                    const hasImage = config.footer[region].image !== null;
                    return (
                      <button
                        key={`footer-${region}`}
                        type="button"
                        onClick={() => {
                          setSelectedSection("footer");
                          setSelectedRegion(region);
                        }}
                        className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-md transition-all duration-200 border text-center cursor-pointer ${
                          isTarget
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 shadow-3xs"
                            : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-[7px] font-bold uppercase tracking-wider opacity-60">
                          {region}
                        </span>
                        <span className="text-[7px] truncate max-w-full font-mono mt-0.5 px-0.5 opacity-90 scale-90">
                          {hasImage ? "🖼️ Logo" : hasText ? config.footer[region].text : "-"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[7.5px] font-extrabold text-muted-foreground/50 uppercase text-center mt-1 tracking-wider select-none">
                  Document Footer
                </div>
              </div>
            </div>
          </div>

          {/* Property Inspector for selected region */}
          <div className="flex flex-col border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden ring-1 ring-border/20">
            <div className="px-4.5 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Property Inspector • {selectedSection.toUpperCase()} &gt; {selectedRegion.toUpperCase()}
              </span>
            </div>

            {/* Properties form */}
            <div className="p-5 space-y-5">
              {/* Font Styling Tools */}
              <div className="flex flex-wrap items-end gap-3.5">
                {/* Font family selection */}
                <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Font Family
                  </label>
                  <select
                    value={activeRegionConfig.fontFamily}
                    onChange={(e) => updateActiveRegion("fontFamily", e.target.value)}
                    className="w-full text-xs h-8.5 px-2.5 border border-border/60 bg-background/50 hover:bg-background hover:border-border transition-colors rounded-xl outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-foreground font-medium"
                  >
                    {FONTS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font size selection */}
                <div className="flex flex-col gap-1.5 min-w-[85px]">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Font Size
                  </label>
                  <select
                    value={activeRegionConfig.fontSize}
                    onChange={(e) => updateActiveRegion("fontSize", e.target.value)}
                    className="w-full text-xs h-8.5 px-2.5 border border-border/60 bg-background/50 hover:bg-background hover:border-border transition-colors rounded-xl outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-foreground font-medium"
                  >
                    {FONT_SIZES.map((fs) => (
                      <option key={fs} value={fs}>
                        {fs}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bold / Italic / Underline Toggles */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Styles</label>
                  <div className="flex items-center border border-border/60 bg-muted/30 rounded-xl overflow-hidden h-8.5 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("bold", !activeRegionConfig.bold)}
                      className={`px-3.5 h-full rounded-lg hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.bold ? "bg-card text-blue-600 dark:text-blue-400 font-bold border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("italic", !activeRegionConfig.italic)}
                      className={`px-3.5 h-full rounded-lg border-l border-transparent hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.italic ? "bg-card text-blue-600 dark:text-blue-400 italic border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <Italic className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("underline", !activeRegionConfig.underline)}
                      className={`px-3.5 h-full rounded-lg border-l border-transparent hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.underline ? "bg-card text-blue-600 dark:text-blue-400 underline border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <Underline className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Alignment Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Alignment
                  </label>
                  <div className="flex items-center border border-border/60 bg-muted/30 rounded-xl overflow-hidden h-8.5 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("align", "left")}
                      className={`px-3.5 h-full rounded-lg hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.align === "left" ? "bg-card text-blue-600 dark:text-blue-400 border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <AlignLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("align", "center")}
                      className={`px-3.5 h-full rounded-lg border-l border-transparent hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.align === "center" ? "bg-card text-blue-600 dark:text-blue-400 border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <AlignCenter className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveRegion("align", "right")}
                      className={`px-3.5 h-full rounded-lg border-l border-transparent hover:bg-muted text-xs transition-colors cursor-pointer ${
                        activeRegionConfig.align === "right" ? "bg-card text-blue-600 dark:text-blue-400 border border-border/50 shadow-3xs" : "text-muted-foreground"
                      }`}
                    >
                      <AlignRight className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Text Color Selection */}
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Text Color</label>
                  <div className="flex items-center gap-1.5 h-8.5">
                    <Input
                      type="color"
                      value={activeRegionConfig.color}
                      onChange={(e) => updateActiveRegion("color", e.target.value)}
                      className="size-8.5 p-0.5 rounded-xl border border-border/60 cursor-pointer bg-transparent shadow-3xs shrink-0"
                    />
                    <Input
                      type="text"
                      value={activeRegionConfig.color}
                      onChange={(e) => updateActiveRegion("color", e.target.value)}
                      placeholder="#000000"
                      className="text-xs h-8.5 px-2.5 bg-background border border-border/60 rounded-xl font-semibold font-mono w-20 text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Image Uploader & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/40 bg-muted/20 p-4 rounded-2xl shadow-3xs">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Region Image / Logo
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border border-border/60 hover:bg-muted cursor-pointer font-semibold gap-1.5 rounded-xl transition-all"
                      onClick={() => {
                        const fileInput = document.getElementById("region-logo-upload") as HTMLInputElement;
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <Upload className="size-3.5 text-blue-500" />
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
                      className="h-8 text-xs text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60 hover:bg-muted/40 cursor-pointer font-semibold gap-1.5 rounded-xl transition-all"
                      onClick={() => setShowImagePopover(!showImagePopover)}
                    >
                      <ImageIcon className="size-3.5 text-indigo-500" />
                      Paste URL
                    </Button>
                  </div>

                  {showImagePopover && (
                    <div className="flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="text-xs h-8 px-2.5 border border-border/60 bg-background rounded-xl text-foreground flex-1 font-semibold"
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs font-bold rounded-xl"
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

                <div className="flex flex-col justify-center items-end">
                  {activeRegionConfig.image ? (
                    <div className="flex items-center gap-3 border border-border/60 p-1.5 bg-background rounded-xl relative group select-none shadow-3xs transition-all hover:scale-[1.02]">
                      <img
                        src={activeRegionConfig.image}
                        alt="Logo preview"
                        className="h-9 w-auto max-w-[120px] object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => updateActiveRegion("image", null)}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-150"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground/60 italic h-9 flex items-center pr-2 font-medium">
                      No Image / Logo placed
                    </div>
                  )}
                </div>
              </div>

              {/* Text Input area (HTML5 drop target) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Text Template Content
                  </label>
                  <span className="text-[9.5px] text-muted-foreground/50 font-medium">
                    Raw plain text or HTML syntax
                  </span>
                </div>
                <textarea
                  ref={inputRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  value={activeRegionConfig.text}
                  onChange={(e) => updateActiveRegion("text", e.target.value)}
                  placeholder="Insert label, or drag variable chips from the Metadata tab."
                  rows={3}
                  className="w-full p-3 text-xs text-foreground bg-background border border-border/60 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-mono transition-all resize-none shadow-2xs placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>

          {/* Page Setup & margins cross-diagram */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Layout className="size-4 text-blue-500" />
              Page Setup & Geometry
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Page size select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => updateDocSetting("pageSize", e.target.value)}
                  className="h-8.5 border border-border/60 bg-background/50 hover:bg-background transition-colors rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                >
                  <option value="A4">A4 (210mm x 297mm)</option>
                  <option value="LETTER">Letter (8.5in x 11in)</option>
                  <option value="A5">A5 (148mm x 210mm)</option>
                  <option value="LEGAL">Legal (8.5in x 14in)</option>
                  <option value="EXECUTIVE">Executive (7.25in x 10.5in)</option>
                </select>
              </div>

              {/* Page orientation select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Orientation</label>
                <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 h-8.5">
                  <button
                    type="button"
                    onClick={() => updateDocSetting("orientation", "portrait")}
                    className={`py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      orientation === "portrait"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDocSetting("orientation", "landscape")}
                    className={`py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      orientation === "landscape"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Margins fields in visual cross layout */}
            <div className="space-y-3.5">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Custom Page Margins (in mm)
              </label>
              
              <div className="flex items-center justify-center p-3 border border-border/40 bg-muted/20 rounded-2xl">
                <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] items-center">
                  <div />
                  {/* Top margin */}
                  <div className="flex flex-col gap-1 items-center border border-border/60 bg-card p-2 rounded-xl text-center shadow-3xs">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Top</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={margins.top}
                      onChange={(e) => updateMargin("top", parseInt(e.target.value) || 0)}
                      className="w-full text-center bg-transparent border-none text-xs font-bold font-mono text-foreground focus:outline-none"
                    />
                  </div>
                  <div />

                  {/* Left margin */}
                  <div className="flex flex-col gap-1 items-center border border-border/60 bg-card p-2 rounded-xl text-center shadow-3xs">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Left</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={margins.left}
                      onChange={(e) => updateMargin("left", parseInt(e.target.value) || 0)}
                      className="w-full text-center bg-transparent border-none text-xs font-bold font-mono text-foreground focus:outline-none"
                    />
                  </div>
                  {/* Visual Page representation box */}
                  <div className="h-10 border border-dashed border-border/60 rounded-lg flex items-center justify-center bg-background text-[8px] font-bold text-muted-foreground/35 font-mono select-none">
                    Page Layout
                  </div>
                  {/* Right margin */}
                  <div className="flex flex-col gap-1 items-center border border-border/60 bg-card p-2 rounded-xl text-center shadow-3xs">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Right</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={margins.right}
                      onChange={(e) => updateMargin("right", parseInt(e.target.value) || 0)}
                      className="w-full text-center bg-transparent border-none text-xs font-bold font-mono text-foreground focus:outline-none"
                    />
                  </div>

                  <div />
                  {/* Bottom margin */}
                  <div className="flex flex-col gap-1 items-center border border-border/60 bg-card p-2 rounded-xl text-center shadow-3xs">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Bottom</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={margins.bottom}
                      onChange={(e) => updateMargin("bottom", parseInt(e.target.value) || 0)}
                      className="w-full text-center bg-transparent border-none text-xs font-bold font-mono text-foreground focus:outline-none"
                    />
                  </div>
                  <div />
                </div>
              </div>
            </div>
          </div>

          {/* Header & Footer Controls */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Settings className="size-4 text-violet-500" />
              Header & Footer Controls
            </h3>
            
            <div className="space-y-3">
              {/* Exclude first page toggle */}
              <label className="flex items-center justify-between p-3 hover:bg-muted/20 dark:hover:bg-muted/10 rounded-xl cursor-pointer transition-all border border-border/40 bg-muted/5 shadow-3xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-foreground/90 text-xs block">Exclude on First Page</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Hide running headers and footers on the title cover page.</span>
                </div>
                <input
                  type="checkbox"
                  checked={excludeHeaderFooterFirstPage}
                  onChange={(e) => updateDocSetting("excludeHeaderFooterFirstPage", e.target.checked)}
                  className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                />
              </label>

              {/* Mirror margins/headers toggle */}
              <label className="flex items-center justify-between p-3 hover:bg-muted/20 dark:hover:bg-muted/10 rounded-xl cursor-pointer transition-all border border-border/40 bg-muted/5 shadow-3xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-foreground/90 text-xs block">Mirror Odd & Even Spreads</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Swap left and right running regions on even pages (book layout spreads).</span>
                </div>
                <input
                  type="checkbox"
                  checked={mirrorHeaderFooterOddEven}
                  onChange={(e) => updateDocSetting("mirrorHeaderFooterOddEven", e.target.checked)}
                  className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                />
              </label>
            </div>
          </div>

          {/* Header & Footer Divider Lines */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Sliders className="size-4 text-emerald-500" />
              Header & Footer Dividers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Header Divider Line */}
              <div className="border border-border/40 bg-muted/20 p-3.5 rounded-xl space-y-3.5">
                <span className="font-bold text-foreground/90 text-xs block">Header Divider</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Thickness (pt)</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={config.headerDividerWidth !== undefined ? config.headerDividerWidth : 0}
                      onChange={(e) => updateDocSetting("headerDividerWidth", parseFloat(e.target.value) || 0)}
                      className="h-8.5 border border-border/60 bg-background rounded-xl px-2.5 outline-none text-xs font-mono font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Color</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={config.headerDividerColor || "#cbd5e1"}
                        onChange={(e) => updateDocSetting("headerDividerColor", e.target.value)}
                        className="size-8.5 p-0.5 rounded-xl border border-border/60 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Divider Line */}
              <div className="border border-border/40 bg-muted/20 p-3.5 rounded-xl space-y-3.5">
                <span className="font-bold text-foreground/90 text-xs block">Footer Divider</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Thickness (pt)</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={config.footerDividerWidth !== undefined ? config.footerDividerWidth : 0}
                      onChange={(e) => updateDocSetting("footerDividerWidth", parseFloat(e.target.value) || 0)}
                      className="h-8.5 border border-border/60 bg-background rounded-xl px-2.5 outline-none text-xs font-mono font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Color</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={config.footerDividerColor || "#cbd5e1"}
                        onChange={(e) => updateDocSetting("footerDividerColor", e.target.value)}
                        className="size-8.5 p-0.5 rounded-xl border border-border/60 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category 2: Typography */}
      {activeCategory === "typography" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Bold className="size-4 text-indigo-500" />
              Body Typography & Styling
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* Font size select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Base Size</label>
                <select
                  value={bodyFontSize}
                  onChange={(e) => updateDocSetting("bodyFontSize", parseInt(e.target.value))}
                  className="h-8.5 border border-border/60 bg-background/50 hover:bg-background transition-colors rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                >
                  <option value={9}>9 pt</option>
                  <option value={10}>10 pt</option>
                  <option value={11}>11 pt</option>
                  <option value={12}>12 pt</option>
                  <option value={13}>13 pt</option>
                  <option value={14}>14 pt</option>
                </select>
              </div>

              {/* Line height select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Line Height</label>
                <select
                  value={bodyLineHeight}
                  onChange={(e) => updateDocSetting("bodyLineHeight", parseFloat(e.target.value))}
                  className="h-8.5 border border-border/60 bg-background/50 hover:bg-background transition-colors rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                >
                  <option value={1.2}>1.2 (Tight)</option>
                  <option value={1.4}>1.4 (Standard)</option>
                  <option value={1.55}>1.55 (Readable)</option>
                  <option value={1.7}>1.7 (Loose)</option>
                  <option value={1.8}>1.8 (Legal)</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Alignment</label>
                <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 h-8.5">
                  <button
                    type="button"
                    onClick={() => updateDocSetting("bodyAlignment", "left")}
                    className={`flex items-center justify-center gap-1.5 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      bodyAlignment === "left"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <AlignLeft className="size-3.5 text-blue-500" />
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDocSetting("bodyAlignment", "justify")}
                    className={`flex items-center justify-center gap-1.5 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      bodyAlignment === "justify"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <AlignJustify className="size-3.5 text-indigo-500" />
                    Justify
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
              {/* Paragraph spacing */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Paragraph Spacing
                  </label>
                  <span className="text-[10px] font-bold font-mono text-muted-foreground">{paragraphSpacing} pt</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={paragraphSpacing}
                  onChange={(e) => updateDocSetting("paragraphSpacing", parseInt(e.target.value))}
                  className="w-full accent-blue-600 h-1 bg-muted rounded-lg appearance-none cursor-pointer mt-3"
                />
              </div>

              {/* Code block theme */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Code Block Theme</label>
                <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 h-8.5">
                  <button
                    type="button"
                    onClick={() => updateDocSetting("codeBlockTheme", "light")}
                    className={`py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      codeBlockTheme === "light"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    Light Code
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDocSetting("codeBlockTheme", "dark")}
                    className={`py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      codeBlockTheme === "dark"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    VS Code Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Branding Accents */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Sparkles className="size-4 text-indigo-500" />
              Document Branding Accent
            </h3>
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Brand Accent Color</label>
                <div className="flex items-center gap-2 h-8.5">
                  <Input
                    type="color"
                    value={config.accentColor || "#3b82f6"}
                    onChange={(e) => updateDocSetting("accentColor", e.target.value)}
                    className="size-8.5 p-0.5 rounded-xl border border-border/60 cursor-pointer bg-transparent shadow-3xs shrink-0"
                  />
                  <Input
                    type="text"
                    value={config.accentColor || "#3b82f6"}
                    onChange={(e) => updateDocSetting("accentColor", e.target.value)}
                    placeholder="#3b82f6"
                    className="text-xs h-8.5 px-2.5 bg-background border border-border/60 rounded-xl font-semibold font-mono w-28 text-foreground"
                  />
                </div>
              </div>

              {/* Heading breaks */}
              <label className="flex items-center justify-between p-3 hover:bg-muted/20 dark:hover:bg-muted/10 rounded-xl cursor-pointer transition-all border border-border/40 bg-muted/5 shadow-3xs flex-1">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-foreground/90 text-xs block">Page Break before H1</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Force chapters or major titles to start on a new page.</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!config.headingPageBreak}
                  onChange={(e) => updateDocSetting("headingPageBreak", e.target.checked)}
                  className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Category 3: Metadata and Security */}
      {activeCategory === "metadata" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Preset Templates */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Sparkles className="size-4 text-amber-500" />
              Document Layout Presets
            </h3>
            <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {Object.keys(TEMPLATES).map((tId) => {
                const isActive = activeTemplate === tId;
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => handleTemplateSelect(tId)}
                    className={`group relative flex flex-col p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-blue-650 bg-blue-500/5 dark:bg-blue-500/5 shadow-sm text-foreground"
                        : "border-border/60 hover:border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold capitalize tracking-tight flex items-center gap-1.5">
                        <Sparkles
                          className={`size-3.5 ${
                            isActive
                              ? "text-blue-500 fill-blue-500/10"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {tId}
                      </span>
                      {isActive ? (
                        <span className="flex items-center justify-center size-4 rounded-full bg-blue-600 text-white text-[8px] shadow-sm shadow-blue-500/20">
                          <Check className="size-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold border border-border/80 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider scale-95">
                          Apply
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/80 mt-1.5 font-medium leading-relaxed">
                      {tId === "minimal" && "Clean layout with subtle dividers and running titles."}
                      {tId === "academic" && "Traditional style with serif center titles and double borders."}
                      {tId === "corporate" && "Structured headers with upper bold corporate fields."}
                      {tId === "book" && "Mirror style margin layout mimicking physical book spreads."}
                      {tId === "report" && "Standard design containing report meta, date and dividers."}
                      {tId === "resume" && "Bold header block emphasizing name and CV status."}
                      {tId === "legal" && "Structured headers and NDA clauses wrapped in borders."}
                    </p>

                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {tId === "book" && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10">
                          Mirror spreads
                        </span>
                      )}
                      {(tId === "academic" || tId === "book" || tId === "resume") && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10">
                          Hide first page
                        </span>
                      )}
                      {tId === "corporate" && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10">
                          Confidentiality
                        </span>
                      )}
                      {tId === "report" && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                          Cover Page
                        </span>
                      )}
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-muted/65 text-muted-foreground border border-border/30 capitalize">
                        {TEMPLATES[tId].pageSize} Layout
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variables Library */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-3 shadow-sm ring-1 ring-border/20">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-xs flex items-center gap-2 uppercase tracking-wider">
                <GripVertical className="size-4 text-blue-500" />
                Drag-and-Drop Variables
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="focus:outline-none">
                    <Info className="size-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-help" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-slate-955 text-white border border-border/40 p-2.5 text-xs rounded-lg shadow-xl">
                  Drag a chip into the composer textarea in the Page Layout tab, or click to insert it directly.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium">
              Copy dynamic fields that automatically resolve during document printing:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {VARIABLES.map((v) => (
                <div
                  key={v.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, v.token)}
                  onClick={() => insertVariable(v.token)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-semibold rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-3xs hover:shadow-xs cursor-grab active:cursor-grabbing group select-none"
                >
                  <GripVertical className="size-3 text-muted-foreground/40 group-hover:text-blue-500/50 transition-colors" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
                  {v.label}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Formatting */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Type className="size-4 text-blue-500" />
              Advanced Pagination Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Numbering Format</label>
                <select
                  value={config.pageNumberFormat || "arabic"}
                  onChange={(e) => updateDocSetting("pageNumberFormat", e.target.value)}
                  className="h-8.5 border border-border/60 bg-background/50 hover:bg-background transition-colors rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                >
                  <option value="arabic">Arabic (1, 2, 3)</option>
                  <option value="roman">Roman Numerals (I, II, III)</option>
                  <option value="alphabetical">Alphabetical (A, B, C)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Start Page Offset</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.pageNumberStart !== undefined ? config.pageNumberStart : 1}
                  onChange={(e) => updateDocSetting("pageNumberStart", parseInt(e.target.value) || 1)}
                  className="h-8.5 border border-border/60 bg-background/50 hover:bg-background transition-colors rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Cover Page Toggle */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Layout className="size-4 text-emerald-500" />
              Document Cover Option
            </h3>
            <label className="flex items-center justify-between p-3 hover:bg-muted/20 dark:hover:bg-muted/10 rounded-xl cursor-pointer transition-all border border-border/40 bg-muted/5 shadow-3xs">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-foreground/90 text-xs block">Auto Cover Page</span>
                <span className="text-[10px] text-muted-foreground font-medium">Auto-generate a beautiful document title cover sheet from metadata frontmatter.</span>
              </div>
              <input
                type="checkbox"
                checked={autoCoverPage}
                onChange={(e) => updateDocSetting("autoCoverPage", e.target.checked)}
                className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
              />
            </label>
          </div>

          {/* Watermark Configuration */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <ShieldCheck className="size-4 text-red-500" />
              Document Security Watermarks
            </h3>
            <div className="border border-border/40 bg-muted/20 p-4 rounded-2xl space-y-4 shadow-3xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Diagonal Watermark Text
                </label>
                <Input
                  type="text"
                  placeholder="e.g. DRAFT, CONFIDENTIAL"
                  value={watermarkText}
                  onChange={(e) => updateDocSetting("watermarkText", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>

              {watermarkText.trim() !== "" && (
                <div className="flex flex-col gap-1.5 pt-1 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                      Watermark Opacity
                    </label>
                    <span className="text-[10px] font-bold font-mono text-muted-foreground">{(watermarkOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.25"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) => updateDocSetting("watermarkOpacity", parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-1 bg-muted rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PDF Metadata Properties */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <Info className="size-4 text-violet-500" />
              PDF Metadata Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                <Input
                  type="text"
                  placeholder="e.g. Project Proposal"
                  value={config.subject || ""}
                  onChange={(e) => updateDocSetting("subject", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Keywords</label>
                <Input
                  type="text"
                  placeholder="e.g. Report, Business"
                  value={config.keywords || ""}
                  onChange={(e) => updateDocSetting("keywords", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Creator Tool</label>
                <Input
                  type="text"
                  placeholder="e.g. Manus Compiler"
                  value={config.creator || "Manus MD Editor"}
                  onChange={(e) => updateDocSetting("creator", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* PDF Password & Security Permissions */}
          <div className="border border-border/80 bg-card rounded-2xl p-5 space-y-4 shadow-sm ring-1 ring-border/20">
            <h3 className="font-bold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3 uppercase tracking-wider">
              <ShieldCheck className="size-4 text-red-500" />
              PDF Passwords & Permissions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">User Password (To Open)</label>
                <Input
                  type="password"
                  placeholder="Leave empty for public"
                  value={config.userPassword || ""}
                  onChange={(e) => updateDocSetting("userPassword", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Owner Password (To Modify)</label>
                <Input
                  type="password"
                  placeholder="Restricts permission overrides"
                  value={config.ownerPassword || ""}
                  onChange={(e) => updateDocSetting("ownerPassword", e.target.value)}
                  className="h-8.5 text-xs bg-background text-foreground border border-border/60 rounded-xl px-3 font-semibold"
                />
              </div>
            </div>

            <div className="border border-border/40 bg-muted/20 p-4 rounded-2xl space-y-3.5">
              <span className="font-bold text-foreground/90 text-xs block">Security Permissions</span>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Printing Permission</label>
                <select
                  value={config.allowPrinting || "highResolution"}
                  onChange={(e) => updateDocSetting("allowPrinting", e.target.value)}
                  className="h-8.5 border border-border/60 bg-background rounded-xl px-3 outline-none text-foreground text-xs focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                >
                  <option value="none">No Printing Allowed</option>
                  <option value="lowResolution">Low Resolution Print Only</option>
                  <option value="highResolution">High Resolution Print Allowed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                <label className="flex items-center justify-between p-3 hover:bg-background rounded-xl cursor-pointer transition-all border border-border/40 bg-card shadow-3xs">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-bold text-foreground/90 text-[11px] block">Allow Copying</span>
                    <span className="text-[9px] text-muted-foreground leading-normal">Allows text extraction.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowCopying !== undefined ? config.allowCopying : true}
                    onChange={(e) => updateDocSetting("allowCopying", e.target.checked)}
                    className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-background rounded-xl cursor-pointer transition-all border border-border/40 bg-card shadow-3xs">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-bold text-foreground/90 text-[11px] block">Allow Modifying</span>
                    <span className="text-[9px] text-muted-foreground leading-normal">Allows changing content.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowModifying !== undefined ? config.allowModifying : true}
                    onChange={(e) => updateDocSetting("allowModifying", e.target.checked)}
                    className="size-4.5 rounded-lg border-border text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category 4: Advanced Scoped CSS Code Area */}
      {activeCategory === "css" && (
        <div className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-200 ring-1 ring-border/20">
          <div className="px-4.5 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileCode className="size-4 text-violet-500" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Advanced Document CSS
              </span>
            </div>
            <span className="text-[9.5px] text-muted-foreground/50 font-mono font-medium">
              Target selectors .header and .footer
            </span>
          </div>
          <div className="p-4 bg-muted/5 space-y-4">
            <div className="rounded-xl overflow-hidden border border-border bg-background/50 shadow-3xs">
              <CodeMirror
                value={config.advancedCss}
                height="320px"
                theme={resolvedTheme === "dark" ? vscodeDark : vscodeLight}
                onChange={(value) => {
                  const newConfig = { ...config, advancedCss: value };
                  saveConfig(newConfig);
                }}
                className="text-xs font-mono"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/80 flex items-start gap-1.5 leading-relaxed font-medium">
              <Info className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
              CSS styles compiled here are isolated to A4 compiler layouts. Scoped selectors allow formatting of running borders, custom margins, and custom text transformation colors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
