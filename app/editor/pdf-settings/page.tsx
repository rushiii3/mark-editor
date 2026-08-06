"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

import { useHeaderFooterEditor } from "./hooks/use-header-footer-editor";
import { EditorHeader } from "./components/editor-header";
import { LeftSidebar } from "./components/left-sidebar";
import { LayoutComposer } from "./components/layout-composer";
import { PrintVisualizer } from "./components/print-visualizer";

export default function HeaderFooterEditorPage() {
  const { resolvedTheme } = useTheme();
  const editor = useHeaderFooterEditor();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Dynamic Scoped Stylesheet Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: editor.compileScopedCss(editor.config.advancedCss)
        }}
      />

      {/* Header Bar */}
      <EditorHeader
        files={editor.files}
        editingFileId={editor.editingFileId}
        setEditingFileId={editor.setEditingFileId}
        handleApplyToAll={editor.handleApplyToAll}
        handleReset={editor.handleReset}
        triggerMockExport={editor.triggerMockExport}
      />

      {/* Three-Column Workspace using Resizable panels */}
      <div className="flex-1 min-h-0 relative">
        <ResizablePanelGroup orientation="horizontal">
          {/* Left Sidebar (23%) */}
          <ResizablePanel
            defaultSize={40}
            minSize={30}
            className="flex flex-col bg-card/40 border-r border-border/80"
          >
            <LeftSidebar
              selectedSection={editor.selectedSection}
              setSelectedSection={editor.setSelectedSection}
              setSelectedRegion={editor.setSelectedRegion}
              activeTemplate={editor.activeTemplate}
              handleTemplateSelect={editor.handleTemplateSelect}
              insertVariable={editor.insertVariable}
              handleDragStart={editor.handleDragStart}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel (Editor Canvas) (42%) */}
          <ResizablePanel
            defaultSize={42}
            minSize={35}
            className="flex flex-col bg-background"
          >
            <LayoutComposer
              selectedSection={editor.selectedSection}
              selectedRegion={editor.selectedRegion}
              setSelectedSection={editor.setSelectedSection}
              setSelectedRegion={editor.setSelectedRegion}
              config={editor.config}
              activeRegionConfig={editor.activeRegionConfig}
              updateActiveRegion={editor.updateActiveRegion}
              handleLocalImageUpload={editor.handleLocalImageUpload}
              imageUrlInput={editor.imageUrlInput}
              setImageUrlInput={editor.setImageUrlInput}
              showImagePopover={editor.showImagePopover}
              setShowImagePopover={editor.setShowImagePopover}
              inputRef={editor.inputRef}
              handleDrop={editor.handleDrop}
              handleDragOver={editor.handleDragOver}
              saveConfig={editor.saveConfig}
              resolvedTheme={resolvedTheme}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel (Real-Time A4 Simulation) (35%) */}
          <ResizablePanel defaultSize={35} minSize={30} className="flex flex-col bg-muted/30 relative animate-in fade-in duration-150">
            <PrintVisualizer
              config={editor.config}
              showMarginGuides={editor.showMarginGuides}
              setShowMarginGuides={editor.setShowMarginGuides}
              previewPage={editor.previewPage}
              setPreviewPage={editor.setPreviewPage}
              resolveTemplateVariables={editor.resolveTemplateVariables}
              metadataMocks={editor.metadataMocks}
              pdfBlobUrl={editor.pdfBlobUrl}
              isGeneratingPdf={editor.isGeneratingPdf}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Exporting Overlay Modal (Simulated Progress) */}
      {editor.isExporting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <Card className="w-80 p-6 flex flex-col items-center space-y-4 bg-popover border border-border shadow-2xl rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
              <Sparkles className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold tracking-tight">
                Compiling Document
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Injecting layouts & rendering pages...
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${editor.exportProgress}%` }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground">
              {editor.exportProgress}%
            </span>
          </Card>
        </div>
      )}
    </div>
  );
}
