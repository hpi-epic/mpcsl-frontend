import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../../actions/graphExplorer';
import { Dispatch } from 'redux';
import { CIGraph } from '../../../utils/graph';

import { Button, Row, Checkbox, Col } from 'antd';
import { IState } from '../../../store';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import './GraphRenderer.css';
import { ID3Graph, ID3GraphNode } from '../../../types/graphTypes';

export interface IGraphRendererProps {
  resetLayout: () => void;
  selectedGraph: ID3Graph;
  onAddNode: (graph: CIGraph, node: string) => void;
  graph: CIGraph;
  toggleFreezeLayout: () => void;
}

export interface IGraphRendererState {
  width: number;
  height: number;
}

const graphSettings = {
  nodeMouseOverCursor: 'pointer',
  nodeRadius: 13,
  nodeStrokeWidth: 1,
  nodeStroke: '#001529',
  nodeColission: 20,
  focusNodeColor: '#001529',
  contextNodeColor: '#eff1ef',
  contextNodeStrokeDashArray: '5, 5',
  linkStrokeWidth: 1,
  linkColor: '#c8c8c8',
  linkOpacity: 1,
  forceLinkDistance: 50,
  labelColor: 'black',
  labelDistance: 2,
  labelDirection: 1,
};

class GraphRenderer extends React.Component<
  IGraphRendererProps,
  IGraphRendererState
> {
  private force: d3.Simulation<any, any>;
  private graph?: any;
  private svg?: any;

  constructor(props: IGraphRendererProps) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.force = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'center',
        d3.forceCenter(this.state.width / 2, this.state.height / 2),
      )
      .force(
        'collision',
        d3.forceCollide().radius(graphSettings.nodeColission),
      );
  }

  public componentDidMount() {
    this.force.on('tick', () => {
      this.graph.call(this.updateGraph);
    });
    this.onReLayout();
  }

  public shouldComponentUpdate(nextProps: IGraphRendererProps) {
    this.enterGraphChanges(nextProps);
    return false;
  }

  public render() {
    const defs = (
      <defs>
        <marker
          id='arrow'
          viewBox='-0 -5 10 10'
          refX={graphSettings.nodeRadius + 7}
          refY='0'
          orient='auto'
          markerWidth='13'
          markerHeight='13'
          opacity={graphSettings.linkOpacity}
        >
          <path
            d='M 0,-5 L 10 ,0 L 0,5'
            fill={graphSettings.linkColor}
            style={{ stroke: 'none' }}
          />
        </marker>
      </defs>
    );
    return (
      <div>
        <Row type='flex' justify='start'>
          <Col span={2}>
            <Button onClick={this.onReLayout}>Re-Layout</Button>
          </Col>
          <Col span={4} className='GraphRenderer-Menu'>
            <Checkbox defaultChecked={true} onChange={this.onFreezeChange}>
              Freeze Layout
            </Checkbox>
          </Col>
        </Row>
        <svg
          ref={(svg) => (this.svg = d3.select(svg))}
          width={this.state.width}
          height={this.state.height}
        >
          {defs}
          <g ref={(graph) => (this.graph = d3.select(graph))} />
        </svg>
      </div>
    );
  }

  public enterGraphChanges = (props: IGraphRendererProps) => {
    this.enterGraph(props);
    this.force.alpha(1).restart();
  }

  public enterGraph = (props: IGraphRendererProps) => {
    const nodes = this.graph
      .selectAll('.node')
      .data(props.selectedGraph.nodes, (node: ID3GraphNode) => node.id);

    const links = this.graph.selectAll('.link').data(props.selectedGraph.links);
    links
      .enter()
      .append('line', '.node')
      .call(this.enterLink);
    links.exit().remove();
    links.call(this.updateLink);

    nodes.exit().remove();
    nodes.call(this.updateNode);
    nodes
      .enter()
      .append('g')
      .call(this.enterNode);

    this.force.nodes(props.selectedGraph.nodes).force(
      'links',
      d3
        .forceLink(props.selectedGraph.links)
        .distance(graphSettings.forceLinkDistance)
        .id((d: any) => d.id),
    );

    const zoomHandler = d3.zoom().on('zoom', this.zoomActions);
    zoomHandler(this.svg);
  }

  public enterNode = (selection: d3.Selection<any, any, any, any>) => {
    selection.classed('node', true);
    selection
      .append('circle')
      .on('click', (d: ID3GraphNode) => {
        if (d.isContext) {
          this.props.onAddNode(this.props.graph, d.id.toString());
        }
      })
      .style('cursor', graphSettings.nodeMouseOverCursor)
      .attr('r', graphSettings.nodeRadius);

    selection
      .append('text')
      .attr(
        'x',
        graphSettings.labelDirection *
          (graphSettings.nodeRadius + graphSettings.labelDistance),
      )
      .attr('y', graphSettings.nodeRadius / 2)
      .text((d) => d.id);
  }

  public updateNode = (selection: d3.Selection<any, any, any, any>) => {
    selection
      .attr('transform', (d) => `translate(${d.x ? d.x : 0},${d.y ? d.y : 0})`)
      .select('circle')
      .attr(
        'fill',
        (d: ID3GraphNode): string => {
          return d.isContext
            ? graphSettings.contextNodeColor
            : graphSettings.focusNodeColor;
        },
      )
      .attr('stroke', graphSettings.nodeStroke)
      .attr('stroke-width', graphSettings.nodeStrokeWidth)
      .attr(
        'stroke-dasharray',
        (d: ID3GraphNode): string => {
          return d.isContext
            ? graphSettings.contextNodeStrokeDashArray
            : 'none';
        },
      );
  }

  public enterLink = (selection: d3.Selection<any, any, any, any>) => {
    selection
      .classed('link', true)
      .attr('stroke-width', (d) => d.size)
      .attr('stroke', graphSettings.linkColor)
      .attr('stroke-width', graphSettings.linkStrokeWidth)
      .attr('opacity', graphSettings.linkOpacity)
      .attr('marker-end', 'url(#arrow)');
  }

  public updateLink = (selection: d3.Selection<any, any, any, any>) => {
    selection
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);
  }

  public updateGraph = (selection: d3.Selection<any, any, any, any>) => {
    selection.selectAll('.node').call(this.updateNode);
    selection.selectAll('.link').call(this.updateLink);
  }

  private zoomActions = () => {
    this.graph.attr('transform', d3.event.transform);
  }

  private onReLayout = () => {
    this.props.resetLayout();
    this.shouldComponentUpdate(this.props);
  }

  private onFreezeChange = (e: CheckboxChangeEvent) => {
    this.props.toggleFreezeLayout();
  }
}

export function mapStateToProps(state: IState) {
  return {
    selectedGraph: state.graphExplorer!.selectedGraph,
    graph: state.graphExplorer!.graph,
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.GraphExplorerAction>,
) {
  return {
    resetLayout: () => dispatch(actions.newLayout()),
    onAddNode: (graph: CIGraph, node: string) =>
      dispatch(actions.addNode(graph, node)),
    toggleFreezeLayout: () => dispatch(actions.toggleFreezeLayout()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphRenderer);
