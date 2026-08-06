import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useFileStore } from "@/store/file-store";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/store/settings-store";
import { getSetting, setSetting } from "@/db/setting";
import { LayoutConfig, RegionConfig } from "../types";
import { TEMPLATES } from "../constants";

export function useHeaderFooterEditor() {
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

  // Live PDF preview states
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const activeFile = files.find((f) => f.id === editingFileId);
  const markdownContent = activeFile?.content || "";
  const activeFont = useSettingsStore((s) => s.activeFont);

  // Debounced PDF compilation for live preview
  useEffect(() => {
    if (!editingFileId || !markdownContent) {
      setPdfBlobUrl(null);
      setIsGeneratingPdf(false);
      return;
    }

    setIsGeneratingPdf(true);

    const timer = setTimeout(async () => {
      try {
        const { generateMarkdownPdfBlob } = await import("@/lib/editor/pdf-generator");
        const blob = await generateMarkdownPdfBlob(markdownContent, activeFont, config);
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return url;
        });
      } catch (err) {
        console.error("Failed to generate preview PDF", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [markdownContent, config, activeFont, editingFileId]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

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
  const resolveTemplateVariables = useCallback((templateText: string, pageNum: number) => {
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
  }, [metadataMocks.title, metadataMocks.file_name, metadataMocks.author, metadataMocks.company, metadataMocks.version, metadataMocks.date, metadataMocks.time, metadataMocks.pages]);

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

  return {
    files,
    editingFileId,
    setEditingFileId,
    config,
    saveConfig,
    activeTemplate,
    selectedSection,
    setSelectedSection,
    selectedRegion,
    setSelectedRegion,
    previewPage,
    setPreviewPage,
    showMarginGuides,
    setShowMarginGuides,
    imageUrlInput,
    setImageUrlInput,
    showImagePopover,
    setShowImagePopover,
    isExporting,
    exportProgress,
    exportType,
    inputRef,
    activeFileName,
    metadataMocks,
    handleApplyToAll,
    handleTemplateSelect,
    activeRegionConfig,
    updateActiveRegion,
    compileScopedCss,
    insertVariable,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleLocalImageUpload,
    resolveTemplateVariables,
    triggerMockExport,
    handleReset,
    pdfBlobUrl,
    isGeneratingPdf
  };
}
