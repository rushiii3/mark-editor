"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/components/editor/types";

type TableOfContentsPanelProps = {
  headings: TocHeading[];
  activeHeadingId: string | null;
  onSelect: (id: string) => void;
};

export function TableOfContentsPanel({
  headings,
  activeHeadingId,
  onSelect,
}: TableOfContentsPanelProps) {
  return (
    <Card className="h-full rounded-none border-0 bg-background py-0 shadow-none ring-0">
      <CardHeader className="px-5 py-5">
        <CardDescription className="text-[11px] font-semibold tracking-[0.2em] uppercase">
          On this page
        </CardDescription>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-74px)] px-3 pb-4">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 pr-3">
            {headings.map((heading) => (
              <button
                key={heading.id}
                type="button"
                onClick={() => onSelect(heading.id)}
                className={cn(
                  "truncate rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  heading.level > 2 && "pl-6",
                  heading.level > 3 && "pl-9",
                  activeHeadingId === heading.id && "bg-muted text-foreground"
                )}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
