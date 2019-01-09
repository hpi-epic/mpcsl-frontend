type NodeID = string | number;

export interface ID3Graph {
  nodes: ID3GraphNode[];
  links: ID3GraphLink[];
}

export interface ID3GraphNode {
  id: NodeID;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  isContext?: boolean;
}

export interface ID3GraphLink {
  source: NodeID;
  target: NodeID;
}

export interface IAPIGraphNode {
  id: number;
  name: string;
  result: number;
  result_id: number;
}

export interface IAPIGraphEdges {
  id: number;
  result: number;
  result_id: number;
  from_node_id: number;
  from_node: number;
  to_node_id: number;
  to_node: number;
  start_time: string;
}
