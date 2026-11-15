"use client";

import { Check, Pencil, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LintViolation } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE = { info: "info", warn: "warn", error: "error" } as const;

/** Trigger quote -> source quote -> jump. Every flag carries Fix / Intentional / Change rule. */
export function EvidenceCard({
  violation,
  active,
  onSelect,
}: {
  violation: LintViolation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-lg border bg-card p-3 text-sm transition-shadow",
        active ? "border-primary shadow-md" : "border-border hover:shadow-sm",
      )}
    >
      <header className="mb-2 flex items-center gap-2">
        <Badge tone={TONE[violation.severity]}>{violation.kind.replace("_", " ")}</Badge>
        <span className="text-xs text-muted-foreground">{violation.severity}</span>
      </header>
      <p className="mb-2 leading-5">{violation.message}</p>
      <blockquote className="mb-2 border-l-2 border-warn pl-2 text-xs italic text-muted-foreground">
        “{violation.quote}”
      </blockquote>
      <ul className="mb-3 space-y-1.5">
        {violation.evidence.map((e) => (
          <li key={e.label + e.quote} className="rounded-md bg-muted px-2 py-1.5 text-xs">
            <span className="font-medium">{e.label}</span>
            {e.location && <span className="text-muted-foreground"> · {e.location}</span>}
            <p className="mt-0.5 text-muted-foreground">“{e.quote}”</p>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant="outline">
          <Pencil className="h-3 w-3" aria-hidden /> Fix
        </Button>
        <Button size="sm" variant="outline">
          <Check className="h-3 w-3" aria-hidden /> Intentional
        </Button>
        <Button size="sm" variant="ghost">
          <SlidersHorizontal className="h-3 w-3" aria-hidden /> Change rule
        </Button>
      </div>
    </article>
  );
}
