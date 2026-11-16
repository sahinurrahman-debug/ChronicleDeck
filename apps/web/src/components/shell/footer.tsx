import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NAV } from "@/lib/nav";

const GROUPS = [
  { title: "Write", links: NAV.filter((n) => ["/write", "/screenplay", "/suggestions"].includes(n.href)) },
  { title: "Your story", links: NAV.filter((n) => ["/bible", "/storylines", "/compare", "/health"].includes(n.href)) },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-2xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpen className="h-[18px] w-[18px]" aria-hidden />
            </span>
            ChronicleDeck
          </Link>
          <p className="mt-4 text-muted-foreground">
            A writing companion that remembers your whole world, so you can focus on the story.
          </p>
        </div>

        {GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {g.title}
            </h2>
            <ul className="space-y-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-muted-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Our promise
          </h2>
          <p className="text-muted-foreground">
            Your story stays yours. Nothing is added to your story bible unless you approve it.
          </p>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-5 text-[15px] text-muted-foreground">
          <p>© {new Date().getFullYear()} ChronicleDeck. Made for storytellers.</p>
          <Link href="/start" className="font-medium text-foreground hover:underline">
            Start a new story
          </Link>
        </Container>
      </div>
    </footer>
  );
}
