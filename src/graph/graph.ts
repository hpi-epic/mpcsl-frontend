import {
  ID3Graph,
  ID3GraphLink,
  ID3GraphNode,
  IAPIGraphEdges,
  IAPIGraphNode
} from '../types/graphTypes';
import { Subject } from 'rxjs';
import { getNodeContext, getResultNodes } from '../actions/apiRequests';

const apiNodesToD3Nodes = (nodes: IAPIGraphNode[]): ID3GraphNode[] =>
  nodes.map(node => ({
    id: node.id.toString(),
    label: node.name
  }));

export enum GraphChanges {
  AvailableNodeChanged,
  LinksChanged,
  FreezeChanged,
  NodesChanged
}

class Graph implements ID3Graph {
  public subject: Subject<GraphChanges>;
  public links: ID3GraphLink[];
  public nodes: ID3GraphNode[];
  public availableNodes: IAPIGraphNode[];
  public freeze: boolean;
  constructor() {
    this.subject = new Subject();
    this.links = [];
    this.nodes = [];
    this.availableNodes = [];
    this.freeze = false;
  }

  public subscribeToGraphChanges = (callback: (event: GraphChanges) => void) =>
    this.subject.subscribe(callback);

  public addLink = (sourceID: number, targetID: number) => {
    this.links = this.links.concat({
      source: sourceID.toString(),
      target: targetID.toString()
    });
    this.subject.next();
  };

  public addNode = async (
    nodeID: number,
    resultID: number,
    emitChange?: boolean
  ) => {
    const result = await getNodeContext(nodeID, resultID);
    this.addUniqueNodes(result.main_node, result.context_nodes);
    this.addUniqueAPILinks(result.edges);
    if (emitChange === false) {
      return;
    }
    this.links = this.links.slice();
    this.nodes = this.nodes.slice();
    this.subject.next(GraphChanges.LinksChanged);
    this.subject.next(GraphChanges.NodesChanged);
  };

  public addNodes = async (nodeIDs: number[], resultID: number) => {
    await Promise.all(nodeIDs.map(id => this.addNode(id, resultID, false)));
    this.links = this.links.slice();
    this.nodes = this.nodes.slice();
    this.subject.next(GraphChanges.LinksChanged);
    this.subject.next(GraphChanges.NodesChanged);
  };

  private addUniqueAPILinks = (links: IAPIGraphEdges[]) => {
    for (const link of links) {
      const convLink = {
        from_node: link.from_node.toString(),
        to_node: link.to_node.toString()
      };
      if (
        !this.links.some(
          oldLink =>
            oldLink.source === convLink.from_node &&
            oldLink.target === convLink.to_node
        )
      ) {
        this.addLink(link.from_node, link.to_node);
      }
    }
  };

  private addUniqueNodes = (
    addToFocusNode: IAPIGraphNode,
    addNodes: IAPIGraphNode[]
  ) => {
    let isAlreadyIn = false;

    for (const node of this.nodes) {
      if (this.freeze) {
        node.fx = node.x;
        node.fy = node.y;
      }
      if (node.id === addToFocusNode.id.toString()) {
        node.isContext = false;
        isAlreadyIn = true;
      }
    }

    if (!isAlreadyIn) {
      this.nodes.push({
        id: addToFocusNode.id.toString(),
        isContext: false,
        label: addToFocusNode.name
      });
    }

    const d3Nodes = apiNodesToD3Nodes(addNodes);

    for (const d3Node of d3Nodes) {
      const contextNodeAlreadyIn = this.nodes.find(n => n.id === d3Node.id);
      if (contextNodeAlreadyIn === undefined) {
        d3Node.isContext = true;
        d3Node.contextOf = [addToFocusNode.id.toString()];
        this.nodes.push(d3Node);
      } else if (contextNodeAlreadyIn.id !== addToFocusNode.id.toString()) {
        if (contextNodeAlreadyIn.contextOf) {
          contextNodeAlreadyIn.contextOf.push(addToFocusNode.id.toString());
        } else {
          contextNodeAlreadyIn.contextOf = [addToFocusNode.id.toString()];
        }
      }
    }
  };

  public resetGraph = () => {
    this.nodes = [];
    this.links = [];
    this.subject.next(GraphChanges.LinksChanged);
    this.subject.next(GraphChanges.NodesChanged);
  };

  public resetLayout = () => {
    for (const node of this.nodes) {
      node.fx = undefined;
      node.fy = undefined;
      node.vx = 0;
      node.vy = 0;
    }
    this.nodes = this.nodes.slice();
    this.subject.next(GraphChanges.NodesChanged);
  };

  public toggleFreeze = () => {
    this.freeze = !this.freeze;
    this.subject.next(GraphChanges.FreezeChanged);
  };

  public fetchAvailableNodes = async (resultID: number) => {
    const result = await getResultNodes(resultID);
    this.availableNodes = result;
    this.subject.next(GraphChanges.AvailableNodeChanged);
  };

  public removeNodeFromFocus = (node: ID3GraphNode) => {
    let links = this.links;
    const nodes: ID3GraphNode[] = [];
    for (const existingNode of this.nodes) {
      if (existingNode.id !== node.id) {
        // delete node in contextOf for all other nodes
        if (existingNode.contextOf && node.id in existingNode.contextOf) {
          existingNode.contextOf = existingNode.contextOf.filter(
            exNodeID => exNodeID !== node.id
          );
          if (existingNode.contextOf.length > 0 || !existingNode.isContext) {
            nodes.push(existingNode);
          }
        } else {
          nodes.push(existingNode);
        }
      } else if (!existingNode.isContext && existingNode.contextOf) {
        // keep node as context node if it is in context of other node(s)
        existingNode.isContext = true;
        nodes.push(existingNode);
      }
    }

    links = links.filter(link => {
      // only keep links outgoing/incoming to this node that connect to focused nodes
      if (
        node.contextOf &&
        node.contextOf.length < 1 &&
        (link.source === node.id || link.target === node.id)
      ) {
        return false;
      } else if (
        link.source === node.id &&
        this.nodes.find(exNode => link.target === exNode.id)?.isContext
      ) {
        return false;
      } else if (
        link.target === node.id &&
        this.nodes.find(exNode => link.source === exNode.id)?.isContext
      ) {
        return false;
      } else {
        return true;
      }
    });

    this.nodes = nodes;
    this.links = links;
    this.subject.next(GraphChanges.LinksChanged);
    this.subject.next(GraphChanges.NodesChanged);
  };
}
const GraphSingleton = new Graph();
export { GraphSingleton };
