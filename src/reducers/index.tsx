import { GraphExplorerAction } from '../actions/graphExplorer';
import { ADD_GRAPH } from '../constants/actions';
import { StoreState } from '../types';

const initialState = {
  graph: 'test', // TODO
  subGraph: 'test', // TODO
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
      };
    default:
      return state;
  }
}

export default graphExplorer;
