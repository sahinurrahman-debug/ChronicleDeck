"use client";

import { SlotChart } from "@/components/health/slot-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { KIND_LABEL } from "@/lib/labels";
import { HEALTH_STATS, SCORE_BREAKDOWN } from "@/lib/mock/health";
import { useMock } from "@/lib/use-mock";

export default function HealthPage() {
  const stats = useMock("health", { HEALTH_STATS, SCORE_BREAKDOWN }, 700);

  return (
    <Page>
      <PageHeader
        eyebrow="Story health"
        title="How consistent is your story?"
        description="A quick read on how well your chapters fit together, and what each check costs."
      />
      <PreviewNote />

      {stats.isPending ? (
        <LoadingRegion label="Loading story health" className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </LoadingRegion>
      ) : (
        <>
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.data?.HEALTH_STATS.map((s) => (
              <Card key={s.label} className="animate-fade-up p-6">
                <p className="text-[15px] text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-serif text-4xl font-semibold tabular-nums">{s.value}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{s.note}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>What the assistant reads at each step</CardTitle>
                <p className="text-[15px] text-muted-foreground">
                  More of your story read means better checks, and a higher cost.
                </p>
              </CardHeader>
              <CardContent>
                <SlotChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open notes by type</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {stats.data?.SCORE_BREAKDOWN.map((r) => (
                    <li key={r.kind} className="flex items-center justify-between py-3">
                      <span>{KIND_LABEL[r.kind]}</span>
                      <Badge tone={r.tone}>{r.open === 0 ? "None" : r.open}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Page>
  );
}
