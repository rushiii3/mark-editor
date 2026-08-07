import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
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

  const orientation = config.orientation || "portrait";
  const margins = config.margins || { top: 20, bottom: 22, left: 18, right: 18 };
  const excludeHeaderFooterFirstPage = !!config.excludeHeaderFooterFirstPage;
  const mirrorHeaderFooterOddEven = !!config.mirrorHeaderFooterOddEven;
  const watermarkText = config.watermarkText || "";
  const watermarkOpacity = config.watermarkOpacity !== undefined ? config.watermarkOpacity : 0.08;
  const autoCoverPage = !!config.autoCoverPage;

  const paperWidth = orientation === "portrait" ? "595px" : "842px";
  const paperMinHeight = orientation === "portrait" ? "842px" : "595px";

  const shouldHideHeadersFooters =
    (excludeHeaderFooterFirstPage && previewPage === 1) ||
    (autoCoverPage && previewPage === 1);

  const isEvenPage = previewPage % 2 === 0;
  const showMirrored = mirrorHeaderFooterOddEven && isEvenPage;

  const headerLeftRegion = showMirrored ? config.header.right : config.header.left;
  const headerRightRegion = showMirrored ? config.header.left : config.header.right;
  const footerLeftRegion = showMirrored ? config.footer.right : config.footer.left;
  const footerRightRegion = showMirrored ? config.footer.left : config.footer.right;

  const getAlign = (regionAlign: "left" | "center" | "right", isMirror: boolean): "left" | "center" | "right" => {
    if (regionAlign === "center") return "center";
    if (!isMirror) return regionAlign;
    return regionAlign === "left" ? "right" : "left";
  };

  const leftAlign = getAlign(headerLeftRegion.align, showMirrored);
  const rightAlign = getAlign(headerRightRegion.align, showMirrored);
  const footerLeftAlign = getAlign(footerLeftRegion.align, showMirrored);
  const footerRightAlign = getAlign(footerRightRegion.align, showMirrored);

  // Pagination Formatter Helper
  const formatPageNumber = (num: number, format?: string) => {
    if (num <= 0) return "";
    if (format === "roman") {
      const romanMap: Record<number, string> = {
        1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
        6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"
      };
      return romanMap[num] || num.toString();
    }
    if (format === "alphabetical") {
      const alphaMap: Record<number, string> = {
        1: "A", 2: "B", 3: "C", 4: "D", 5: "E",
        6: "F", 7: "G", 8: "H", 9: "I", 10: "J"
      };
      return alphaMap[num] || num.toString();
    }
    return num.toString();
  };

  const resolveCustomVariables = (text: string, pNum: number) => {
    const startOffset = config.pageNumberStart !== undefined ? config.pageNumberStart : 1;
    const pageIndex = config.autoCoverPage
      ? (pNum === 1 ? 0 : (pNum - 2) + startOffset)
      : (pNum - 1) + startOffset;
    const targetPageNumStr = formatPageNumber(pageIndex, config.pageNumberFormat);

    // Shield from accidental global regex replacements by prefixing the page token specifically
    const modifiedText = text.replace(/\{\{page\}\}/gi, "___PAGENUM_PLACEHOLDER___");
    let resolved = resolveTemplateVariables(modifiedText, pNum);
    resolved = resolved.replace(/___PAGENUM_PLACEHOLDER___/gi, targetPageNumStr);
    return resolved;
  };

  return (
    <div className="flex flex-col bg-muted/20 relative h-full">
      <div className="h-12 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 select-none z-10 shadow-3xs">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-blue-500" />
          <span className="text-xs font-bold text-foreground/90 tracking-wide">Print Preview (A4)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-0.5 bg-muted/40 p-1 rounded-xl border border-border/30 text-[10px] shadow-3xs">
            <button
              onClick={() => setPreviewMode("pdf")}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                previewMode === "pdf"
                  ? "bg-card text-foreground shadow-2xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Live PDF
            </button>
            <button
              onClick={() => setPreviewMode("mock")}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                previewMode === "mock"
                  ? "bg-card text-foreground shadow-2xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Simulated
            </button>
          </div>

          {previewMode === "mock" && (
            <>
              <button
                onClick={() => setShowMarginGuides(!showMarginGuides)}
                className={`text-[10px] px-2.5 py-1 rounded-xl border transition-all font-bold cursor-pointer shadow-3xs ${
                  showMarginGuides
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-650 dark:text-blue-400"
                    : "bg-background border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                Guides
              </button>

              <div className="flex items-center bg-card border border-border/60 rounded-xl overflow-hidden text-xs shadow-3xs p-0.5">
                <button
                  disabled={previewPage <= 1}
                  onClick={() => setPreviewPage((p) => p - 1)}
                  className="p-1 border-r border-transparent hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span className="px-3 font-mono text-[10px] font-bold text-foreground/80 select-none">
                  Page {previewPage} / 3
                </span>
                <button
                  disabled={previewPage >= 3}
                  onClick={() => setPreviewPage((p) => p + 1)}
                  className="p-1 border-l border-transparent hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {previewMode === "pdf" ? (
        <div className="flex-1 relative bg-muted/10 flex flex-col h-full min-h-0">
          {pdfBlobUrl ? (
            <div className="flex-1 relative w-full h-full min-h-0">
              {isGeneratingPdf && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 text-[10px] bg-background/90 backdrop-blur-md border border-border/60 rounded-full shadow-lg text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Compiling Live Preview...
                </div>
              )}
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none bg-card"
                title="Live PDF Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-muted-foreground select-none">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold tracking-wide animate-pulse">Compiling PDF documents...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-all duration-300">
          <div
            id="a4-preview-page"
            className="relative bg-white text-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_70px_-12px_rgba(0,0,0,0.45)] rounded-md transition-all duration-300 overflow-hidden flex flex-col select-none border border-border/20 scale-95"
            style={{
              width: paperWidth,
              minHeight: paperMinHeight,
              paddingTop: `${margins.top}mm`,
              paddingBottom: `${margins.bottom}mm`,
              paddingLeft: `${margins.left}mm`,
              paddingRight: `${margins.right}mm`
            }}
          >
            {showMarginGuides && (
              <div
                className="absolute border border-dashed border-sky-400/30 pointer-events-none rounded-xs before:content-['Printable_Area'] before:absolute before:-top-3.5 before:left-0 before:text-[6.5px] before:font-bold before:font-mono before:text-sky-500/40 select-none z-20"
                style={{
                  top: `${margins.top}mm`,
                  bottom: `${margins.bottom}mm`,
                  left: `${margins.left}mm`,
                  right: `${margins.right}mm`
                }}
              />
            )}

            {watermarkText.trim() !== "" && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center font-extrabold text-slate-500 select-none z-0 overflow-hidden"
                style={{
                  fontSize: orientation === "portrait" ? "68px" : "86px",
                  transform: "rotate(-32deg) scale(1.15)",
                  opacity: watermarkOpacity,
                  letterSpacing: "8px",
                  fontFamily: "Inter, sans-serif"
                }}
              >
                {watermarkText}
              </div>
            )}

            {!shouldHideHeadersFooters && (
              <div
                className="header flex justify-between items-center w-full min-h-6 shrink-0 relative select-none z-10 pb-1.5 mb-5"
                style={{
                  borderBottom: config.headerDividerWidth
                    ? `${config.headerDividerWidth}pt solid ${config.headerDividerColor || "#cbd5e1"}`
                    : "1px solid #slate-100"
                }}
              >
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: headerLeftRegion.fontFamily, fontSize: headerLeftRegion.fontSize, fontWeight: headerLeftRegion.bold ? "bold" : "normal", fontStyle: headerLeftRegion.italic ? "italic" : "normal", textDecoration: headerLeftRegion.underline ? "underline" : "none", color: headerLeftRegion.color, justifyContent: leftAlign === "right" ? "flex-end" : leftAlign === "center" ? "center" : "flex-start" }}>
                  {headerLeftRegion.image && <img src={headerLeftRegion.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(headerLeftRegion.text, previewPage)}</span>
                </div>
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: config.header.center.fontFamily, fontSize: config.header.center.fontSize, fontWeight: config.header.center.bold ? "bold" : "normal", fontStyle: config.header.center.italic ? "italic" : "normal", textDecoration: config.header.center.underline ? "underline" : "none", color: config.header.center.color, justifyContent: config.header.center.align === "right" ? "flex-end" : config.header.center.align === "left" ? "flex-start" : "center" }}>
                  {config.header.center.image && <img src={config.header.center.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(config.header.center.text, previewPage)}</span>
                </div>
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: headerRightRegion.fontFamily, fontSize: headerRightRegion.fontSize, fontWeight: headerRightRegion.bold ? "bold" : "normal", fontStyle: headerRightRegion.italic ? "italic" : "normal", textDecoration: headerRightRegion.underline ? "underline" : "none", color: headerRightRegion.color, justifyContent: rightAlign === "left" ? "flex-start" : rightAlign === "center" ? "center" : "flex-end" }}>
                  {headerRightRegion.image && <img src={headerRightRegion.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(headerRightRegion.text, previewPage)}</span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden py-2 text-slate-800 text-[10px] leading-relaxed relative flex flex-col justify-start z-10">
              {autoCoverPage && previewPage === 1 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-10 animate-in fade-in duration-300">
                  <div className="space-y-2.5">
                    <span className="text-[7.5px] font-bold tracking-widest uppercase" style={{ color: config.accentColor || "#2563eb" }}>
                      Document Publication
                    </span>
                    <h1 className="text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">
                      {metadataMocks.title}
                    </h1>
                  </div>
                  <div className="w-16 h-1 rounded-full" style={{ backgroundColor: config.accentColor || "#3b82f6" }} />
                  <p className="text-[10px] text-slate-500 max-w-sm leading-relaxed font-medium">
                    This is an auto-generated publication cover. Running headers and running footers are excluded on first cover page spreads to preserve clean visual composition.
                  </p>
                  <div className="space-y-1.5 text-slate-700 pt-10">
                    <span className="text-[10px] font-bold block">{metadataMocks.author}</span>
                    <span className="text-[9px] text-slate-400 font-medium block">{metadataMocks.company}</span>
                    <span className="text-[8.5px] text-slate-400 font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded block mt-2.5 w-max mx-auto">{metadataMocks.version}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">{metadataMocks.date}</span>
                  </div>
                </div>
              ) : (
                <>
                  {previewPage === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <span className="text-[7.5px] font-bold tracking-widest uppercase" style={{ color: config.accentColor || "#2563eb" }}>
                          Report Chapter I
                        </span>
                        <h1 className="text-[18px] font-bold text-slate-900 tracking-tight leading-none">
                          {metadataMocks.title}
                        </h1>
                        <p className="text-[8.5px] text-slate-500 font-mono font-medium">
                          Prepared by: {metadataMocks.author} | {metadataMocks.date}
                        </p>
                      </div>
                      <div className="w-10 h-1 rounded-full" style={{ backgroundColor: config.accentColor || "#0f172a" }} />
                      <div className="space-y-2">
                        <h2 className="text-[11px] font-extrabold text-slate-900">1. Executive Summary</h2>
                        <p className="text-[9.5px] text-slate-650 leading-relaxed font-normal">
                          This proposal outlines the implementation of a professional **Header and Footer Editor** for the
                          premium offline-first Markdown studio. By creating a layout visualizer that mirrors physical document
                          ratios, users gain immediate design assurance before printing or compiling layouts.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-[11px] font-extrabold text-slate-900">2. Core Technical Architecture</h2>
                        <p className="text-[9.5px] text-slate-650 leading-relaxed font-normal">
                          The editor utilizes **Zustand** client-side stores to maintain configuration settings, which
                          serialize cleanly into IndexedDB parameters. Document variables map to Markdown frontmatter
                          headers, matching compiler states seamlessly.
                        </p>
                      </div>
                    </div>
                  )}
                  {previewPage === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <span className="text-[7.5px] font-bold tracking-widest uppercase" style={{ color: config.accentColor || "#2563eb" }}>
                          Report Chapter II
                        </span>
                        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">
                          Milestones & Integration Metrics
                        </h1>
                      </div>
                      <div className="w-10 h-0.5" style={{ backgroundColor: config.accentColor || "#0f172a" }} />
                      <p className="text-[9.5px] text-slate-600 font-normal leading-relaxed">
                        The layout presets provide direct mapping options that change compilation boundaries instantly.
                        Verification statistics are updated daily on document saves:
                      </p>
                      <div className="border border-slate-100 rounded-lg overflow-hidden shadow-xs">
                        <table className="w-full border-collapse text-[8.5px] text-slate-700">
                          <thead>
                            <tr className="border-b-2 border-slate-200 font-bold bg-slate-50 text-slate-800" style={{ borderBottomColor: config.accentColor || "#cbd5e1" }}>
                              <th className="py-1.5 px-3 text-left">Milestone Phase</th>
                              <th className="py-1.5 px-3 text-left">System API</th>
                              <th className="py-1.5 px-3 text-right">Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                              <td className="py-1.5 px-3 font-semibold text-slate-800">Layout Engine</td>
                              <td className="py-1.5 px-3 font-mono text-[7.5px] text-slate-500">@react-pdf/renderer</td>
                              <td className="py-1.5 px-3 text-right text-emerald-600 font-bold">100% Completed</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                              <td className="py-1.5 px-3 font-semibold text-slate-800">Code Editor Integration</td>
                              <td className="py-1.5 px-3 font-mono text-[7.5px] text-slate-500">@uiw/react-codemirror</td>
                              <td className="py-1.5 px-3 text-right text-emerald-600 font-bold">100% Completed</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-1.5 px-3 font-semibold text-slate-800">Drag-and-Drop Variables</td>
                              <td className="py-1.5 px-3 font-mono text-[7.5px] text-slate-500">HTML5 DnD API</td>
                              <td className="py-1.5 px-3 text-right text-blue-600 font-bold">Ready for Test</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {previewPage === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <span className="text-[7.5px] font-bold tracking-widest uppercase" style={{ color: config.accentColor || "#2563eb" }}>
                          Report Chapter III
                        </span>
                        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">
                          Advanced Layout Specifications
                        </h1>
                      </div>
                      <div className="w-10 h-0.5" style={{ backgroundColor: config.accentColor || "#0f172a" }} />
                      <p className="text-[9.5px] text-slate-600 leading-relaxed font-normal">
                        Advanced users can leverage the **CSS compiler** to target spacing and styles. The compiler
                        operates at the level of DOM class references:
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-[8px]">
                          <div className="border border-slate-150 p-2.5 rounded-lg bg-slate-50 space-y-1">
                            <div className="font-bold text-slate-800 text-[8.5px]">Target Selectors</div>
                            <div className="font-mono text-slate-500 leading-relaxed">
                              .header, .footer, .header-left, .header-center, .header-right, .footer-left,
                              .footer-center, .footer-right
                            </div>
                          </div>
                          <div className="border border-slate-150 p-2.5 rounded-lg bg-slate-50 space-y-1">
                            <div className="font-bold text-slate-800 text-[8.5px]">Style Guidelines</div>
                            <div className="text-slate-600 leading-relaxed font-medium">
                              Keep borders clean, font sizing small (8pt-10pt) and text colors muted (e.g. gray or slate
                              hues).
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {!shouldHideHeadersFooters && (
              <div
                className="footer flex justify-between items-center w-full min-h-6 shrink-0 relative select-none z-10 pt-1.5 mt-5"
                style={{
                  borderTop: config.footerDividerWidth
                    ? `${config.footerDividerWidth}pt solid ${config.footerDividerColor || "#cbd5e1"}`
                    : "1px solid #slate-100"
                }}
              >
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: footerLeftRegion.fontFamily, fontSize: footerLeftRegion.fontSize, fontWeight: footerLeftRegion.bold ? "bold" : "normal", fontStyle: footerLeftRegion.italic ? "italic" : "normal", textDecoration: footerLeftRegion.underline ? "underline" : "none", color: footerLeftRegion.color, justifyContent: footerLeftAlign === "right" ? "flex-end" : footerLeftAlign === "center" ? "center" : "flex-start" }}>
                  {footerLeftRegion.image && <img src={footerLeftRegion.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(footerLeftRegion.text, previewPage)}</span>
                </div>
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: config.footer.center.fontFamily, fontSize: config.footer.center.fontSize, fontWeight: config.footer.center.bold ? "bold" : "normal", fontStyle: config.footer.center.italic ? "italic" : "normal", textDecoration: config.footer.center.underline ? "underline" : "none", color: config.footer.center.color, justifyContent: config.footer.center.align === "right" ? "flex-end" : config.footer.center.align === "left" ? "flex-start" : "center" }}>
                  {config.footer.center.image && <img src={config.footer.center.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(config.footer.center.text, previewPage)}</span>
                </div>
                <div className="flex-1 flex flex-row items-center gap-1.5" style={{ fontFamily: footerRightRegion.fontFamily, fontSize: footerRightRegion.fontSize, fontWeight: footerRightRegion.bold ? "bold" : "normal", fontStyle: footerRightRegion.italic ? "italic" : "normal", textDecoration: footerRightRegion.underline ? "underline" : "none", color: footerRightRegion.color, justifyContent: footerRightAlign === "left" ? "flex-start" : footerRightAlign === "center" ? "center" : "flex-end" }}>
                  {footerRightRegion.image && <img src={footerRightRegion.image} alt="Logo" className="h-5 w-auto object-contain max-w-[80px]" />}
                  <span>{resolveCustomVariables(footerRightRegion.text, previewPage)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
