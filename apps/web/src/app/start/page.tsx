import { FileUp, ListChecks, PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Start a story" };

const NEXT_STEPS = [
  { icon: FileUp, text: "We read what you share and pick out characters, places, rules and invented words." },
  { icon: ListChecks, text: "You review each one and approve, edit or remove it." },
  { icon: PenLine, text: "Start writing. We'll flag anything that doesn't fit your story bible." },
];

export default function StartPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="New story"
        title="Let's start your story"
        description="Any genre, any world, any invented language. Share what you have, or begin with a blank page."
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 sm:p-8">
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-base font-semibold">
                Working title
              </label>
              <Input id="title" placeholder="Untitled story" />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-base font-semibold">
                Tell us about your world
              </label>
              <p id="notes-help" className="text-[15px] text-muted-foreground">
                Paste anything: notes, a draft chapter, character sketches. Messy is fine.
              </p>
              <Textarea
                id="notes"
                aria-describedby="notes-help"
                className="min-h-52"
                placeholder="Mara is a harbour smuggler who hasn't spoken to her brother since…"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="file" className="block text-base font-semibold">
                Or upload a file
              </label>
              <p className="text-[15px] text-muted-foreground">Text, Markdown, Word or PDF.</p>
              <Input id="file" type="file" accept=".txt,.md,.docx,.pdf" className="h-auto py-3" />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link href="/bible">Build my story bible</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/write">Just start writing</Link>
              </Button>
            </div>
          </form>
        </Card>

        <aside aria-label="What happens next">
          <h2 className="mb-5 font-sans text-lg font-semibold">What happens next</h2>
          <ol className="space-y-5">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.text} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="pt-1.5">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-xl bg-muted px-4 py-3 text-[15px] text-muted-foreground">
            Nothing is added to your story unless you approve it.
          </p>
        </aside>
      </div>
    </Page>
  );
}
