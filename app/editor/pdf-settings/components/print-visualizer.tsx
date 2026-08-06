import React, { useState } from "react";
import { Eye } from "lucide-react";
import { LayoutConfig } from "../types";

interface PrintVisualizerProps {
  config: LayoutConfig;
  showMarginGuides: boolean;
  setShowMarginGuides: (show: boolean) => void;
  previewPage: number;
  setPreviewPage: React.Dispatch<React.SetStateAction<number>>;
  resolveTemplateVariables: (text: string, pageNum: number) => string;
  metadataMocks: {
    title: string;
    file_name: string;
    author: string;
    company: string;
    version: string;
    date: string;
    time: string;
    pages: string;
  };
  pdfBlobUrl: string | null;
  isGeneratingPdf: boolean;
}

export function PrintVisualizer({
  config,
  showMarginGuides,
  setShowMarginGuides,
  previewPage,
  setPreviewPage,
  resolveTemplateVariables,
  metadataMocks,
  pdfBlobUrl,
  isGeneratingPdf
}: PrintVisualizerProps) {
  const [previewMode, setPreviewMode] = useState<"pdf" | "mock">("pdf");

  return (
    <div className="flex flex-col bg-muted/30 relative h-full">
      {/* Top Toolbar */}
      <div className="h-11 border-b border-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Eye className="size-3.5 text-primary" />
          <span className="text-xs font-semibold">Print Visualizer (A4)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Mode Selector */}
          <div className="grid grid-cols-2 gap-0.5 bg-muted/40 p-0.5 rounded-lg border border-border/30 text-[10px] mr-1">
            <button
              onClick={() => setPreviewMode("pdf")}
              className={`px-2 py-0.5 rounded-md transition-all font-medium cursor-pointer ${
                previewMode === "pdf"
                  ? "bg-card text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Live PDF
            </button>
            <button
              onClick={() => setPreviewMode("mock")}
              className={`px-2 py-0.5 rounded-md transition-all font-medium cursor-pointer ${
                previewMode === "mock"
                  ? "bg-card text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Simulated
            </button>
          </div>

          {previewMode === "mock" && (
            <>
              {/* Guide Toggles */}
              <button
                onClick={() => setShowMarginGuides(!showMarginGuides)}
                className={`text-[10px] px-2 py-1 rounded border transition-all font-medium cursor-pointer ${
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
                  onClick={() => setPreviewPage((p) => p - 1)}
                  className="px-2 py-0.5 border-r border-border hover:bg-muted text-[10px] disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 font-mono text-[10px] font-semibold">Page {previewPage}/3</span>
                <button
                  disabled={previewPage >= 3}
                  onClick={() => setPreviewPage((p) => p + 1)}
                  className="px-2 py-0.5 border-l border-border hover:bg-muted text-[10px] disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Content Area */}
      {previewMode === "pdf" ? (
        <div className="flex-1 relative bg-card/10 flex flex-col h-full min-h-0">
          {pdfBlobUrl ? (
            <div className="flex-1 relative w-full h-full min-h-0">
              {isGeneratingPdf && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-background/90 border border-border rounded-full shadow-md text-primary font-medium animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Updating Preview...
                </div>
              )}
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none bg-card"
                title="Live PDF Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Generating PDF preview...</span>
            </div>
          )}
        </div>
      ) : (
        /* Document sheet workspace (Dotted canvas) */
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
                  justifyContent:
                    config.header.left.align === "right"
                      ? "flex-end"
                      : config.header.left.align === "center"
                      ? "center"
                      : "flex-start"
                }}
              >
                {config.header.left.image && (
                  <img
                    src={config.header.left.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
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
                  justifyContent:
                    config.header.center.align === "right"
                      ? "flex-end"
                      : config.header.center.align === "left"
                      ? "flex-start"
                      : "center"
                }}
              >
                {config.header.center.image && (
                  <img
                    src={config.header.center.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
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
                  justifyContent:
                    config.header.right.align === "left"
                      ? "flex-start"
                      : config.header.right.align === "center"
                      ? "center"
                      : "flex-end"
                }}
              >
                {config.header.right.image && (
                  <img
                    src={config.header.right.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
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
                    <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">
                      Report Chapter I
                    </span>
                    <h1 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
                      {metadataMocks.title}
                    </h1>
                    <p className="text-[8.5px] text-slate-500 font-mono">
                      Prepared by: {metadataMocks.author} | {metadataMocks.date}
                    </p>
                  </div>

                  <div className="w-8 h-1 bg-slate-900 rounded" />

                  <div className="space-y-2">
                    <h2 className="text-[11px] font-bold text-slate-900">1. Executive Summary</h2>
                    <p className="text-[9.5px] text-slate-650 leading-normal">
                      This proposal outlines the implementation of a professional **Header and Footer Editor** for the
                      premium offline-first Markdown studio. By creating a layout visualizer that mirrors physical document
                      ratios, users gain immediate design assurance before printing or compiling.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[11px] font-bold text-slate-900">2. Core Technical Architecture</h2>
                    <p className="text-[9.5px] text-slate-650 leading-normal">
                      The editor utilizes **Zustand** client-side stores to maintain configuration settings, which
                      serialize cleanly into IndexedDB parameters. Document variables map to Markdown frontmatter
                      headers, matching compiler states seamlessly.
                    </p>

                  <div className="border border-slate-200 bg-slate-50 p-2 rounded font-mono text-[8px] text-slate-700 space-y-1 leading-normal">
                    <div>
                      <span className="text-amber-600">const</span> compile = (md) =&gt; &#123;
                    </div>
                    <div className="pl-3">
                      <span className="text-amber-600">const</span> frontmatter = parse(md);
                    </div>
                    <div className="pl-3">
                      <span className="text-amber-600">return</span> injectTemplates(frontmatter, layoutConfig);
                    </div>
                    <div>&#125;;</div>
                  </div>
                  </div>
                </div>
              )}

              {previewPage === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">
                      Report Chapter II
                    </span>
                    <h1 className="text-[14px] font-bold text-slate-900 tracking-tight">
                      Milestones & Integration Metrics
                    </h1>
                  </div>

                  <div className="w-8 h-0.5 bg-slate-950" />

                  <p className="text-[9.5px] text-slate-650">
                    The layout presets provide direct mapping options that change compilation boundaries instantly.
                    Verification statistics are updated daily on document saves:
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
                    <span className="text-[7px] font-bold text-blue-600 tracking-widest uppercase">
                      Report Chapter III
                    </span>
                    <h1 className="text-[14px] font-bold text-slate-900 tracking-tight">
                      Advanced Layout Specifications
                    </h1>
                  </div>

                  <div className="w-8 h-0.5 bg-slate-950" />

                  <p className="text-[9.5px] text-slate-650 leading-normal">
                    Advanced users can leverage the **CSS compiler** to target spacing and styles. The compiler
                    operates at the level of DOM class references:
                  </p>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[8px]">
                      <div className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1">
                        <div className="font-bold text-slate-800">Target Selectors</div>
                        <div className="font-mono text-slate-500">
                          .header, .footer, .header-left, .header-center, .header-right, .footer-left,
                          .footer-center, .footer-right
                        </div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1">
                        <div className="font-bold text-slate-800">Style Guidelines</div>
                        <div className="text-slate-650 leading-normal">
                          Keep borders clean, font sizing small (8pt-10pt) and text colors muted (e.g. gray or slate
                          hues).
                        </div>
                      </div>
                    </div>
                    <p className="text-[9.5px] text-slate-650 leading-normal mt-1">
                      This ensures that headers and footers sit harmoniously alongside page boundaries without
                      distracting readers from central copy details.
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
                  justifyContent:
                    config.footer.left.align === "right"
                      ? "flex-end"
                      : config.footer.left.align === "center"
                      ? "center"
                      : "flex-start"
                }}
              >
                {config.footer.left.image && (
                  <img
                    src={config.footer.left.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
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
                  justifyContent:
                    config.footer.center.align === "right"
                      ? "flex-end"
                      : config.footer.center.align === "left"
                      ? "flex-start"
                      : "center"
                }}
              >
                {config.footer.center.image && (
                  <img
                    src={config.footer.center.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
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
                  justifyContent:
                    config.footer.right.align === "left"
                      ? "flex-start"
                      : config.footer.right.align === "center"
                      ? "center"
                      : "flex-end"
                }}
              >
                {config.footer.right.image && (
                  <img
                    src={config.footer.right.image}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-w-[80px]"
                  />
                )}
                <span>{resolveTemplateVariables(config.footer.right.text, previewPage)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
