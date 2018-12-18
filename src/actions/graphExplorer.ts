import { graph } from './../constants/testdata';
import { D3GraphNode } from './../types/graph';
import * as constants from '../constants/actions';
import CIGraph from '../utils/graph';

export interface IFetchGraph {
  type: constants.ADD_GRAPH;
  graph: CIGraph;
}

export function fetchGraph(): IFetchGraph {
  // TODO fetch from backend
  let ciGraph = new CIGraph();
  ciGraph.fromD3Graph(graph);

  return {
    type: constants.ADD_GRAPH,
    graph: ciGraph,
  };
}

export interface IAddNode {
  type: constants.ADD_NODE,
  node: D3GraphNode
}

export function addNodeToFocus(node: D3GraphNode): IAddNode {
  return {
    type: constants.ADD_NODE,
    node: node
  }
}

export type GraphExplorerAction = IFetchGraph | IAddNode;
