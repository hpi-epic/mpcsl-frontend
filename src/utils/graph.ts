import {
  ID3Graph,
  ID3GraphLink,
  ID3GraphNode,
  IAPIGraphEdges,
  IAPIGraphNode
} from './../types/graphTypes';

function apiNodesToD3Nodes(nodes: IAPIGraphNode[]): ID3GraphNode[] {
  return nodes.map((node: IAPIGraphNode) => {
    return {
      id: node.id.toString(),
      label: node.name
    };
  });
}

class Graph implements ID3Graph {
  public links: ID3GraphLink[];
  public nodes: ID3GraphNode[];

  constructor(
    nodes: ID3GraphNode[] = [],
    links:
      | ID3GraphLink[]
      | Array<{ source: ID3GraphNode; target: ID3GraphNode }> = []
  ) {
    this.links = links as ID3GraphLink[];
    this.nodes = nodes;
  }

  public addLink(sourceID: number, targetID: number) {
    this.links.push({
      source: sourceID.toString(),
      target: targetID.toString()
    });
  }

  public addUniqueAPILinks(addLinks: IAPIGraphEdges[]): void {
    addLinks.forEach((link: IAPIGraphEdges) => {
      if (
        this.links.find(
          (existingLink: any) =>
            existingLink.source.id === link.from_node.toString() &&
            existingLink.target.id === link.to_node.toString()
        ) === undefined
      ) {
        this.addLink(link.from_node, link.to_node);
      }
    });
  }

  public addUniqueNodes(
    addToFocusNode: IAPIGraphNode,
    addNodes: IAPIGraphNode[],
    doFreeze: boolean
  ): void {
    let isAlreadyIn = false;

    this.nodes.forEach(existingNode => {
      if (doFreeze) {
        existingNode.fx = existingNode.x;
        existingNode.fy = existingNode.y;
      }

      if (existingNode.id === addToFocusNode.id.toString()) {
        existingNode.isContext = false;
        isAlreadyIn = true;
      }
    });

    if (!isAlreadyIn) {
      this.nodes.push({
        id: addToFocusNode.id.toString(),
        isContext: false,
        label: addToFocusNode.name
      });
    }

    apiNodesToD3Nodes(addNodes).forEach(addNode => {
      const contextNodeAlreadyIn = this.nodes.find(n => n.id === addNode.id);
      if (contextNodeAlreadyIn === undefined) {
        addNode.isContext = true;
        addNode.contextOf = {};
        addNode.contextOf[addToFocusNode.id] = true;
        this.nodes.push(addNode);
      } else if (contextNodeAlreadyIn.id !== addToFocusNode.id.toString()) {
        if (contextNodeAlreadyIn.contextOf) {
          contextNodeAlreadyIn.contextOf[addToFocusNode.id] = true;
        } else {
          contextNodeAlreadyIn.contextOf = {};
          contextNodeAlreadyIn.contextOf[addToFocusNode.id] = true;
        }
      }
    });
  }

  public resetLayout(): void {
    this.nodes.forEach(node => {
      delete node.fx;
      delete node.fy;
      node.vx = 0;
      node.vy = 0;
    });
  }

  public removeNodeFromFocus(node: ID3GraphNode): void {
    let links = this.links;
    const nodes: ID3GraphNode[] = [];
    this.nodes.forEach((existingNode: ID3GraphNode) => {
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
        Object.keys(node.contextOf).length < 1 &&
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

    this.nodes = nodes;
    this.links = links;
  }
}

export default Graph;
