import { ID3Graph, ID3GraphLink, ID3GraphNode } from './../types/graphTypes';
import { Graph } from 'graphlib';
import { IAPIResult } from '../types';
import { IAPIGraphEdges, IAPIGraphNode } from '../types/graphTypes';

export class CIGraph extends Graph {
  constructor() {
    super();
  }
  public fromD3Graph = (graph: ID3Graph) => {
    graph.nodes.map((node: ID3GraphNode) => {
      this.setNode(node.id.toString(), node.label);
    });
    graph.links.map((link: ID3GraphLink) => {
      this.setEdge(link.source.toString(), link.target.toString());
    });
  }

  public fromAPIGraph = (results: IAPIResult) => {
    results.nodes.map((node: IAPIGraphNode) => {
      this.setNode(node.id.toString(), node.name);
    });
    results.edges.map((link: IAPIGraphEdges) => {
      this.setEdge(link.from_node.toString(), link.to_node.toString());
    });
  }

  public getContext(node: string): ID3Graph {
    const neighbors = this.neighbors(node);
    const newLinks = this.nodeEdges(node);
    if (neighbors && newLinks) {
      return {
        nodes: neighbors.map((n) => ({ id: n, label: this.node(n) })),
        links: newLinks.map((link) => ({ source: link.v, target: link.w })),
      };
    }
    return {
      nodes: [],
      links: [],
    };
  }

  public toD3Graph = (): ID3Graph => {
    return {
      nodes: this.nodes().map((n) => ({ id: n, label: this.node(n) })),
      links: this.edges().map((link) => ({ source: link.v, target: link.w })),
    };
  }
}

export function addUniqueLinks(
  links: any,
  addLinks: ID3GraphLink[],
): ID3GraphLink[] {
  addLinks.forEach((link) => {
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
  return links as ID3GraphLink[];
}

export function addUniqueNodes(
  nodes: ID3GraphNode[],
  graph: CIGraph,
  addToFocusNodeID: string,
  addNodes: ID3GraphNode[],
  doFreeze: boolean,
): ID3GraphNode[] {
  let isAlreadyIn = false;

  nodes.forEach((existingNode) => {
    if (doFreeze) {
      existingNode.fx = existingNode.x;
      existingNode.fy = existingNode.y;
    }

    if (existingNode.id === addToFocusNodeID) {
      existingNode.isContext = false;
      isAlreadyIn = true;
    }
  });

  if (!isAlreadyIn) {
    nodes.push({
      id: addToFocusNodeID,
      isContext: false,
      label: graph.node(addToFocusNodeID),
    });
  }

  addNodes.forEach((addNode) => {
    if (nodes.find((n) => n.id === addNode.id) === undefined) {
      addNode.isContext = true;
      nodes.push(addNode);
    }
  });
  return nodes;
}

export function resetLayout(graph: ID3Graph): ID3Graph {
  graph.nodes.forEach((node) => {
    delete node.fx;
    delete node.fy;
    node.vx = 0;
    node.vy = 0;
  });
  return graph;
}
