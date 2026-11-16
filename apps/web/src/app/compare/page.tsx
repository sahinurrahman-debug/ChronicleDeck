"use client";

import { ArrowLeftRight } from "lucide-react";
import { ArcChart } from "@/components/compare/arc-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { CardSkeleton, LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import {
  RELATIONSHIPS,
  STORYLINE_A,
  STORYLINE_B,
  WORLD_DIFF,
  type DiffRow,
} from "@/lib/mock/compare";
import { useMock } from "@/lib/use-mock";
import { cn } from "@/lib/utils";

const CHANGE = {
  added: { label: "New", tone: "ok" },
  removed: { label: "Gone", tone: "error" },
  changed: { label: "Different", tone: "warn" },
} as const;

// Diverging scale: red-brown for distrust, green for trust; strength sets the opacity.
function shade(v: number) {
  const base = v < 0 ? "var(--danger)" : "var(--ok)";
  return { backgroundColor: `rgb(${base} / ${(Math.min(1, Math.abs(v)) * 0.35).toFixed(2)})` };
}

export default function ComparePage() {
  const data = useMock("compare", { diff: WORLD_DIFF as DiffRow[], rels: RELATIONSHIPS }, 700);
  const rels = [...(data.data?.rels ?? [])].sort((x, y) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a));

  return (
    <Page>
      <PageHeader
        eyebrow="Compare"
        title="Two storylines, side by side"
        description="See how your story changes from the chapter where the two paths split."
      />
      <PreviewNote />

      <p className="mb-8 flex flex-wrap items-center gap-3 text-lg">
        <Badge className="px-4 py-1 text-base">{STORYLINE_A}</Badge>
        <ArrowLeftRight className="h-5 w-5 text-muted-foreground" aria-label="compared with" />
        <Badge tone="warn" className="px-4 py-1 text-base">
          {STORYLINE_B}
        </Badge>
      </p>

      {data.isPending ? (
        <LoadingRegion label="Comparing storylines" className="grid gap-6 xl:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
          <Skeleton className="h-80 w-full xl:col-span-2" />
        </LoadingRegion>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>What changed in your world</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left">
                <caption className="sr-only">Differences between the two storylines</caption>
                <thead className="text-sm text-muted-foreground">
                  <tr>
                    <th scope="col" className="pb-3 pr-3 font-medium">Change</th>
                    <th scope="col" className="pb-3 pr-3 font-medium">What</th>
                    <th scope="col" className="pb-3 pr-3 font-medium">{STORYLINE_A}</th>
                    <th scope="col" className="pb-3 pr-3 font-medium">{STORYLINE_B}</th>
                    <th scope="col" className="pb-3 font-medium">Where</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data?.diff.map((r) => (
                    <tr key={r.id} className="border-t border-border align-top">
                      <td className="py-3 pr-3">
                        <Badge tone={CHANGE[r.change].tone}>{CHANGE[r.change].label}</Badge>
                      </td>
                      <td className="py-3 pr-3 font-medium">{r.subject}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{r.a ?? "—"}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{r.b ?? "—"}</td>
                      <td className="py-3 font-medium">{r.chapter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How much characters trust each other</CardTitle>
              <p className="text-[15px] text-muted-foreground">
                From −1 (not at all) to 1 (completely). Biggest differences first.
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[26rem] text-left">
                <caption className="sr-only">Trust between characters in each storyline</caption>
                <thead className="text-sm text-muted-foreground">
                  <tr>
                    <th scope="col" className="pb-3 pr-3 font-medium">Who</th>
                    <th scope="col" className="pb-3 text-center font-medium">{STORYLINE_A}</th>
                    <th scope="col" className="pb-3 text-center font-medium">{STORYLINE_B}</th>
                    <th scope="col" className="pb-3 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {rels.map((r) => {
                    const d = r.b - r.a;
                    return (
                      <tr key={r.pair} className="border-t border-border">
                        <td className="py-3 pr-3 font-medium">{r.pair}</td>
                        <td className="py-3 text-center tabular-nums" style={shade(r.a)}>{r.a.toFixed(1)}</td>
                        <td className="py-3 text-center tabular-nums" style={shade(r.b)}>{r.b.toFixed(1)}</td>
                        <td className={cn("py-3 text-right tabular-nums font-medium", d < 0 ? "text-danger" : "text-ok")}>
                          {d > 0 ? "+" : ""}
                          {d.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Corin&apos;s trust in Mara, chapter by chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ArcChart />
            </CardContent>
          </Card>
        </div>
      )}
    </Page>
  );
}
