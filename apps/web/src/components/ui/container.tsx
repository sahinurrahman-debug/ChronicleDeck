import * as React from "react";
import { cn } from "@/lib/utils";

/** Consistent page width and side padding. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

/** Standard page body: container plus vertical rhythm. */
export function Page({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Container className={cn("py-10 sm:py-14", className)} {...props} />;
}
