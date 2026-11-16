"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SLOT_KEYS, SLOT_LABEL, SLOT_TOKENS } from "@/lib/mock/health";

const tick = { fontSize: 14, fill: "rgb(var(--muted-foreground))" };

// One colour per kind of context, taken from the theme so it reads in light and dark.
const SERIES_COLOR: Record<(typeof SLOT_KEYS)[number], string> = {
  global: "rgb(var(--chart-1))",
  character: "rgb(var(--chart-2))",
  branch: "rgb(var(--chart-3))",
  episodic: "rgb(var(--chart-4))",
  task: "rgb(var(--chart-5))",
};

export function SlotChart() {
  return (
    <div className="h-80" role="img" aria-label="Stacked bar chart: how much of your story is read at each step">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SLOT_TOKENS} margin={{ top: 12, right: 16, bottom: 4, left: -4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
          <XAxis dataKey="stage" tick={tick} stroke="rgb(var(--border))" />
          <YAxis tick={tick} stroke="rgb(var(--border))" />
          <Tooltip
            cursor={{ fill: "rgb(var(--muted) / 0.5)" }}
            contentStyle={{
              background: "rgb(var(--card))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              color: "rgb(var(--foreground))",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 15 }} />
          {SLOT_KEYS.map((k) => (
            <Bar key={k} dataKey={k} name={SLOT_LABEL[k]} stackId="reads" fill={SERIES_COLOR[k]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
