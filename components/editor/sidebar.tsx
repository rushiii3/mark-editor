const documents = [
  { id: "welcome", name: "Welcome.md", description: "Starter template" },
  { id: "notes", name: "Meeting Notes.md", description: "Placeholder draft" },
  { id: "guide", name: "Release Guide.md", description: "Placeholder draft" },
];

export function Sidebar() {
  return (
    <aside className="editor-sidebar border-border/80 bg-card/80 flex w-full shrink-0 flex-col border-b backdrop-blur md:w-72 md:border-r md:border-b-0">
      <div className="border-border/70 flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Documents
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Local Drafts
          </h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          New doc
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {documents.map((document, index) => (
          <button
            key={document.id}
            type="button"
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              index === 0
                ? "border-primary/25 bg-primary/8 shadow-sm"
                : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-accent/40"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">
              {document.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.description}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
