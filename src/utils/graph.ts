import { Graph } from 'graphlib';

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
  isContext?: boolean;
}

export interface D3GraphLink {
  source: NodeID;
  target: NodeID;
}

export class CIGraph extends Graph {
  constructor() {
    super();
  }
  public fromD3Graph = (graph: D3Graph) => {
    graph.nodes.map((node: D3GraphNode) => {
      this.setNode(node.id.toString(), node.id);
    });
    graph.links.map((link: D3GraphLink) => {
      this.setEdge(link.source.toString(), link.target.toString());
    });
  };

  public getContext(node: string): D3Graph {
    const neighbors = this.neighbors(node);
    const newLinks = this.nodeEdges(node);
    if (neighbors && newLinks) {
      return {
        nodes: neighbors.map(n => ({ id: n })),
        links: newLinks.map(link => ({ source: link.v, target: link.w })),
      };
    }
    return {
      nodes: [],
      links: [],
    };
  }

  public toD3Graph = (): D3Graph => {
    return {
      nodes: this.nodes().map(n => ({ id: n })),
      links: this.edges().map(link => ({ source: link.v, target: link.w })),
    };
  };
}

export function addUniqueLinks(
  links: any,
  addLinks: D3GraphLink[],
): D3GraphLink[] {
  addLinks.forEach(link => {
    if (
      links.find(
        (existingLink: any) =>
          existingLink.source.id === link.source &&
          existingLink.target.id === link.target,
      ) === undefined
    ) {
      links.push(link);
    }
  });
  return links as D3GraphLink[];
}

export function addUniqueNodes(
  nodes: D3GraphNode[],
  addToFocusNodeID: string,
  addNodes: D3GraphNode[],
): D3GraphNode[] {
  let isAlreadyIn = false;

  nodes.forEach(existingNode => {
    existingNode.fx = existingNode.x;
    existingNode.fy = existingNode.y;

    if (existingNode.id === addToFocusNodeID) {
      existingNode.isContext = false;
      isAlreadyIn = true;
    }
  });

  if (!isAlreadyIn) {
    nodes.push({ id: addToFocusNodeID, isContext: false });
  }

  addNodes.forEach(addNode => {
    if (nodes.find(n => n.id === addNode.id) === undefined) {
      addNode.isContext = true;
      nodes.push(addNode);
    }
  });
  return nodes;
}

export function resetLayout(graph: D3Graph): D3Graph {
  graph.nodes.forEach(node => {
    delete node.fx;
    delete node.fy;
    node.vx = 0;
    node.vy = 0;
  });
  return graph;
}
