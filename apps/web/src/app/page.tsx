import {
  BookMarked,
  FileText,
  GitBranch,
  Languages,
  Lightbulb,
  Mic2,
  ShieldCheck,
  Upload,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CtaBanner } from "@/components/ui/cta-banner";

const STEPS = [
  {
    icon: Upload,
    title: "Bring what you have",
    text: "Paste notes, a draft, or a character sketch. We turn them into a story bible, and you approve each entry.",
  },
  {
    icon: Wand2,
    title: "Write your way",
    text: "Write on your own, write together, or ask for a draft. Choose a plain, polished or vivid style.",
  },
  {
    icon: ShieldCheck,
    title: "Fix with confidence",
    text: "Every note shows exactly what it clashes with, so you can fix it, or keep it because you meant it.",
  },
];

const FEATURES = [
  { icon: BookMarked, title: "A story bible that stays current", text: "One home for every character, place, rule and invented word, built from your own notes." },
  { icon: FileText, title: "Gentle story checks", text: "While you write, we quietly mark anything that clashes with what you've already established." },
  { icon: Mic2, title: "Voices that stay true", text: "Give each character their own way of speaking and keep it steady from first chapter to last." },
  { icon: Languages, title: "Invented languages, kept honest", text: "Words that aren't in your dictionary are flagged, so a made-up language never drifts." },
  { icon: GitBranch, title: "Try other paths", text: "Split your story at any chapter, then compare how each version turns out." },
  { icon: Lightbulb, title: "You stay in charge", text: "New ideas arrive as suggestions. Nothing joins your story until you say yes." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-foreground/[0.04]"
        />
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              For novelists, screenwriters and world-builders
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] sm:text-6xl">
              Write long stories without losing the plot.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-muted-foreground">
              ChronicleDeck remembers every character, rule and timeline in your world, and quietly tells you
              when a new chapter doesn&apos;t fit, and why.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/start">Start your story</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/write">See it in action</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted-foreground">
              {["Novels", "Screenplays", "Game worlds", "Fan fiction"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview: a passage with one highlighted sentence and the note it triggers */}
          <div className="relative animate-fade-up [animation-delay:120ms]" aria-hidden>
            <Card className="p-7 sm:p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Chapter 3 · The Harbour
              </p>
              <p className="font-serif text-xl leading-9">
                Mara reached the harbour at dusk. She had not spoken to her brother since the night the Court
                burned. &ldquo;Corin,&rdquo; she said, and{" "}
                <span className="lint lint-warn">the word came out warm, almost fond.</span>
              </p>
            </Card>
            <Card className="relative -mt-4 ml-6 p-5 shadow-lift sm:ml-12">
              <p className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-warn">
                <span className="h-2 w-2 rounded-full bg-warn" aria-hidden /> Worth a look
              </p>
              <p className="text-[15px] leading-6">
                Mara deeply distrusts Corin at this point. Sounding warm toward him needs a reason.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">From chapter 3 of your story</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-20">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="text-4xl font-semibold">Three steps, no manual</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Card interactive className="h-full p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-serif text-3xl text-muted-foreground/70">{i + 1}</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold">{s.title}</h3>
                  <p className="text-muted-foreground">{s.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Features */}
      <section className="border-y border-border/60 bg-muted/40 py-20">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Everything in one place
            </p>
            <h2 className="text-4xl font-semibold">A calm second pair of eyes</h2>
          </div>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card text-foreground shadow-soft">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="mb-1 text-xl font-semibold">{f.title}</h3>
                  <p className="text-muted-foreground">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Closing call to action */}
      <section className="pt-20">
        <Container>
          <CtaBanner
            title="Your next chapter starts here."
            description="Bring your notes or start from a blank page. It takes a minute, and nothing is added to your story without your say-so."
            actions={
              <>
                <Button asChild size="lg" variant="inverse">
                  <Link href="/start">Start your story</Link>
                </Button>
                <Button asChild size="lg" variant="inverse-outline">
                  <Link href="/bible">Browse a sample bible</Link>
                </Button>
              </>
            }
          />
        </Container>
      </section>
    </>
  );
}
