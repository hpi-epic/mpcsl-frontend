import { D3Graph, D3GraphNode, D3GraphLink } from './../types/graph';
import { Graph } from 'graphlib';

class CIGraph extends Graph {
  constructor() {
    super();
  }
  public fromD3Graph = (graph: D3Graph) => {
    graph.nodes.map((node: D3GraphNode) => {
      this.setNode(node.id.toString(), node.id);
    })
    graph.links.map((link: D3GraphLink) => {
      this.setEdge(link.source.toString(), link.target.toString())
    })
  }

  public getContext(node: string): D3Graph {
    return {
      nodes: this.neighbors(node)!.map(n => ({ id: n })),
      links: this.nodeEdges(node)!.map(link => ({ source: link.v, target: link.w }))
    }
  }

  public toD3Graph = (): D3Graph => {
    return ({
      nodes: this.nodes().map((n => ({ id: n }))),
      links: this.edges().map(link => ({ source: link.v, target: link.w}))
    })
  }
}

export default CIGraph;
