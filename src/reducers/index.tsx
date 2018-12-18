import { GraphExplorerAction } from '../actions/graphExplorer';
import { ADD_GRAPH, ADD_NODE } from '../constants/actions';
import { StoreState } from '../types';

const initialState = {
  graph: null,
  selectedGraph: null,
};

function graphExplorer(
  state = initialState,
  action: GraphExplorerAction,
): StoreState {
  switch (action.type) {
    case ADD_GRAPH:
      return {
        ...state,
        graph: action.graph
      };
    case ADD_NODE:
      // TODO
      return {
        ...state,
        selectedGraph: state.graph,
      }
    default:
      return state;
  }
}

export default graphExplorer;
