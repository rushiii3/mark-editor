import React from "react";
import { Layout, Type, ShieldCheck, FileCode } from "lucide-react";

interface LeftSidebarProps {
  activeCategory: "layout" | "typography" | "metadata" | "css";
  setActiveCategory: (category: "layout" | "typography" | "metadata" | "css") => void;
  selectedSection: "header" | "footer";
  setSelectedSection: (section: "header" | "footer") => void;
  setSelectedRegion: (region: "left" | "center" | "right") => void;
  activeTemplate: string;
  handleTemplateSelect: (templateId: string) => void;
  insertVariable: (token: string) => void;
  handleDragStart: (e: React.DragEvent, token: string) => void;
}

export function LeftSidebar({
  activeCategory,
  setActiveCategory,
  selectedSection,
  setSelectedSection,
  setSelectedRegion
}: LeftSidebarProps) {
  const categories = [
    {
      id: "layout" as const,
      label: "Page Layout & Margin",
      description: "Header/footer regions, size, orientation, and margins",
      icon: Layout,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      id: "typography" as const,
      label: "Typography",
      description: "Body font sizes, alignment, spacing, and editor themes",
      icon: Type,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      id: "metadata" as const,
      label: "Metadata & Security",
      description: "Presets, cover pages, watermarks, and variables",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: "css" as const,
      label: "Advanced CSS",
      description: "Custom scoped styles compiled into layout stylesheets",
      icon: FileCode,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 select-none custom-scrollbar bg-background/5">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
          Settings Console
        </label>
        <p className="text-[10px] text-muted-foreground/80 leading-normal font-medium">
          Select a category to inspect or modify the PDF compiler specifications:
        </p>
      </div>

      <nav className="space-y-2.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Reset selections to safe defaults if swapping categories to avoid layout composer issues
                if (cat.id === "layout") {
                  setSelectedSection("header");
                  setSelectedRegion("left");
                }
              }}
              className={`group flex items-start gap-3.5 p-3.5 w-full rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-blue-650 bg-blue-500/5 dark:bg-blue-500/5 shadow-2xs text-foreground"
                  : "border-border/60 hover:border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-2 rounded-xl border ${cat.color} shrink-0 shadow-3xs group-hover:scale-105 transition-transform`}>
                <Icon className="size-4.5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <span className="text-[11px] font-bold tracking-tight block">
                  {cat.label}
                </span>
                <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

