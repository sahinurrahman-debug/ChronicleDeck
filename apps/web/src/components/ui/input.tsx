import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-border bg-card px-4 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(field, "h-12", className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(field, "min-h-28 py-3 leading-7", className)} {...props} />
));
Textarea.displayName = "Textarea";
