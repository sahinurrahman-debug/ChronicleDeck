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
import { SLOT_KEYS, SLOT_TOKENS } from "@/lib/mock/health";

// Five slots = five memory types. Hues are fixed per slot so the same slot reads the same everywhere.
const SLOT_COLOR: Record<(typeof SLOT_KEYS)[number], string> = {
  global: "hsl(248 55% 55%)",
  character: "hsl(32 90% 50%)",
  branch: "hsl(152 55% 40%)",
  episodic: "hsl(210 70% 52%)",
  task: "hsl(0 0% 55%)",
};

export function SlotChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SLOT_TOKENS} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {SLOT_KEYS.map((k) => (
            <Bar key={k} dataKey={k} stackId="slots" fill={SLOT_COLOR[k]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
