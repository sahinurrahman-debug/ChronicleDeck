import type { LucideIcon } from "lucide-react";
import * as React from "react";

/** What people see when there is nothing to show yet: say why, and offer a next step. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex animate-fade-up flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
