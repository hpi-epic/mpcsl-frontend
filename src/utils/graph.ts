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
    const contextNodeAlreadyIn = nodes.find((n) => n.id === addNode.id);
    if (contextNodeAlreadyIn === undefined) {
      addNode.isContext = true;
      addNode.contextOf = {};
      addNode.contextOf[addToFocusNodeID] = true;
      nodes.push(addNode);
    } else if (contextNodeAlreadyIn.id !== addToFocusNodeID) {
      if (contextNodeAlreadyIn.contextOf) {
        contextNodeAlreadyIn.contextOf[addToFocusNodeID] = true;
      } else {
        contextNodeAlreadyIn.contextOf = {};
        contextNodeAlreadyIn.contextOf[addToFocusNodeID] = true;
      }
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

export function removeNodeFromFocus(
  graph: ID3Graph,
  node: ID3GraphNode,
): ID3Graph {
  let links = graph.links;
  const nodes: ID3GraphNode[] = [];
  graph.nodes.forEach((existingNode: ID3GraphNode) => {
    if (existingNode.id !== node.id) {
      // delete node in contextOf for all other nodes
      if (existingNode.contextOf && node.id in existingNode.contextOf) {
        delete existingNode.contextOf[node.id];
        if (
          Object.keys(existingNode.contextOf).length > 0 ||
          !existingNode.isContext
        ) {
          nodes.push(existingNode);
        }
      } else {
        nodes.push(existingNode);
      }
    } else if (
      !existingNode.isContext &&
      existingNode.contextOf &&
      Object.keys(existingNode.contextOf).length > 0
    ) {
      // keep node as context node if it is in context of other node(s)
      existingNode.isContext = true;
      nodes.push(existingNode);
    }
  });

  links = links.filter((link: any) => {
    // only keep links outgoing/incoming to this node that connect to focused nodes
    if (
      node.contextOf &&
      Object.keys(node.contextOf!).length < 1 &&
      (link.source.id === node.id || link.target.id === node.id)
    ) {
      return false;
    } else if (link.source.id === node.id && link.target.isContext) {
      return false;
    } else if (link.target.id === node.id && link.source.isContext) {
      return false;
    } else {
      return true;
    }
  });

  return {
    nodes,
    links,
  };
}
