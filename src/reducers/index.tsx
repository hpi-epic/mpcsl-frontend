import { GraphExplorerAction } from '../actions/graphExplorer';
import {
  ADD_GRAPH,
  ADD_NODE,
  NEW_GRAPH_LAYOUT,
  TOGGLE_FREEZE_LAYOUT,
  REMOVE_NODE,
} from '../constants/actions';
import { StoreState } from '../types';
import { ID3GraphLink, ID3GraphNode } from '../types/graphTypes';
import {
  addUniqueLinks,
  addUniqueNodes,
  resetLayout,
  CIGraph,
  removeNodeFromFocus,
} from '../utils/graph';
import { combineReducers } from 'redux';
import { IState } from '../store';

const initialState = {
  graph: new CIGraph(),
  selectedGraph: { nodes: [] as ID3GraphNode[], links: [] as ID3GraphLink[] },
  nodes: [] as ID3GraphNode[],
  doFreeze: true,
};

function graphExplorer(
  state = initialState,
  action: GraphExplorerAction,
): StoreState {
  switch (action.type) {
    case ADD_GRAPH:
      return {
        ...state,
        graph: action.graph,
        selectedGraph: action.graph.toD3Graph(),
        resultID: action.resultID,
        nodes: [],
      };
    case ADD_NODE:
      if (state.nodes.length > 0) {
        return {
          ...state,
          selectedGraph: {
            links: addUniqueLinks(
              state.selectedGraph.links,
              action.context.links,
            ),
            nodes: addUniqueNodes(
              state.selectedGraph.nodes,
              state.graph!,
              action.nodeID,
              action.context.nodes,
              state.doFreeze,
            ),
          },
          nodes: [
            ...state.nodes,
            { id: action.nodeID, label: state.graph.node(action.nodeID) },
          ],
        };
      } else {
        return {
          ...state,
          selectedGraph: {
            links: action.context.links,
            nodes: [
              ...action.context.nodes.map((node) => ({
                ...node,
                isContext: true,
                contextOf: { [action.nodeID]: true },
              })),
              {
                id: action.nodeID,
                label: state.graph.node(action.nodeID),
                isContext: false,
              },
            ],
          },
          nodes: [
            ...state.nodes,
            { id: action.nodeID, label: state.graph.node(action.nodeID) },
          ],
        };
      }
    case NEW_GRAPH_LAYOUT:
      return {
        ...state,
        selectedGraph: resetLayout(state.selectedGraph),
      };
    case TOGGLE_FREEZE_LAYOUT:
      return {
        ...state,
        doFreeze: !state.doFreeze,
      };
    case REMOVE_NODE:
      return {
        ...state,
        selectedGraph: removeNodeFromFocus(state.selectedGraph, action.node),
        nodes: state.nodes.filter((node) =>
          node.id === action.node.id ? false : true,
        ),
      };
    default:
      return state;
  }
}

export default combineReducers<IState>({ graphExplorer });
