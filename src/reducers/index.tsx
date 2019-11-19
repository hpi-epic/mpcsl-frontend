import { GraphExplorerAction } from '../actions/graphExplorer';
import {
  ADD_NODE,
  NEW_GRAPH_LAYOUT,
  TOGGLE_FREEZE_LAYOUT,
  REMOVE_NODE,
  ADD_AVAILABLE_NODES
} from '../constants/actions';
import { StoreState } from '../types';
import { ID3GraphNode, IAPIGraphNode } from '../types/graphTypes';
import { combineReducers } from 'redux';
import { IState } from '../store';
import Graph from '../utils/graph';

const initialState = {
  availableNodes: [] as IAPIGraphNode[],
  selectedGraph: new Graph(),
  nodes: [] as ID3GraphNode[],
  doFreeze: true
};

function graphExplorer(
  state = initialState,
  action: GraphExplorerAction
): StoreState {
  switch (action.type) {
    case ADD_AVAILABLE_NODES: {
      return {
        ...state,
        availableNodes: action.availableNodes
      };
    }
    case ADD_NODE: {
      const graph = new Graph(
        state.selectedGraph.nodes,
        state.selectedGraph.links
      );
      graph.addUniqueNodes(action.addNode, action.contextNodes, state.doFreeze);
      graph.addUniqueAPILinks(action.edges);
      return {
        ...state,
        selectedGraph: graph,
        nodes: [
          ...state.nodes,
          { id: action.addNode.id.toString(), label: action.addNode.name }
        ]
      };
    }
    case NEW_GRAPH_LAYOUT: {
      const graph = new Graph(
        state.selectedGraph.nodes,
        state.selectedGraph.links
      );
      graph.resetLayout();
      return {
        ...state,
        selectedGraph: graph
      };
    }
    case TOGGLE_FREEZE_LAYOUT:
      return {
        ...state,
        doFreeze: !state.doFreeze
      };
    case REMOVE_NODE: {
      const graph = new Graph(
        state.selectedGraph.nodes,
        state.selectedGraph.links
      );

      graph.removeNodeFromFocus(action.node);
      return {
        ...state,
        selectedGraph: graph,
        nodes: state.nodes.filter(node => node.id !== action.node.id)
      };
    }
    default:
      return state;
  }
}

export default combineReducers<IState>({ graphExplorer });
