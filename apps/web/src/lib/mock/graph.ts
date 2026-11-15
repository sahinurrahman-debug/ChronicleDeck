import type { Edge, Node } from "@xyflow/react";
import type { ChapterNodeData } from "@/lib/types";

export type ChapterFlowNode = Node<ChapterNodeData, "chapter">;

const mk = (
  id: string,
  label: string,
  branch: string,
  score: number,
  x: number,
  y: number,
): ChapterFlowNode => ({
  id,
  type: "chapter",
  position: { x, y },
  data: { label, branch, score },
});

export const GRAPH_NODES: ChapterFlowNode[] = [
  mk("m1", "Ch 1", "main", 0.96, 0, 0),
  mk("m2", "Ch 2", "main", 0.93, 190, 0),
  mk("m3", "Ch 3", "main", 0.71, 380, 0),
  mk("m4", "Ch 4", "main", 0.88, 570, 0),
  mk("a4", "Ch 4′", "corin-refuses", 0.64, 570, 130),
  mk("a5", "Ch 5′", "corin-refuses", 0.78, 760, 130),
  mk("b3", "Ch 3″", "mara-betrays", 0.9, 380, 260),
  mk("b4", "Ch 4″", "mara-betrays", 0.52, 570, 260),
];

export const GRAPH_EDGES: Edge[] = [
  { id: "e1", source: "m1", target: "m2" },
  { id: "e2", source: "m2", target: "m3" },
  { id: "e3", source: "m3", target: "m4" },
  { id: "e4", source: "m3", target: "a4", label: "fork" },
  { id: "e5", source: "a4", target: "a5" },
  { id: "e6", source: "m2", target: "b3", label: "fork" },
  { id: "e7", source: "b3", target: "b4" },
];
