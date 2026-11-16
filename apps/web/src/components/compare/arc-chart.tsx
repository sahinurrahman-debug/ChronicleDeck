"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ARC_SERIES, SPLIT_CHAPTER, STORYLINE_A, STORYLINE_B } from "@/lib/mock/compare";

const tick = { fontSize: 14, fill: "rgb(var(--muted-foreground))" };

export function ArcChart() {
  return (
    <div className="h-72" role="img" aria-label="Line chart: Corin's trust in Mara by chapter, in two storylines">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ARC_SERIES} margin={{ top: 12, right: 20, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="chapter" tick={tick} tickFormatter={(v: number) => `Ch ${v}`} stroke="rgb(var(--border))" />
          <YAxis domain={[-1, 1]} tick={tick} stroke="rgb(var(--border))" />
          <Tooltip
            contentStyle={{
              background: "rgb(var(--card))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              color: "rgb(var(--foreground))",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 15 }} />
          <ReferenceLine
            x={SPLIT_CHAPTER}
            stroke="rgb(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{ value: "split", fontSize: 14, fill: "rgb(var(--muted-foreground))" }}
          />
          <Line type="monotone" dataKey="original" name={STORYLINE_A} stroke="rgb(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="fork" name={STORYLINE_B} stroke="rgb(var(--chart-2))" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
