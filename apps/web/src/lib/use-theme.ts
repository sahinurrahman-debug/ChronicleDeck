"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/** Current theme, kept in sync with the `dark` class on <html> (set before paint by the inline script). */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function setTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    window.localStorage.setItem("cd-theme", next);
  } catch {
    /* private mode: the theme still applies for this visit */
  }
}

/** Runs before first paint so there is no light-to-dark flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('cd-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;
