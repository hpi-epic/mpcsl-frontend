import { SimulationNodeDatum } from 'd3';

export interface ID3Graph {
  nodes: ID3GraphNode[];
  links: ID3GraphLink[];
}

export interface ID3GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  isContext?: boolean;
  contextOf?: string[];
}

export interface ID3GraphLink {
  source: (SimulationNodeDatum & ID3GraphNode) | string;
  target: (SimulationNodeDatum & ID3GraphNode) | string;
}

export interface IAPIGraphNode {
  id: number;
  name: string;
  dataset: number;
  dataset_id: number;
}

export interface IAPIGraphEdges {
  id: number;
  result: number;
  result_id: number;
  weight: number;
  is_ground_truth?: boolean;
  from_node_id: number;
  from_node: number;
  to_node_id: number;
  to_node: number;
}
