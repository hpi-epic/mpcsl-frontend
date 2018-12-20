import { D3Graph, D3GraphNode, D3GraphLink } from './../types/graph';
import { Graph } from 'graphlib';

export class CIGraph extends Graph {
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

export function addUniqueLinks(links: any, addLinks: D3GraphLink[]): D3GraphLink[] {
  addLinks.forEach(link => {
    if(links.find((existingLink: any) => existingLink.source.id === link.source && existingLink.target.id === link.target) === undefined){
      links.push(link)
    }
  })
  return links as D3GraphLink[];
}

export function addUniqueNodes(nodes: D3GraphNode[], addNodes: D3GraphNode[]): D3GraphNode[] {
  nodes.forEach(node => {
    node.fx = node.x;
    node.fy = node.y;

  })
  addNodes.forEach(node => {
    if(nodes.find(exisitingNode => exisitingNode.id === node.id) === undefined){
      nodes.push(node)
    }
  })
  return nodes;
}

export function resetLayout(graph: D3Graph): D3Graph {
  graph.nodes.forEach(node => {
    delete node.fx;
    delete node.fy;
    node.vx = 0;
    node.vy = 0;
  })
  return graph;
}
