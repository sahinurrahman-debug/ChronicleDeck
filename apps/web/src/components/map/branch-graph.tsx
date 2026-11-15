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
import { cn } from "@/lib/utils";

function tone(score: number) {
  if (score >= 0.85) return "border-ok text-ok";
  if (score >= 0.65) return "border-warn text-warn";
  return "border-danger text-danger";
}

function ChapterNode({ data }: NodeProps<ChapterFlowNode>) {
  return (
    <div className={cn("rounded-md border-2 bg-card px-3 py-2 text-center shadow-sm", tone(data.score))}>
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <p className="text-sm font-semibold text-foreground">{data.label}</p>
      <p className="text-[11px] text-muted-foreground">{data.branch}</p>
      <p className="text-xs font-medium">{Math.round(data.score * 100)}</p>
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  );
}

const nodeTypes = { chapter: ChapterNode };

export function BranchGraph() {
  return (
    <div className="h-[32rem] overflow-hidden rounded-lg border border-border bg-card">
      <ReactFlow
        nodes={GRAPH_NODES}
        edges={GRAPH_EDGES}
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
