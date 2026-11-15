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
import { ARC_SERIES, BRANCH_A, BRANCH_B, FORK_CHAPTER } from "@/lib/mock/whatif";

export function ArcChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ARC_SERIES} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="chapter" tick={{ fontSize: 12 }} />
          <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <ReferenceLine
            x={FORK_CHAPTER}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{ value: "fork", fontSize: 11 }}
          />
          <Line type="monotone" dataKey="main" name={BRANCH_A} stroke="hsl(var(--primary))" strokeWidth={2} />
          <Line type="monotone" dataKey="fork" name={BRANCH_B} stroke="hsl(var(--warn))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
