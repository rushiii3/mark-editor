"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
  Info,
  Palette,
  Eye,
  Download,
  Trash2,
  FileCode,
  Layout,
  Upload,
  Globe,
  Sliders,
  Copy,
  FileText
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useFileStore } from "@/store/file-store";
import { getSetting, setSetting } from "@/db/setting";

// Define Config Types
interface RegionConfig {
  text: string;
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  align: "left" | "center" | "right";
  image: string | null;
}

interface LayoutConfig {
  header: {
    left: RegionConfig;
    center: RegionConfig;
    right: RegionConfig;
  };
  footer: {
    left: RegionConfig;
    center: RegionConfig;
    right: RegionConfig;
  };
  advancedCss: string;
  activeTemplate?: string;
}

// Preset Layout Templates
const TEMPLATES: Record<string, LayoutConfig> = {
  minimal: {
    header: {
      left: { text: "{{title}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "{{date}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    advancedCss: `/* Scoped Minimal Layout Styles */
.header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 20px;
}

.footer {
  border-top: 1px solid var(--border);
  padding-top: 6px;
  margin-top: 20px;
}`
  },
  academic: {
    header: {
      left: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#1e293b", align: "left", image: null },
      center: { text: "{{title}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: true, italic: true, underline: false, color: "#1e293b", align: "center", image: null },
      right: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#1e293b", align: "right", image: null }
    },
    footer: {
      left: { text: "Author: {{author}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "Page {{page}} of {{pages}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    advancedCss: `/* Scoped Academic Layout Styles */
.header {
  border-bottom: 1px double #94a3b8;
  padding-bottom: 4px;
  margin-bottom: 25px;
}

.footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 6px;
  margin-top: 25px;
}`
  },
  corporate: {
    header: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#0f172a", align: "left", image: null },
      center: { text: "{{company}}", fontFamily: "Inter", fontSize: "10pt", bold: true, italic: false, underline: false, color: "#0f172a", align: "center", image: null },
      right: { text: "Version {{version}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    footer: {
      left: { text: "CONFIDENTIAL - BUSINESS USE ONLY", fontFamily: "Inter", fontSize: "8pt", bold: true, italic: false, underline: false, color: "#ef4444", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#0f172a", align: "right", image: null }
    },
    advancedCss: `/* Scoped Corporate Layout Styles */
.header {
  border-bottom: 2px solid #0f172a;
  padding-bottom: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
  margin-top: 24px;
}`
  },
  book: {
    header: {
      left: { text: "Chapter 1: Introduction", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: true, underline: false, color: "#334155", align: "left", image: null },
      center: { text: "", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#334155", align: "center", image: null },
      right: { text: "{{title}}", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#334155", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "{{page}}", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    advancedCss: `/* Scoped Book Design Styles */
.header {
  border-bottom: 0.5px solid #94a3b8;
  padding-bottom: 6px;
  margin-bottom: 30px;
}

.footer {
  padding-top: 12px;
  margin-top: 30px;
}`
  },
  report: {
    header: {
      left: { text: "{{file_name}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "{{date}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    footer: {
      left: { text: "{{company}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    advancedCss: `/* Scoped Report Layout Styles */
.header {
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 22px;
}

.footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 8px;
  margin-top: 22px;
}`
  },
  resume: {
    header: {
      left: { text: "{{author}}", fontFamily: "Inter", fontSize: "14pt", bold: true, italic: false, underline: false, color: "#1d4ed8", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "Curriculum Vitae", fontFamily: "Inter", fontSize: "10pt", bold: false, italic: true, underline: false, color: "#475569", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "Page {{page}} of {{pages}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    advancedCss: `/* Scoped Resume Layout Styles */
.header {
  border-bottom: 2px solid #2563eb;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 6px;
  margin-top: 20px;
}`
  },
  legal: {
    header: {
      left: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "CONTRACT OF SERVICE", fontFamily: "Courier New", fontSize: "10pt", bold: true, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    footer: {
      left: { text: "CONFIDENTIAL & PRIVILEGED", fontFamily: "Courier New", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    advancedCss: `/* Scoped Legal Document Styles */
.header {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 4px 0;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.footer {
  border-top: 1px solid #000;
  padding-top: 6px;
  margin-top: 30px;
}`
  }
};

const VARIABLES = [
  { id: "title", label: "Title", token: "{{title}}" },
  { id: "file_name", label: "File Name", token: "{{file_name}}" },
  { id: "author", label: "Author", token: "{{author}}" },
  { id: "company", label: "Company", token: "{{company}}" },
  { id: "date", label: "Current Date", token: "{{date}}" },
  { id: "time", label: "Current Time", token: "{{time}}" },
  { id: "page", label: "Page Number", token: "{{page}}" },
  { id: "pages", label: "Total Pages", token: "{{pages}}" },
  { id: "version", label: "Version", token: "{{version}}" }
];

const FONTS = [
  "Inter",
  "Outfit",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Helvetica",
  "Arial",
  "Fira Code"
];

const FONT_SIZES = [
  "8pt",
  "9pt",
  "9.5pt",
  "10pt",
  "11pt",
  "12pt",
  "14pt",
  "16pt"
];

export default function HeaderFooterEditor() {
  const { resolvedTheme } = useTheme();

  // Load project files & active document state from Zustand store
  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  // Layout States
  const [config, setConfig] = useState<LayoutConfig>(TEMPLATES.minimal);
  const [activeTemplate, setActiveTemplate] = useState<string>("minimal");

  // Selection States
  const [selectedSection, setSelectedSection] = useState<"header" | "footer">("header");
  const [selectedRegion, setSelectedRegion] = useState<"left" | "center" | "right">("left");

  // Preview Page Number State
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(true);

  // Custom image paste url
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [showImagePopover, setShowImagePopover] = useState<boolean>(false);

  // Export modal state (mock export)
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportType, setExportType] = useState<"pdf" | "html" | null>(null);

  // Textarea input ref for cursor variable insertion
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Get active file name to display
  const activeFileName = files.find((f) => f.id === editingFileId)?.name || "Default document";

  // Mock metadata values mapping to active file name
  const metadataMocks = {
    title: files.find((f) => f.id === editingFileId)?.name.replace(/\.[^/.]+$/, "") || "Manus Document",
    file_name: files.find((f) => f.id === editingFileId)?.name || "document.md",
    author: "Sarah Connor",
    company: "Cyberdyne Systems Corp",
    version: "v2.0.4",
    date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    pages: "3"
  };

  // Sync activeFileId from store as the default target
  useEffect(() => {
    if (activeFileId && !editingFileId) {
      setEditingFileId(activeFileId);
    } else if (files.length > 0 && !editingFileId) {
      setEditingFileId(files[0].id);
    }
  }, [activeFileId, files, editingFileId]);

  // Load layout configuration from IndexedDB whenever editingFileId changes
  useEffect(() => {
    if (!editingFileId) return;

    const loadConfig = async () => {
      try {
        const saved = await getSetting<LayoutConfig>(`document-layout:${editingFileId}`);
        if (saved) {
          setConfig(saved);
          setActiveTemplate(saved.activeTemplate || "custom");
        } else {
          // Fallback to default template if none saved yet
          setConfig(TEMPLATES.minimal);
          setActiveTemplate("minimal");
        }
      } catch (err) {
        console.error("Failed to load layout from DB", err);
        toast.error("Failed to retrieve saved settings.");
      }
    };

    loadConfig();
  }, [editingFileId]);

  // Async save configuration to IndexedDB setting
  const saveConfig = async (newConfig: LayoutConfig, templateId?: string) => {
    setConfig(newConfig);
    const resolvedTemplate = templateId || activeTemplate;
    if (editingFileId) {
      try {
        await setSetting(`document-layout:${editingFileId}`, {
          ...newConfig,
          activeTemplate: resolvedTemplate
        });
      } catch (err) {
        console.error("Failed to save layout to DB", err);
      }
    }
  };

  // Apply layout config to all documents in IndexedDB
  const handleApplyToAll = async () => {
    if (!editingFileId || files.length === 0) return;
    try {
      toast.loading("Applying layout configuration to all files...");
      for (const file of files) {
        await setSetting(`document-layout:${file.id}`, {
          ...config,
          activeTemplate
        });
      }
      toast.dismiss();
      toast.success(`Applied the current layout configuration to all ${files.length} documents!`);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to copy settings to all documents.");
      console.error(err);
    }
  };

  // Switch templates
  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES[templateId];
    if (template) {
      setActiveTemplate(templateId);
      saveConfig(template, templateId);
      toast.success(`Applied ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} layout template!`);
    }
  };

  // Get active editing region configuration
  const activeRegionConfig = config[selectedSection][selectedRegion];

  // Update active region styles
  const updateActiveRegion = (key: keyof RegionConfig, value: unknown) => {
    const newConfig = { ...config };
    newConfig[selectedSection] = {
      ...newConfig[selectedSection],
      [selectedRegion]: {
        ...newConfig[selectedSection][selectedRegion],
        [key]: value
      }
    };
    saveConfig(newConfig);
  };

  // CSS compiler - prefix all selectors inside advanced CSS with #a4-preview-page to isolate styles
  const compileScopedCss = useCallback((rawCss: string) => {
    if (!rawCss) return "";
    return rawCss
      .replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match, selector) => {
        const trimmed = selector.trim();
        if (trimmed.startsWith("@") || trimmed.startsWith("#a4-preview-page")) {
          return match;
        }
        const scopedSelector = trimmed
          .split(",")
          .map((s: string) => `#a4-preview-page ${s.trim()}`)
          .join(", ");
        return scopedSelector + match.slice(selector.length);
      });
  }, []);

  // Variable Insertion at caret position
  const insertVariable = (token: string) => {
    const textarea = inputRef.current;
    if (!textarea) {
      updateActiveRegion("text", activeRegionConfig.text + token);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeRegionConfig.text;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = before + token + after;
    updateActiveRegion("text", newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 50);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, token: string) => {
    e.dataTransfer.setData("text/plain", token);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const token = e.dataTransfer.getData("text/plain");
    if (token) {
      insertVariable(token);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Local Image Upload Handler
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file is too large (max 2MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateActiveRegion("image", event.target.result as string);
          toast.success("Logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Replace variables inside text templates for live preview
  const resolveTemplateVariables = (templateText: string, pageNum: number) => {
    let resolved = templateText;
    resolved = resolved.replace(/\{\{title\}\}/gi, metadataMocks.title);
    resolved = resolved.replace(/\{\{file_name\}\}/gi, metadataMocks.file_name);
    resolved = resolved.replace(/\{\{author\}\}/gi, metadataMocks.author);
    resolved = resolved.replace(/\{\{company\}\}/gi, metadataMocks.company);
    resolved = resolved.replace(/\{\{version\}\}/gi, metadataMocks.version);
    resolved = resolved.replace(/\{\{date\}\}/gi, metadataMocks.date);
    resolved = resolved.replace(/\{\{time\}\}/gi, metadataMocks.time);
    resolved = resolved.replace(/\{\{pages\}\}/gi, metadataMocks.pages);
    resolved = resolved.replace(/\{\{page\}\}/gi, pageNum.toString());
    return resolved;
  };

  // Mock Export Execution
  const triggerMockExport = (type: "pdf" | "html") => {
    setIsExporting(true);
    setExportProgress(10);
    setExportType(type);

    const intervals = [
      { prg: 35, delay: 600 },
      { prg: 70, delay: 1300 },
      { prg: 90, delay: 1800 },
      { prg: 100, delay: 2400 }
    ];

    intervals.forEach(({ prg, delay }) => {
      setTimeout(() => {
        setExportProgress(prg);
        if (prg === 100) {
          setTimeout(() => {
            setIsExporting(false);
            setExportType(null);
            toast.success(`Successfully compiled and exported document as ${type.toUpperCase()}!`, {
              description: `Headers & footers compiled into layout.`
            });
          }, 300);
        }
      }, delay);
    });
  };

  // Reset page layout to minimal defaults
  const handleReset = () => {
    setActiveTemplate("minimal");
    saveConfig(TEMPLATES.minimal, "minimal");
    toast.success("Editor reset to minimal default layout!");
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Dynamic Scoped Stylesheet Injection */}
      <style dangerouslySetInnerHTML={{ __html: compileScopedCss(config.advancedCss) }} />

      {/* Header Bar */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b px-6 bg-card/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Button asChild size="icon-sm" variant="ghost" className="rounded-lg">
            <Link href="/editor">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none tracking-tight">Manus Publisher</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Layout Selector & Formatting</p>
            </div>
          </div>
        </div>

        {/* Project Selector & Apply utilities */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-border/80 bg-muted/20 px-2.5 py-1 rounded-lg">
            <FileText className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Editing File:</span>
            {files.length > 0 ? (
              <select
                value={editingFileId || ""}
                onChange={(e) => setEditingFileId(e.target.value)}
                className="text-xs bg-transparent font-medium border-none outline-none text-foreground py-0.5 cursor-pointer"
              >
                {files.map((file) => (
                  <option key={file.id} value={file.id} className="bg-card text-foreground">
                    {file.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-semibold italic text-muted-foreground">No files loaded</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleApplyToAll}
            disabled={files.length <= 1}
            className="text-xs border border-border/30 hover:border-border/80 gap-1.5 transition-all"
          >
            <Copy className="size-3.5" />
            Apply to All
          </Button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs hover:bg-destructive/10 hover:text-destructive transition-colors gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Reset Design
          </Button>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Export Dropdowns */}
          <Button
            onClick={() => triggerMockExport("pdf")}
            size="sm"
            className="text-xs font-semibold gap-1.5 cursor-pointer shadow-md shadow-primary/20 hover:scale-[1.01] transition-transform"
          >
            <Download className="size-3.5" />
            Export PDF
          </Button>
          <Button
            onClick={() => triggerMockExport("html")}
            variant="outline"
            size="sm"
            className="text-xs hover:bg-accent hover:text-accent-foreground cursor-pointer gap-1.5"
          >
            <Globe className="size-3.5" />
            Export HTML
          </Button>
        </div>
      </header>

      {/* Three-Column Workspace using Resizable panels */}
      <div className="flex-1 min-h-0 relative">
        <ResizablePanelGroup orientation="horizontal">

          {/* Left Sidebar (23%) */}
          <ResizablePanel defaultSize={23} minSize={20} maxSize={30} className="flex flex-col bg-card/40 border-r border-border/80">
            <div className="flex-1 overflow-y-auto p-4 space-y-5 select-none custom-scrollbar">

              {/* Section 1: Selector Tabs */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Target Component
                </label>
                <div className="grid grid-cols-2 gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/30">
                  <button
                    onClick={() => { setSelectedSection("header"); setSelectedRegion("left"); }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md transition-all font-medium ${
                      selectedSection === "header"
                        ? "bg-card text-foreground shadow-xs border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Layout className="size-3.5 rotate-180" />
                    Header
                  </button>
                  <button
                    onClick={() => { setSelectedSection("footer"); setSelectedRegion("left"); }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md transition-all font-medium ${
                      selectedSection === "footer"
                        ? "bg-card text-foreground shadow-xs border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Layout className="size-3.5" />
                    Footer
                  </button>
                </div>
              </div>

              {/* Section 2: Variable Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Drag-and-Drop Variables
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-muted-foreground/60 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs bg-slate-900 text-white p-2 text-xs rounded">
                      Drag a chip into the textarea, or click one to insert it at your cursor.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-normal">
                  Incorporate dynamic fields into document headers and footers:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {VARIABLES.map((v) => (
                    <div
                      key={v.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, v.token)}
                      onClick={() => insertVariable(v.token)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border border-border bg-background hover:border-primary hover:text-primary transition-all shadow-2xs hover:shadow-sm cursor-grab active:cursor-grabbing select-none group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {v.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Templates gallery */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Preset Templates
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(TEMPLATES).map((tId) => {
                    const isActive = activeTemplate === tId;
                    return (
                      <button
                        key={tId}
                        onClick={() => handleTemplateSelect(tId)}
                        className={`group relative flex flex-col p-3 rounded-xl border text-left transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm text-foreground"
                            : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-semibold capitalize tracking-tight flex items-center gap-1.5">
                            <Sparkles className={`size-3.5 ${isActive ? "text-primary fill-primary/10" : "text-muted-foreground group-hover:text-foreground"}`} />
                            {tId}
                          </span>
                          {isActive && (
                            <span className="flex items-center justify-center size-4 rounded-full bg-primary text-primary-foreground text-[8px]">
                              <Check className="size-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground/75 mt-1 font-normal leading-normal">
                          {tId === "minimal" && "Clean layout with subtle dividers and running titles."}
                          {tId === "academic" && "Traditional style with serif center titles and double borders."}
                          {tId === "corporate" && "Structured headers with upper bold corporate fields."}
                          {tId === "book" && "Mirror style margin layout mimicking physical book spreads."}
                          {tId === "report" && "Standard design containing report meta, date and dividers."}
                          {tId === "resume" && "Bold header block emphasizing name and CV status."}
                          {tId === "legal" && "Structured headers and NDA clauses wrapped in borders."}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel (Editor Canvas) (42%) */}
          <ResizablePanel defaultSize={42} minSize={35} className="flex flex-col bg-background">
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
                          onClick={() => { setSelectedSection("header"); setSelectedRegion(region); }}
                          className={`flex flex-col items-center justify-center h-16 p-2 rounded-lg border text-center transition-all ${
                            isTarget
                              ? "border-primary bg-primary/5 text-primary shadow-xs"
                              : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{region}</span>
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
                          onClick={() => { setSelectedSection("footer"); setSelectedRegion(region); }}
                          className={`flex flex-col items-center justify-center h-16 p-2 rounded-lg border text-center transition-all ${
                            isTarget
                              ? "border-primary bg-primary/5 text-primary shadow-xs"
                              : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{region}</span>
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
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Font Family</label>
                      <select
                        value={activeRegionConfig.fontFamily}
                        onChange={(e) => updateActiveRegion("fontFamily", e.target.value)}
                        className="w-full text-xs h-7 px-2 border border-border bg-background rounded-md outline-none focus:border-primary"
                      >
                        {FONTS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    {/* Font size selection */}
                    <div className="flex flex-col gap-1 min-w-[80px]">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Font Size</label>
                      <select
                        value={activeRegionConfig.fontSize}
                        onChange={(e) => updateActiveRegion("fontSize", e.target.value)}
                        className="w-full text-xs h-7 px-2 border border-border bg-background rounded-md outline-none focus:border-primary"
                      >
                        {FONT_SIZES.map((fs) => (
                          <option key={fs} value={fs}>{fs}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bold / Italic / Underline Toggles */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Weights</label>
                      <div className="flex items-center border border-border bg-background rounded-md overflow-hidden h-7">
                        <button
                          onClick={() => updateActiveRegion("bold", !activeRegionConfig.bold)}
                          className={`px-2 h-full hover:bg-muted text-xs transition-colors ${
                            activeRegionConfig.bold ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                          }`}
                        >
                          <Bold className="size-3.5" />
                        </button>
                        <button
                          onClick={() => updateActiveRegion("italic", !activeRegionConfig.italic)}
                          className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors ${
                            activeRegionConfig.italic ? "bg-primary/10 text-primary italic" : "text-muted-foreground"
                          }`}
                        >
                          <Italic className="size-3.5" />
                        </button>
                        <button
                          onClick={() => updateActiveRegion("underline", !activeRegionConfig.underline)}
                          className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors ${
                            activeRegionConfig.underline ? "bg-primary/10 text-primary underline" : "text-muted-foreground"
                          }`}
                        >
                          <Underline className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Alignment Selection */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Alignment</label>
                      <div className="flex items-center border border-border bg-background rounded-md overflow-hidden h-7">
                        <button
                          onClick={() => updateActiveRegion("align", "left")}
                          className={`px-2 h-full hover:bg-muted text-xs transition-colors ${
                            activeRegionConfig.align === "left" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <AlignLeft className="size-3.5" />
                        </button>
                        <button
                          onClick={() => updateActiveRegion("align", "center")}
                          className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors ${
                            activeRegionConfig.align === "center" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <AlignCenter className="size-3.5" />
                        </button>
                        <button
                          onClick={() => updateActiveRegion("align", "right")}
                          className={`px-2 h-full border-l border-border hover:bg-muted text-xs transition-colors ${
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
                                toast.success("Logo link applied!");
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel (Real-Time A4 Simulation) (35%) */}
          <ResizablePanel defaultSize={35} minSize={30} className="flex flex-col bg-muted/30 relative">

            {/* Top Toolbar */}
            <div className="h-11 border-b border-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 select-none">
                <Eye className="size-3.5 text-primary" />
                <span className="text-xs font-semibold">Print Visualizer (A4)</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Guide Toggles */}
                <button
                  onClick={() => setShowMarginGuides(!showMarginGuides)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all font-medium ${
                    showMarginGuides
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Margins
                </button>

                {/* Page switcher */}
                <div className="flex items-center bg-background border border-border rounded overflow-hidden text-xs">
                  <button
                    disabled={previewPage <= 1}
                    onClick={() => setPreviewPage(p => p - 1)}
                    className="px-2 py-0.5 border-r border-border hover:bg-muted text-[10px] disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="px-2 font-mono text-[10px] font-semibold">Page {previewPage}/3</span>
                  <button
                    disabled={previewPage >= 3}
                    onClick={() => setPreviewPage(p => p + 1)}
                    className="px-2 py-0.5 border-l border-border hover:bg-muted text-[10px] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Document sheet workspace (Dotted canvas) */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]">

              {/* Simulated physical A4 Paper */}
              <div
                id="a4-preview-page"
                className="relative bg-white dark:bg-white text-black shadow-2xl rounded-sm transition-all overflow-hidden flex flex-col p-[20mm_18mm_22mm_18mm] select-none"
                style={{
                  width: "595px",
                  minHeight: "842px",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
                }}
              >

                {/* Margin Guides overlays */}
                {showMarginGuides && (
                  <div className="absolute inset-[20mm_18mm_22mm_18mm] border border-dashed border-sky-300/35 pointer-events-none rounded-[1px] before:content-['Margin_Limit'] before:absolute before:-top-4 before:left-0 before:text-[7px] before:font-mono before:text-sky-400/60" />
                )}

                {/* Scoped Running Header */}
                <div className="header flex justify-between items-center w-full min-h-6 shrink-0 relative select-none z-10">
                  {/* Left region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.header.left.fontFamily,
                      fontSize: config.header.left.fontSize,
                      fontWeight: config.header.left.bold ? "bold" : "normal",
                      fontStyle: config.header.left.italic ? "italic" : "normal",
                      textDecoration: config.header.left.underline ? "underline" : "none",
                      color: config.header.left.color,
                      justifyContent: config.header.left.align === "right" ? "flex-end" : config.header.left.align === "center" ? "center" : "flex-start"
                    }}
                  >
                    {config.header.left.image && (
                      <img src={config.header.left.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.header.left.text, previewPage)}</span>
                  </div>

                  {/* Center region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.header.center.fontFamily,
                      fontSize: config.header.center.fontSize,
                      fontWeight: config.header.center.bold ? "bold" : "normal",
                      fontStyle: config.header.center.italic ? "italic" : "normal",
                      textDecoration: config.header.center.underline ? "underline" : "none",
                      color: config.header.center.color,
                      justifyContent: config.header.center.align === "right" ? "flex-end" : config.header.center.align === "left" ? "flex-start" : "center"
                    }}
                  >
                    {config.header.center.image && (
                      <img src={config.header.center.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.header.center.text, previewPage)}</span>
                  </div>

                  {/* Right region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.header.right.fontFamily,
                      fontSize: config.header.right.fontSize,
                      fontWeight: config.header.right.bold ? "bold" : "normal",
                      fontStyle: config.header.right.italic ? "italic" : "normal",
                      textDecoration: config.header.right.underline ? "underline" : "none",
                      color: config.header.right.color,
                      justifyContent: config.header.right.align === "left" ? "flex-start" : config.header.right.align === "center" ? "center" : "flex-end"
                    }}
                  >
                    {config.header.right.image && (
                      <img src={config.header.right.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.header.right.text, previewPage)}</span>
                  </div>
                </div>

                {/* Sample Document Body Content */}
                <div className="flex-1 overflow-hidden py-4 text-slate-800 text-[10px] leading-relaxed relative flex flex-col justify-start">

                  {/* Dynamic mock page contents based on current selected previewPage */}
                  {previewPage === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">Report Chapter I</span>
                        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">{metadataMocks.title}</h1>
                        <p className="text-[8.5px] text-slate-500 font-mono">Prepared by: {metadataMocks.author} | {metadataMocks.date}</p>
                      </div>

                      <div className="w-8 h-1 bg-slate-900 rounded" />

                      <div className="space-y-2">
                        <h2 className="text-[11px] font-bold text-slate-900">1. Executive Summary</h2>
                        <p className="text-[9.5px] text-slate-650 leading-normal">
                          This proposal outlines the implementation of a professional **Header and Footer Editor** for the premium offline-first Markdown studio. By creating a layout visualizer that mirrors physical document ratios, users gain immediate design assurance before printing or compiling.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-[11px] font-bold text-slate-900">2. Core Technical Architecture</h2>
                        <p className="text-[9.5px] text-slate-650 leading-normal">
                          The editor utilizes **Zustand** client-side stores to maintain configuration settings, which serialize cleanly into IndexedDB parameters. Document variables map to Markdown frontmatter headers, matching compiler states seamlessly.
                        </p>

                        <div className="border border-slate-200 bg-slate-50 p-2 rounded font-mono text-[8px] text-slate-700 space-y-1 leading-normal">
                          <div><span className="text-amber-600">const</span> compile = (md) =&gt; &#123;</div>
                          <div className="pl-3"><span className="text-amber-600">const</span> frontmatter = parse(md);</div>
                          <div className="pl-3"><span className="text-amber-600">return</span> injectTemplates(frontmatter, layoutConfig);</div>
                          <div>&#125;;</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewPage === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">Report Chapter II</span>
                        <h1 className="text-[14px] font-bold text-slate-900 tracking-tight">Milestones & Integration Metrics</h1>
                      </div>

                      <div className="w-8 h-0.5 bg-slate-950" />

                      <p className="text-[9.5px] text-slate-650">
                        The layout presets provide direct mapping options that change compilation boundaries instantly. Verification statistics are updated daily on document saves:
                      </p>

                      {/* Mock Structured Table */}
                      <table className="w-full border-collapse text-[8.5px] text-slate-700">
                        <thead>
                          <tr className="border-b-2 border-slate-300 font-bold bg-slate-50">
                            <th className="py-1 px-2 text-left">Milestone Phase</th>
                            <th className="py-1 px-2 text-left">System API</th>
                            <th className="py-1 px-2 text-right">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 px-2 font-medium">Layout Engine</td>
                            <td className="py-1 px-2 font-mono text-[7.5px]">@react-pdf/renderer</td>
                            <td className="py-1 px-2 text-right text-emerald-600 font-semibold">100% Completed</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 px-2 font-medium">Code Editor Integration</td>
                            <td className="py-1 px-2 font-mono text-[7.5px]">@uiw/react-codemirror</td>
                            <td className="py-1 px-2 text-right text-emerald-600 font-semibold">100% Completed</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 px-2 font-medium">Drag-and-Drop Variables</td>
                            <td className="py-1 px-2 font-mono text-[7.5px]">HTML5 DnD API</td>
                            <td className="py-1 px-2 text-right text-blue-600 font-semibold">Ready for Test</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {previewPage === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">Report Chapter III</span>
                        <h1 className="text-[14px] font-bold text-slate-900 tracking-tight">Advanced Layout Specifications</h1>
                      </div>

                      <div className="w-8 h-0.5 bg-slate-950" />

                      <p className="text-[9.5px] text-slate-650 leading-normal">
                        Advanced users can leverage the **CSS compiler** to target spacing and styles. The compiler operates at the level of DOM class references:
                      </p>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-[8px]">
                          <div className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1">
                            <div className="font-bold text-slate-800">Target Selectors</div>
                            <div className="font-mono text-slate-500">.header, .footer, .header-left, .header-center, .header-right, .footer-left, .footer-center, .footer-right</div>
                          </div>
                          <div className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1">
                            <div className="font-bold text-slate-800">Style Guidelines</div>
                            <div className="text-slate-650 leading-normal">Keep borders clean, font sizing small (8pt-10pt) and text colors muted (e.g. gray or slate hues).</div>
                          </div>
                        </div>
                        <p className="text-[9.5px] text-slate-650 leading-normal mt-1">
                          This ensures that headers and footers sit harmoniously alongside page boundaries without distracting readers from central copy details.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scoped Running Footer */}
                <div className="footer flex justify-between items-center w-full min-h-6 shrink-0 relative select-none z-10">
                  {/* Left region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.footer.left.fontFamily,
                      fontSize: config.footer.left.fontSize,
                      fontWeight: config.footer.left.bold ? "bold" : "normal",
                      fontStyle: config.footer.left.italic ? "italic" : "normal",
                      textDecoration: config.footer.left.underline ? "underline" : "none",
                      color: config.footer.left.color,
                      justifyContent: config.footer.left.align === "right" ? "flex-end" : config.footer.left.align === "center" ? "center" : "flex-start"
                    }}
                  >
                    {config.footer.left.image && (
                      <img src={config.footer.left.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.footer.left.text, previewPage)}</span>
                  </div>

                  {/* Center region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.footer.center.fontFamily,
                      fontSize: config.footer.center.fontSize,
                      fontWeight: config.footer.center.bold ? "bold" : "normal",
                      fontStyle: config.footer.center.italic ? "italic" : "normal",
                      textDecoration: config.footer.center.underline ? "underline" : "none",
                      color: config.footer.center.color,
                      justifyContent: config.footer.center.align === "right" ? "flex-end" : config.footer.center.align === "left" ? "flex-start" : "center"
                    }}
                  >
                    {config.footer.center.image && (
                      <img src={config.footer.center.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.footer.center.text, previewPage)}</span>
                  </div>

                  {/* Right region */}
                  <div
                    className="flex-1 flex flex-row items-center gap-1.5"
                    style={{
                      fontFamily: config.footer.right.fontFamily,
                      fontSize: config.footer.right.fontSize,
                      fontWeight: config.footer.right.bold ? "bold" : "normal",
                      fontStyle: config.footer.right.italic ? "italic" : "normal",
                      textDecoration: config.footer.right.underline ? "underline" : "none",
                      color: config.footer.right.color,
                      justifyContent: config.footer.right.align === "left" ? "flex-start" : config.footer.right.align === "center" ? "center" : "flex-end"
                    }}
                  >
                    {config.footer.right.image && (
                      <img src={config.footer.right.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />
                    )}
                    <span>{resolveTemplateVariables(config.footer.right.text, previewPage)}</span>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      {/* Exporting Overlay Modal (Simulated Progress) */}
      {isExporting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <Card className="w-80 p-6 flex flex-col items-center space-y-4 bg-popover border border-border shadow-2xl rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
              <Sparkles className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold tracking-tight">Compiling Document</h3>
              <p className="text-[10px] text-muted-foreground">Injecting layouts & rendering pages...</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${exportProgress}%` }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground">{exportProgress}%</span>
          </Card>
        </div>
      )}
    </div>
  );
}
