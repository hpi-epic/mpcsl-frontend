import { graph } from './../constants/testdata';
import { D3Graph } from './../types/graph';
import * as constants from '../constants/actions';
import { CIGraph } from '../utils/graph';

export interface IFetchGraph {
  type: constants.ADD_GRAPH;
  graph: CIGraph;
}

export function fetchGraph(): IFetchGraph {
  let ciGraph = new CIGraph();
  ciGraph.fromD3Graph(graph);
  return {
    type: constants.ADD_GRAPH,
    graph: ciGraph,
  };
}

export interface IAddNode {
  type: constants.ADD_NODE,
  subgraph: D3Graph,
  node: string
}

export function addNode(graph: CIGraph, node: string): IAddNode {
  const subgraph = graph.getContext(node)
  subgraph.nodes.push({ id: node });
  return {
    type: constants.ADD_NODE,
    subgraph: subgraph,
    node: node
  }
}

export interface INewLayout {
  type: constants.NEW_GRAPH_LAYOUT
}

export function newLayout(): INewLayout {
  return {
    type: constants.NEW_GRAPH_LAYOUT
  }
}

export type GraphExplorerAction = IFetchGraph | IAddNode | INewLayout ;
