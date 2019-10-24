import { ThunkAction } from 'redux-thunk';
import {
  ID3GraphNode,
  IAPIGraphNode,
  IAPIGraphEdges
} from '../types/graphTypes';
import * as constants from '../constants/actions';
import { getResultNodes, getNodeContext } from './apiRequests';
import { Action, Dispatch, ActionCreator } from 'redux';
import { IState } from '../store';

export interface IFetchAvailableNodes {
  type: constants.ADD_AVAILABLE_NODES;
  availableNodes: IAPIGraphNode[];
}

export const fetchAvailableNodes: ActionCreator<
  ThunkAction<Promise<Action>, IState, void, Action>
> = (resultID: number) => {
  return async (dispatch: Dispatch<Action>): Promise<IFetchAvailableNodes> => {
    const result = await getResultNodes(resultID);
    return dispatch({
      type: constants.ADD_AVAILABLE_NODES as constants.ADD_AVAILABLE_NODES,
      availableNodes: result
    });
  };
};

export interface IAddNode {
  type: constants.ADD_NODE;
  contextNodes: IAPIGraphNode[];
  addNode: IAPIGraphNode;
  edges: IAPIGraphEdges[];
}

export const addNode: ActionCreator<
  ThunkAction<Promise<Action>, IState, void, Action>
> = (nodeID: number) => {
  return async (dispatch: Dispatch<Action>): Promise<IAddNode> => {
    const match = window.location.href.match(new RegExp('\\d*$'));
    if (!match || !match[0]) {
      throw new Error();
    }
    const resultID = match[0];
    const result = await getNodeContext(nodeID, Number(resultID));
    return dispatch({
      type: constants.ADD_NODE as constants.ADD_NODE,
      contextNodes: result.context_nodes,
      addNode: result.main_node,
      edges: result.edges
    });
  };
};

export interface IRemoveNode {
  type: constants.REMOVE_NODE;
  node: ID3GraphNode;
}

export function removeNode(node: ID3GraphNode): IRemoveNode {
  return {
    type: constants.REMOVE_NODE,
    node
  };
}

export interface INewLayout {
  type: constants.NEW_GRAPH_LAYOUT;
}

export function newLayout(): INewLayout {
  return {
    type: constants.NEW_GRAPH_LAYOUT
  };
}

export interface IToggleFreezeLayout {
  type: constants.TOGGLE_FREEZE_LAYOUT;
}

export function toggleFreezeLayout(): IToggleFreezeLayout {
  return {
    type: constants.TOGGLE_FREEZE_LAYOUT
  };
}

export type GraphExplorerAction =
  | IFetchAvailableNodes
  | IAddNode
  | INewLayout
  | IRemoveNode
  | IToggleFreezeLayout;
