"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const previewTabs = [
  {
    id: "editor",
    label: "Advanced Editor",
    title: "Monaco Core with Slash Commands",
    description:
      "Write code with VS Code's editor features. Trigger formatting, checklists, headings, code blocks, or page breaks instantly by typing '/'.",
    mockup: (
      <div className="flex flex-col h-full bg-[#0C0C0C] font-mono text-xs sm:text-sm text-slate-300 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 text-slate-600 mb-2 border-b border-white/5 pb-2">
          <span>index.md</span>
          <span className="ml-auto text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
            Markdown
          </span>
        </div>
        <div className="space-y-1.5">
          <div>
            <span className="text-slate-600 select-none mr-3">1</span># Project README
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">2</span>
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">3</span>This is a local-first editor with advanced formatting.
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">4</span>
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">5</span>
            <span className="text-amber-500/80">:::callout[tip]</span>
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">6</span>
            <span className="text-amber-500/80">
              Try typing a slash to see commands.
            </span>
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">7</span>
            <span className="text-amber-500/80">:::</span>
          </div>
          <div>
            <span className="text-slate-600 select-none mr-3">8</span>
          </div>
          <div className="relative">
            <span className="text-slate-600 select-none mr-3">9</span>/
            {/* Mock Slash command overlay */}
            <div className="absolute left-8 top-6 z-20 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="border-b border-white/5 px-3 py-1.5 text-[9px] font-semibold tracking-widest text-slate-500 uppercase select-none">
                Commands
              </div>
              <div className="p-1 text-[11px] font-sans text-slate-300 space-y-0.5">
                <div className="flex w-full items-center rounded-lg bg-amber-500/15 text-amber-500 px-2.5 py-1.5 text-left font-medium">
                  Heading 1
                </div>
                <div className="flex w-full items-center rounded-lg hover:bg-white/5 px-2.5 py-1.5 text-left">
                  Heading 2
                </div>
                <div className="flex w-full items-center rounded-lg hover:bg-white/5 px-2.5 py-1.5 text-left">
                  Bold Text
                </div>
                <div className="flex w-full items-center rounded-lg hover:bg-white/5 px-2.5 py-1.5 text-left">
                  Insert Page Break
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "explorer",
    label: "Local Storage",
    title: "Sandbox IndexedDB Browser Explorer",
    description:
      "Manage multiple markdown files entirely inside your browser. Double click to rename, click to delete, or add documents in milliseconds.",
    mockup: (
      <div className="flex h-full bg-[#0F0F0F] text-slate-400 text-xs sm:text-sm font-sans">
        <div className="w-[180px] sm:w-[220px] border-r border-white/5 bg-[#0A0A0A] p-4 select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
              Files
            </span>
            <span className="text-[10px] text-amber-500 hover:underline cursor-pointer">
              + New
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 text-white px-3 py-2 text-xs font-medium border border-white/5">
              <span>📄</span> <span className="truncate">index.md</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg hover:bg-white/5 px-3 py-2 text-xs font-medium">
              <span>📄</span> <span className="truncate">cv-draft.md</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg hover:bg-white/5 px-3 py-2 text-xs font-medium">
              <span>📄</span> <span className="truncate">invoices.md</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
          <span className="text-4xl">🗄️</span>
          <h4 className="text-sm font-bold text-white mt-4">
            Local Database Sandbox
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
            All files are stored in your browser&apos;s client IndexedDB store. No servers involved.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "pdf",
    label: "A4 Printing",
    title: "Dashed Page Boundaries & Breaks",
    description:
      "Layout documents using visual page stack markers. Inject '::pagebreak' in your text to separate content and guarantee beautiful print layouts.",
    mockup: (
      <div className="h-full bg-slate-900 flex justify-center items-start overflow-y-auto py-8 px-4">
        <div className="w-[280px] sm:w-[350px] min-h-[400px] bg-white text-slate-900 p-8 shadow-2xl relative border-t-4 border-amber-500">
          <div className="absolute top-2 right-2 text-[8px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 select-none">
            A4 Guide Page 1
          </div>
          <h1 className="text-lg font-bold border-b border-slate-200 pb-2 mb-3 text-black">
            Document Header
          </h1>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
            This layout wraps exactly inside the printable dimensions.
          </p>

          {/* Simulated page break line */}
          <div className="my-6 border-t-2 border-dashed border-red-300 relative">
            <span className="absolute -top-2 left-4 bg-slate-900 text-white text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded border border-red-500/20 select-none uppercase">
              Page Break
            </span>
          </div>

          <div className="text-[8px] text-slate-400 select-none mb-1">
            Page 2 content starts here...
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            This content is forced onto the second A4 page.
          </p>
        </div>
      </div>
    )
  }
];

export function ProductPreview() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Tabs defaultValue="editor" orientation="vertical" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left copy & selector */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Interactive Preview
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              A Studio Designed for Developer Workflows.
            </h3>

            {/* Tab list */}
            <TabsList className="flex flex-col gap-2 bg-transparent p-0 w-full h-auto">
              {previewTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-start p-4 rounded-xl border border-white/5 text-left hover:border-white/10 hover:bg-white/5 data-[state=active]:border-amber-500/30 data-[state=active]:bg-amber-500/5 data-[state=active]:text-amber-500 w-full h-auto relative"
                >
                  <span className="text-sm font-bold text-white group-data-[state=active]/tabs-trigger:text-amber-500">
                    {tab.label}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 font-normal">
                    {tab.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Right Mockup display */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0F0F0F] p-1.5 shadow-[0_0_35px_rgba(0,0,0,0.8)] overflow-hidden h-[340px] sm:h-[420px] md:h-[480px]">
              {/* Fake OS Header bar */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#141414] select-none">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
                <div className="mx-auto text-[10px] text-slate-500 font-mono">
                  manus.dev/workspace
                </div>
              </div>

              <div className="h-[calc(100%-27px)] overflow-hidden">
                {previewTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="h-full mt-0">
                    {tab.mockup}
                  </TabsContent>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
