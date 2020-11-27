import {
  ID3Graph,
  ID3GraphLink,
  ID3GraphNode,
  IAPIGraphEdges,
  IAPIGraphNode
} from '../types/graphTypes';
import { Subject } from 'rxjs';
import {
  getNodeContext,
  getResultNodes,
  getAllNodesContext
} from '../restAPI/apiRequests';
import { isString } from 'util';
import { IAPINodeContext } from '../types/types';

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

  private addLink = (sourceID: number, targetID: number) => {
    this.links.push({
      source: sourceID.toString(),
      target: targetID.toString()
    });
  };

  public addNode = async (
    nodeID: number,
    resultID: number,
    emitChange?: boolean,
    context?: IAPINodeContext
  ) => {
    const result = context ? context : await getNodeContext(nodeID, resultID);
    this.addUniqueNodes(result.main_node, result.context_nodes);
    this.addUniqueAPILinks(result.edges);
    if (emitChange === false) {
      return;
    }
    this.links = this.links.slice();
    this.nodes = this.nodes.slice();
    this.subject.next(GraphChanges.NodesChanged);
    this.subject.next(GraphChanges.LinksChanged);
  };

  public addNodes = async (nodeIDs: number[], resultID: number) => {
    const contexts = await getAllNodesContext(resultID);
    await Promise.all(
      nodeIDs.map(id =>
        this.addNode(
          id,
          resultID,
          false,
          contexts.node_contexts.find(node => node.main_node.id === id)
        )
      )
    );
    this.links = this.links.slice();
    this.nodes = this.nodes.slice();
    this.subject.next(GraphChanges.NodesChanged);
    this.subject.next(GraphChanges.LinksChanged);
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
            (isString(oldLink.source) ? oldLink.source : oldLink.source.id) ===
              convLink.from_node &&
            (isString(oldLink.target) ? oldLink.target : oldLink.target.id) ===
              convLink.to_node
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
          if (
            !contextNodeAlreadyIn.contextOf.includes(
              addToFocusNode.id.toString()
            )
          ) {
            contextNodeAlreadyIn.contextOf.push(addToFocusNode.id.toString());
          }
        } else {
          contextNodeAlreadyIn.contextOf = [addToFocusNode.id.toString()];
        }
      }
    }
  };

  public resetGraph = () => {
    this.nodes = [];
    this.links = [];
    this.subject.next(GraphChanges.NodesChanged);
    this.subject.next(GraphChanges.LinksChanged);
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
    const nodes: ID3GraphNode[] = [];
    for (const existingNode of this.nodes) {
      if (existingNode.id !== node.id) {
        // delete node in contextOf for all other nodes
        if (
          existingNode.contextOf &&
          existingNode.contextOf.includes(node.id)
        ) {
          existingNode.contextOf = existingNode.contextOf.filter(
            exNodeID => exNodeID !== node.id
          );
          if (existingNode.contextOf.length > 0 || !existingNode.isContext) {
            nodes.push(existingNode);
          }
        } else {
          nodes.push(existingNode);
        }
      } else if (
        !existingNode.isContext &&
        existingNode.contextOf &&
        existingNode.contextOf.length > 0
      ) {
        // keep node as context node if it is in context of other node(s)
        existingNode.isContext = true;
        nodes.push(existingNode);
      }
    }

    const links = this.links.filter(link => {
      const source = isString(link.source) ? link.source : link.source.id;
      const target = isString(link.target) ? link.target : link.target.id;
      // only keep links outgoing/incoming to this node that connect to focused nodes
      if (
        node.contextOf &&
        node.contextOf.length < 1 &&
        (source === node.id || target === node.id)
      ) {
        return false;
      } else if (
        source === node.id &&
        this.nodes.find(exNode => target === exNode.id)?.isContext
      ) {
        return false;
      } else if (
        target === node.id &&
        this.nodes.find(exNode => source === exNode.id)?.isContext
      ) {
        return false;
      } else {
        return true;
      }
    });

    this.nodes = nodes;
    this.links = links;
    this.subject.next(GraphChanges.NodesChanged);
    this.subject.next(GraphChanges.LinksChanged);
  };
}

const GraphSingleton = new Graph();
export { GraphSingleton };
