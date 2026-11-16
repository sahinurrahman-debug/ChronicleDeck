"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KIND_LABEL, SEVERITY_LABEL } from "@/lib/labels";
import type { LintViolation } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE = { info: "info", warn: "warn", error: "error" } as const;

/**
 * One note about the text: what we noticed, the sentence it's about, and why.
 * Every note can be fixed, kept on purpose, or traced back to a rule you can change.
 */
export function NoteCard({
  violation,
  active,
  onSelect,
  onFix,
  onKeep,
}: {
  violation: LintViolation;
  active: boolean;
  onSelect: () => void;
  onFix: () => void;
  onKeep: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={cn(
        "animate-fade-up cursor-pointer rounded-2xl border bg-card p-5 shadow-soft transition-all duration-200",
        active ? "border-foreground shadow-lift" : "border-border hover:shadow-lift",
      )}
    >
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={TONE[violation.severity]}>{SEVERITY_LABEL[violation.severity]}</Badge>
        <span className="text-[15px] text-muted-foreground">{KIND_LABEL[violation.kind]}</span>
      </header>

      <p className="mb-4 text-base leading-7">{violation.message}</p>

      <p className="mb-1 text-sm font-semibold text-muted-foreground">In your text</p>
      <blockquote className="mb-4 border-l-2 border-warn pl-3 font-serif text-base italic">
        “{violation.quote}”
      </blockquote>

      <p className="mb-2 text-sm font-semibold text-muted-foreground">Why we noticed</p>
      <ul className="mb-5 space-y-2">
        {violation.evidence.map((e) => (
          <li key={e.label + e.quote} className="rounded-xl bg-muted px-3.5 py-2.5 text-[15px] leading-6">
            <span className="font-medium">{e.label}</span>
            {e.location && <span className="text-muted-foreground"> · {e.location}</span>}
            <p className="mt-0.5 text-muted-foreground">“{e.quote}”</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onFix();
          }}
        >
          Fix this
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onKeep();
          }}
        >
          Keep as is
        </Button>
        <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
          Change the rule
        </Button>
      </div>
    </article>
  );
}
