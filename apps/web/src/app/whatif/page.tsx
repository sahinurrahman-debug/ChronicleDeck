import { ArcChart } from "@/components/whatif/arc-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { BRANCH_A, BRANCH_B, RELATIONSHIPS, WORLD_DIFF } from "@/lib/mock/whatif";
import { cn } from "@/lib/utils";

const SIGN = { added: "+", removed: "−", changed: "~" } as const;
const TONE = { added: "ok", removed: "error", changed: "warn" } as const;

function cell(v: number) {
  // diverging scale: negative = danger, positive = ok, strength = opacity
  const alpha = Math.min(1, Math.abs(v)) * 0.5;
  const color = v < 0 ? "var(--danger)" : "var(--ok)";
  return { backgroundColor: `hsl(${color} / ${alpha.toFixed(2)})` };
}

export default function WhatIfPage() {
  const rels = [...RELATIONSHIPS].sort((x, y) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a));

  return (
    <div>
      <PageHeader
        title="What-if explorer"
        description={`Compare "${BRANCH_A}" with "${BRANCH_B}" from the point they diverge.`}
      />
      <MockNotice />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>World differences</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium" />
                  <th className="pb-2 font-medium">Subject</th>
                  <th className="pb-2 font-medium">{BRANCH_A}</th>
                  <th className="pb-2 font-medium">{BRANCH_B}</th>
                  <th className="pb-2 font-medium">Where</th>
                </tr>
              </thead>
              <tbody>
                {WORLD_DIFF.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-2 pr-2">
                      <Badge tone={TONE[r.change]}>{SIGN[r.change]}</Badge>
                    </td>
                    <td className="py-2 pr-2 font-medium">{r.subject}</td>
                    <td className="py-2 pr-2 text-muted-foreground">{r.a ?? "—"}</td>
                    <td className="py-2 pr-2 text-muted-foreground">{r.b ?? "—"}</td>
                    <td className="py-2 text-primary">{r.chapter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relationships (trust), most divergent first</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Pair</th>
                  <th className="pb-2 text-center font-medium">{BRANCH_A}</th>
                  <th className="pb-2 text-center font-medium">{BRANCH_B}</th>
                  <th className="pb-2 text-right font-medium">Δ</th>
                </tr>
              </thead>
              <tbody>
                {rels.map((r) => {
                  const d = r.b - r.a;
                  return (
                    <tr key={r.pair} className="border-t border-border">
                      <td className="py-2 font-medium">{r.pair}</td>
                      <td className="py-2 text-center" style={cell(r.a)}>
                        {r.a.toFixed(1)}
                      </td>
                      <td className="py-2 text-center" style={cell(r.b)}>
                        {r.b.toFixed(1)}
                      </td>
                      <td className={cn("py-2 text-right tabular-nums", d < 0 ? "text-danger" : "text-ok")}>
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
            <CardTitle>Corin’s trust in Mara over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ArcChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
