type NodeID = string | number;

export interface D3Graph {
  nodes: Array<D3GraphNode>;
  links: Array<D3GraphLink>;
}

export interface D3GraphNode {
  id: NodeID;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
}

export interface D3GraphLink {
  source: NodeID;
  target: NodeID;
}
