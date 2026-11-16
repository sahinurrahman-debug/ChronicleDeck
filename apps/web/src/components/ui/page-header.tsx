import { Info } from "lucide-react";
import * as React from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </header>
  );
}

/** Shown on screens that still use a sample story. */
export function PreviewNote() {
  return (
    <p className="mb-8 flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-card/60 px-4 py-3 text-[15px] text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      You&apos;re looking at a sample story. Your own chapters will appear here once you start writing.
    </p>
  );
}
