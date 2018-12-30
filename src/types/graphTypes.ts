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
