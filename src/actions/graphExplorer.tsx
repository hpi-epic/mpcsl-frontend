import * as constants from '../constants/actions';

export interface IFetchGraph {
  type: constants.ADD_GRAPH;
  graph: any; // TODO
}

export type GraphExplorerAction = IFetchGraph;

export function fetchGraph(): IFetchGraph {
  return {
    type: constants.ADD_GRAPH,
    graph: 'test',
  };
}
