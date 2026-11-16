"use client";

import { BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-2xl font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BookOpen className="h-[18px] w-[18px]" aria-hidden />
          </span>
          ChronicleDeck
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors duration-200",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/start">Start a story</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/70 xl:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="animate-fade-up border-t border-border bg-background xl:hidden"
        >
          <Container className="grid gap-1 py-4">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium",
                  pathname === href ? "bg-foreground/10" : "hover:bg-foreground/5",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            ))}
            <Button asChild className="mt-2 sm:hidden" size="lg">
              <Link href="/start">Start a story</Link>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
