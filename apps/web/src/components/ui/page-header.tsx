import * as React from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

/** Marks screens whose data is still placeholder content. Removed screen by screen when wired. */
export function MockNotice() {
  return (
    <p className="mb-4 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
      Pre-build scaffold: this screen shows sample data. It is wired to the pipeline during the live build.
    </p>
  );
}
