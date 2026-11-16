import type { Edge, Node } from "@xyflow/react";
import type { ChapterNodeData } from "@/lib/types";

export type ChapterFlowNode = Node<ChapterNodeData, "chapter">;

// `score` is how well the chapter fits the story so far (0 to 1).
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
  mk("m1", "Chapter 1", "Original", 0.96, 0, 0),
  mk("m2", "Chapter 2", "Original", 0.93, 210, 0),
  mk("m3", "Chapter 3", "Original", 0.71, 420, 0),
  mk("m4", "Chapter 4", "Original", 0.88, 630, 0),
  mk("a4", "Chapter 4", "Corin refuses", 0.64, 630, 140),
  mk("a5", "Chapter 5", "Corin refuses", 0.78, 840, 140),
  mk("b3", "Chapter 3", "Mara betrays", 0.9, 420, 280),
  mk("b4", "Chapter 4", "Mara betrays", 0.52, 630, 280),
];

export const GRAPH_EDGES: Edge[] = [
  { id: "e1", source: "m1", target: "m2" },
  { id: "e2", source: "m2", target: "m3" },
  { id: "e3", source: "m3", target: "m4" },
  { id: "e4", source: "m3", target: "a4", label: "split" },
  { id: "e5", source: "a4", target: "a5" },
  { id: "e6", source: "m2", target: "b3", label: "split" },
  { id: "e7", source: "b3", target: "b4" },
];
