import { GraphExplorerAction } from '../actions/graphExplorer';
import { ADD_GRAPH, ADD_NODE, NEW_GRAPH_LAYOUT } from '../constants/actions';
import { StoreState } from '../types';
import { D3GraphLink, D3GraphNode } from '../types/graph';
import { addUniqueLinks, addUniqueNodes, resetLayout } from '../utils/graph';

const initialState = {
  graph: null,
  selectedGraph: { nodes: [] as D3GraphNode[], links: [] as D3GraphLink[] },
  nodes: [] as string[]
};

function graphExplorer(
  state = initialState,
  action: GraphExplorerAction
): StoreState {
  switch (action.type) {
    case ADD_GRAPH:
      return {
        ...state,
        graph: action.graph,
        selectedGraph: action.graph.toD3Graph()
      };
    case ADD_NODE:
      // TODO
      if (state.nodes.length > 0) {
        return {
          ...state,
          selectedGraph: {
            links: addUniqueLinks(state.selectedGraph.links, action.subgraph.links),
            nodes: addUniqueNodes(state.selectedGraph.nodes, action.subgraph.nodes)
          },
          nodes: [...state.nodes, action.node]
        };
      } else {
        return {
          ...state,
          selectedGraph: action.subgraph,
          nodes: [ action.node ]
        };
      }
    case NEW_GRAPH_LAYOUT:
      return {
        ...state,
        selectedGraph: resetLayout(state.selectedGraph),
      }
    default:
      return state;
  }
}

export default graphExplorer;
