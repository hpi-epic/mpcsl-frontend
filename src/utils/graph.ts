import { D3Graph, D3GraphNode, D3GraphLink } from './../types/graph';
import { Graph } from 'graphlib';

class CIGraph extends Graph {
  public fromD3Graph = (graph: D3Graph) => {
    graph.nodes.map((node: D3GraphNode) => {
      this.setNode(node.id.toString(), node.id);
    })
    graph.links.map((link: D3GraphLink) => {
      this.setEdge(link.source.toString(), link.target.toString())
    })
  }
}

export default CIGraph;
