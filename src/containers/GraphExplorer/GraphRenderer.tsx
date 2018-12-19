import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../actions/graphExplorer';
import { IStoreState } from '../../types';
import { Dispatch } from 'redux';
import { D3Graph, D3GraphNode } from '../../types/graph';


export interface IGraphRendererProps {
  onFetchGraph: () => void;
  selectedGraph: D3Graph;
}

export interface IGraphRendererState {
  width: number;
  height: number;
}

class GraphRenderer extends React.Component<IGraphRendererProps, IGraphRendererState> {
  force?: d3.Simulation<any, any>;
  svgElement?: SVGSVGElement | null;
  svg?: d3.Selection<any, any, any, any> | null;
  link?: d3.Selection<any, any, any, any>;
  node?: d3.Selection<any, any, any, any>;


  constructor(props: IGraphRendererProps) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  componentDidMount() {
    this.setupD3Graph();
  }

  componentDidUpdate() {
    this.setupD3Graph();
  }

  setupD3Graph = () => {
    this.force = d3
      .forceSimulation()
      .nodes(this.props.selectedGraph.nodes)
      .force('charge', d3.forceManyBody().strength(-130))
      .force('link',
        d3.forceLink(this.props.selectedGraph.links)
          .distance(50)
          .id(function(d: any) {
            return d.id
          })
      )
      .force('center', d3.forceCenter(this.state.width / 2, this.state.height / 2))
      .force('collision', d3.forceCollide().radius(15));

    this.svg = d3
      .select(this.svgElement!)
      .append('svg')
      .attr('width', this.state.width)
      .attr('height', this.state.height);

    this.svg
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

    this.link = this.svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.props.selectedGraph.links)
      .enter()
      .append<SVGLineElement>('line')
      .attr('stroke', '#999999')
      .attr('marker-end', 'url(#arrow)');

    this.node = this.svg
      .selectAll('circle')
      .data(this.props.selectedGraph.nodes)
      .enter()
      .append<SVGCircleElement>('circle')
      .attr('r', 10)
      .style('stroke-width', 1.5);

    if (this.props.selectedGraph.nodes.length > 0) {
      this.force!.on('tick', () => {
        this.link!
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        this.node!
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
    }
  }

  render() {
    this.setupD3Graph();
    return <svg ref={node => this.svgElement = node} width={this.state.width} height={this.state.height}/>;
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
