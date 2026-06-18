"use client";

import { memo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/components/editor/types";
import { Button } from "../ui/button";

type TableOfContentsPanelProps = {
  headings: TocHeading[];
  activeHeadingId: string | null;
  onSelect: (id: string) => void;
};

const indentByLevel: Record<number, string> = {
  1: "ml-3",
  2: "ml-6",
  3: "ml-9",
  4: "ml-12",
  5: "ml-15",
  6: "ml-18"
};

export const TableOfContentsPanel = memo(function TableOfContentsPanel({
  headings,
  activeHeadingId,
  onSelect
}: TableOfContentsPanelProps) {
  return (
    <Card className="h-full rounded-none border-0 bg-background py-0 shadow-none ring-0">
      <CardHeader className="px-5 mt-5">
        <CardDescription className="uppercase">On this page</CardDescription>
        <CardTitle className="text-muted-foreground">
          Table of Contents
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[calc(100%-74px)] px-3 pb-4">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 pr-3 pb-3 items-start">
            {headings.map((heading) => (
              <Button
                key={heading.id}
                type="button"
                variant={"ghost"}
                onClick={() => onSelect(heading.id)}
                className={cn(
                  "text-left",
                  // "truncate rounded-lg py-2 pr-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  indentByLevel[heading.level] ?? "pl-3",
                  activeHeadingId === heading.id && "bg-muted text-foreground"
                )}
              >
                {heading.text}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});
