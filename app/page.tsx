import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Mark Editor
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Write Markdown, preview instantly, and export clean PDFs.
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          The editor is ready as a client-side Next.js route with Monaco,
          debounced preview rendering, slash commands, and PDF export.
        </p>
        <Link
          href="/editor"
          className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Open the editor
        </Link>
      </div>
    </main>
  );
}
