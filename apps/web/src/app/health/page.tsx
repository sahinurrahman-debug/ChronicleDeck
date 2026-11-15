import { SlotChart } from "@/components/health/slot-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { HEALTH_STATS, SCORE_BREAKDOWN } from "@/lib/mock/health";

export default function HealthPage() {
  return (
    <div>
      <PageHeader
        title="Health & cost"
        description="How consistent the story is, and what each chapter costs to check."
      />
      <MockNotice />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HEALTH_STATS.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tokens per memory slot</CardTitle>
          </CardHeader>
          <CardContent>
            <SlotChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open flags by kind</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {SCORE_BREAKDOWN.map((r) => (
                <li key={r.kind} className="flex items-center justify-between text-sm">
                  <span>{r.kind.replace("_", " ")}</span>
                  <Badge tone={r.tone}>{r.open}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
