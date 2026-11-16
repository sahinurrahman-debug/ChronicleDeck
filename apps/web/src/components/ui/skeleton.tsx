import { cn } from "@/lib/utils";

/** Placeholder block shown while content loads. Pulses gently; respects reduced motion via globals.css. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

/** Wraps a loading region so screen readers hear one "loading" message instead of nothing. */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <Skeleton className="mb-4 h-6 w-2/5" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-6 h-4 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
