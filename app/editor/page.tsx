"use client";

import dynamic from "next/dynamic";

function EditorLoadingSkeleton() {
  return (
    <div className="flex h-screen w-screen flex-col bg-background animate-pulse">
      {/* Header Skeleton */}
      <div className="flex h-[60px] items-center justify-between border-b px-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 rounded bg-muted" />
          <div className="h-9 w-16 rounded bg-muted" />
          <div className="h-9 w-16 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded bg-muted" />
          <div className="h-9 w-20 rounded bg-muted" />
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton (hidden on mobile) */}
        <div className="hidden md:flex w-[15%] flex-col border-r bg-card p-4 gap-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-6 w-6 rounded bg-muted" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-9 w-full rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
          </div>
        </div>

        {/* Editor Area Skeleton */}
        <div className="flex-1 flex flex-col p-6 gap-4">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="flex-1 rounded-xl bg-muted/40 border border-muted/50 p-4 mt-2">
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-muted/50" />
              <div className="h-4 w-5/6 rounded bg-muted/50" />
              <div className="h-4 w-4/5 rounded bg-muted/50" />
              <div className="h-4 w-full rounded bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EditorWorkspace = dynamic(
  () =>
    import("@/components/editor/editor-workspace").then(
      (mod) => mod.EditorWorkspace
    ),
  {
    ssr: false,
    loading: () => <EditorLoadingSkeleton />
  }
);

export default function EditorPage() {
  return <EditorWorkspace />;
}
