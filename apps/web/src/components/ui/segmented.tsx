"use client";

import { cn } from "@/lib/utils";

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  /** Accessible name; also shown above the control when `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  className?: string;
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  label,
  showLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {showLabel && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex w-fit rounded-full border border-border bg-muted p-1"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-9 rounded-full px-4 text-[15px] font-medium transition-all duration-200",
              o.value === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
