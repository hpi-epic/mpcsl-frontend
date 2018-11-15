import { GraphExplorerAction } from '../actions/graphExplorer';
import { IStoreState, StoreState } from '../types';

function graphExplorer(state: StoreState, action: GraphExplorerAction): StoreState {
  switch (action.type) {
    default:
      return state;
  }
}

export default graphExplorer;
