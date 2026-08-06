import React from "react";
import { Layout, Info, Sparkles, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VARIABLES, TEMPLATES } from "../constants";

interface LeftSidebarProps {
  selectedSection: "header" | "footer";
  setSelectedSection: (section: "header" | "footer") => void;
  setSelectedRegion: (region: "left" | "center" | "right") => void;
  activeTemplate: string;
  handleTemplateSelect: (templateId: string) => void;
  insertVariable: (token: string) => void;
  handleDragStart: (e: React.DragEvent, token: string) => void;
}

export function LeftSidebar({
  selectedSection,
  setSelectedSection,
  setSelectedRegion,
  activeTemplate,
  handleTemplateSelect,
  insertVariable,
  handleDragStart
}: LeftSidebarProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 select-none custom-scrollbar">
      {/* Section 1: Selector Tabs */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Target Component
        </label>
        <div className="grid grid-cols-2 gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/30">
          <button
            onClick={() => {
              setSelectedSection("header");
              setSelectedRegion("left");
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md transition-all font-medium cursor-pointer ${
              selectedSection === "header"
                ? "bg-card text-foreground shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layout className="size-3.5 rotate-180" />
            Header
          </button>
          <button
            onClick={() => {
              setSelectedSection("footer");
              setSelectedRegion("left");
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md transition-all font-medium cursor-pointer ${
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
                className={`group relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm text-foreground"
                    : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold capitalize tracking-tight flex items-center gap-1.5">
                    <Sparkles
                      className={`size-3.5 ${
                        isActive
                          ? "text-primary fill-primary/10"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
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
  );
}
