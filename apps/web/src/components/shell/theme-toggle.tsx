"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/use-theme";

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-all duration-200 hover:bg-muted active:scale-95"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
