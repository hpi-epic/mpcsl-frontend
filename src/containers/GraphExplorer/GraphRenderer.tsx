import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../actions/graphExplorer';
import { IStoreState } from '../../types';
import { Dispatch } from 'redux';
import { D3Graph } from '../../types/graph';


export interface IGraphRendererProps {
  onFetchGraph: () => void;
  selectedGraph: D3Graph;
}

class GraphRenderer extends React.Component<IGraphRendererProps, {}> {
  constructor(props: IGraphRendererProps) {
    super(props);
  }

  setupGraph = () => {
    const width = 600;
    const height = 600;
    if (this.props.selectedGraph) {
      const force = d3
        .forceSimulation()
        .nodes(this.props.selectedGraph.nodes)
        .force('charge', d3.forceManyBody().strength(-120))
        .force('link', d3.forceLink(this.props.selectedGraph.links).distance(50))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(15));;

      const svg = d3
        .select('.graphContainer')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

      const link = svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.props.selectedGraph.links)
        .enter()
        .append('line')
        .attr('stroke', '#999999')
        .attr('marker-end', 'url(#arrow)');

      const node = svg
        .selectAll('circle')
        .data(this.props.selectedGraph.nodes)
        .enter()
        .append<SVGCircleElement>('circle')
        .attr('r', 10)
        .style('stroke-width', 1.5);

      this.props.selectedGraph.nodes[4].fx = width / 2;
      this.props.selectedGraph.nodes[4].fy = height / 2;

      force.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      });
    }
  };

  render() {
    this.setupGraph();
    return <div className="graphContainer" />;
  }
}

export function mapStateToProps({ selectedGraph }: IStoreState) {
  return {
    selectedGraph
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.GraphExplorerAction>
) {
  return {
    onFetchGraph: () => dispatch(actions.fetchGraph())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphRenderer);
