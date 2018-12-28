import { GraphExplorerAction } from '../actions/graphExplorer';
import { ADD_GRAPH, ADD_NODE, NEW_GRAPH_LAYOUT } from '../constants/actions';
import { StoreState } from '../types';
import { D3GraphLink, D3GraphNode } from '../types/graphTypes';
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
      if (state.nodes.length > 0) {
        return {
          ...state,
          selectedGraph: {
            links: addUniqueLinks(
              state.selectedGraph.links,
              action.context.links
            ),
            nodes: addUniqueNodes(
              state.selectedGraph.nodes,
              action.nodeID,
              action.context.nodes
            )
          },
          nodes: [...state.nodes, action.nodeID]
        };
      } else {
        return {
          ...state,
          selectedGraph: {
            links: action.context.links,
            nodes: [
              ...action.context.nodes.map(node => ({
                ...node,
                isContext: true
              })),
              { id: action.nodeID, isContext: false }
            ]
          },
          nodes: [action.nodeID]
        };
      }
    case NEW_GRAPH_LAYOUT:
      return {
        ...state,
        selectedGraph: resetLayout(state.selectedGraph)
      };
    default:
      return state;
  }
}

export default graphExplorer;
