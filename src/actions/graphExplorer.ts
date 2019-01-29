import { ThunkAction } from 'redux-thunk';
import { ID3Graph } from '../types/graphTypes';
import * as constants from '../constants/actions';
import { CIGraph } from '../utils/graph';
import { getResult } from './apiRequests';
import { Action, Dispatch, ActionCreator } from 'redux';
import { IState } from '../store';
import { IAPIResult } from '../types';
import { graph } from '../constants/testdata';

export interface IFetchGraph {
  type: constants.ADD_GRAPH;
  graph: CIGraph;
  resultID: string;
}

export const fetchGraph: ActionCreator<
  ThunkAction<Promise<Action>, IState, void, Action>
> = (resultID: number) => {
  return async (dispatch: Dispatch<Action>): Promise<IFetchGraph> => {
    try {
      const result = await getResult(resultID);
      const ciGraph = new CIGraph();
      ciGraph.fromAPIGraph((result as unknown) as IAPIResult);

      return dispatch({
        type: constants.ADD_GRAPH as constants.ADD_GRAPH,
        graph: ciGraph,
        resultID: resultID.toString(),
      });
    } catch (e) {
      // return fallback graph
      const ciGraph = new CIGraph();
      ciGraph.fromD3Graph(graph);
      return dispatch({
        type: constants.ADD_GRAPH as constants.ADD_GRAPH,
        graph: ciGraph,
        resultID: 'fallback',
      });
    }
  };
};

export interface IAddNode {
  type: constants.ADD_NODE;
  context: ID3Graph;
  nodeID: string;
}

export function addNode(ciGraph: CIGraph, nodeID: string): IAddNode {
  const contextGraph = ciGraph.getContext(nodeID);
  return {
    type: constants.ADD_NODE,
    context: contextGraph,
    nodeID,
  };
}

export interface INewLayout {
  type: constants.NEW_GRAPH_LAYOUT;
}

export function newLayout(): INewLayout {
  return {
    type: constants.NEW_GRAPH_LAYOUT,
  };
}

export interface IToggleFreezeLayout {
  type: constants.TOGGLE_FREEZE_LAYOUT;
}

export function toggleFreezeLayout(): IToggleFreezeLayout {
  return {
    type: constants.TOGGLE_FREEZE_LAYOUT,
  };
}

export type GraphExplorerAction =
  | IFetchGraph
  | IAddNode
  | INewLayout
  | IToggleFreezeLayout;
