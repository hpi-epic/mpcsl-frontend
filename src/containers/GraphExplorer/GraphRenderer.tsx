import React, { ReactDOM } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../actions/graphExplorer';
import { IStoreState } from '../../types';
import { Dispatch } from 'redux';
import { D3Graph, D3GraphNode } from '../../types/graph';
import { Button } from 'antd';

export interface IGraphRendererProps {
  resetLayout: () => void;
  selectedGraph: D3Graph;
}

export interface IGraphRendererState {
  width: number;
  height: number;
}

const graphSettings = {
  nodeColor: '#191919',
  nodeRadius: 13,
  strokeWidth: 1,
  linkColor: 'black',
  linkOpacity: 0.3,
  forceLinkDistance: 50,
  labelColor: 'black',
  labelDistance: 2,
  labelDirection: 1 // negative for left, positive for right
};

class GraphRenderer extends React.Component<
  IGraphRendererProps,
  IGraphRendererState
> {
  force: d3.Simulation<any, any>;
  graph?: any;

  constructor(props: IGraphRendererProps) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.force = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'center',
        d3.forceCenter(this.state.width / 2, this.state.height / 2)
      )
      .force(
        'collision',
        d3.forceCollide().radius(graphSettings.nodeRadius + 10)
      );
  }

  componentDidMount() {
    this.force.on('tick', () => {
      this.graph.call(this.updateGraph);
    });
  }

  shouldComponentUpdate(nextProps: IGraphRendererProps) {
    var nodes = this.graph
      .selectAll('.node')
      .data(nextProps.selectedGraph.nodes, (node: D3GraphNode) => node.id);

    nodes.exit().remove();
    nodes.call(this.updateNode);
    nodes
      .enter()
      .append('g')
      .call(this.enterNode);

    var links = this.graph
      .selectAll('.link')
      .data(nextProps.selectedGraph.links);
    links.enter().append('line', '.node').call(this.enterLink);
    links.exit().remove();
    links.call(this.updateLink);


    this.force
      .nodes(nextProps.selectedGraph.nodes)
      .force('links', d3.forceLink(nextProps.selectedGraph.links).distance(graphSettings.forceLinkDistance).id((d: any) => d.id));

    this.force.alpha(1).restart();

    return false;
  }

  render() {
    const defs = (
      <defs>
        <marker
          id="arrow"
          viewBox="-0 -5 10 10"
          refX={graphSettings.nodeRadius + 6}
          refY="0"
          orient="auto"
          markerWidth="13"
          markerHeight="13"
          opacity={graphSettings.linkOpacity}
        >
          <path d="M 0,-5 L 10 ,0 L 0,5" fill={graphSettings.linkColor} style={{stroke: 'none'}} />
        </marker>
      </defs>
    );
    return (
      <React.Fragment>
        <Button onClick={this.onReLayout}>Re-Layout</Button>
        <svg width={this.state.width} height={this.state.height}>
          {defs}
          <g ref={graph => (this.graph = d3.select(graph))} />
        </svg>
      </React.Fragment>
    );
  }

  onReLayout = () => {
    this.props.resetLayout();
    this.shouldComponentUpdate(this.props);
  }

  enterNode = (selection: d3.Selection<any, any, any, any>) => {
    selection.classed('node', true);

    selection.append('circle').attr('r', graphSettings.nodeRadius);

    selection
      .append('text')
      .attr('x', graphSettings.nodeRadius + graphSettings.labelDistance)
      .text(d => d.id);
  };

  updateNode = (selection: d3.Selection<any, any, any, any>) => {
    selection.attr('transform', d => `translate(${d.x ? d.x : 0},${d.y ? d.y : 0})`);
  };

  enterLink = (selection: d3.Selection<any, any, any, any>) => {
    selection
      .classed('link', true)
      .attr('stroke-width', d => d.size)
      .attr('stroke', graphSettings.linkColor)
      .attr('stroke-width', graphSettings.strokeWidth)
      .attr('opacity', graphSettings.linkOpacity)
      .attr('marker-end', 'url(#arrow)');
  };

  updateLink = (selection: d3.Selection<any, any, any, any>) => {
    selection
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  };

  updateGraph = (selection: d3.Selection<any, any, any, any>) => {
    selection.selectAll('.node').call(this.updateNode);
    selection.selectAll('.link').call(this.updateLink);
  };
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
    resetLayout: () => dispatch(actions.newLayout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphRenderer);
