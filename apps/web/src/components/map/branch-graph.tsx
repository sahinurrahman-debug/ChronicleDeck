"use client";

import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GRAPH_EDGES, GRAPH_NODES, type ChapterFlowNode } from "@/lib/mock/graph";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

/** How well a chapter fits the story so far. */
export const FIT_LEGEND = [
  { label: "Fits well", className: "border-ok", min: 0.85 },
  { label: "Worth a look", className: "border-warn", min: 0.65 },
  { label: "Needs attention", className: "border-danger", min: 0 },
] as const;

function fit(score: number) {
  return FIT_LEGEND.find((f) => score >= f.min) ?? FIT_LEGEND[2];
}

function ChapterNode({ data }: NodeProps<ChapterFlowNode>) {
  const f = fit(data.score);
  return (
    <div className={cn("min-w-36 rounded-xl border-2 bg-card px-4 py-3 text-center shadow-soft", f.className)}>
      <Handle type="target" position={Position.Left} className="!border-0 !bg-border" />
      <p className="text-base font-semibold">{data.label}</p>
      <p className="text-sm text-muted-foreground">{data.branch}</p>
      <p className="mt-0.5 text-sm font-medium">{Math.round(data.score * 100)}% fit</p>
      <Handle type="source" position={Position.Right} className="!border-0 !bg-border" />
    </div>
  );
}

const nodeTypes = { chapter: ChapterNode };

export function BranchGraph() {
  const theme = useTheme();
  return (
    <div className="h-[34rem] overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <ReactFlow
        nodes={GRAPH_NODES}
        edges={GRAPH_EDGES}
        nodeTypes={nodeTypes}
        colorMode={theme}
        fitView
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        aria-label="Map of your storylines"
      >
        <Background gap={22} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable ariaLabel="Overview of storylines" />
      </ReactFlow>
    </div>
  );
}
