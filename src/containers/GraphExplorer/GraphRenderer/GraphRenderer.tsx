import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../../actions/graphExplorer';

import { Button, Row, Checkbox, Col } from 'antd';
import { IState } from '../../../store';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import './GraphRenderer.css';
import { ID3GraphNode } from '../../../types/graphTypes';
import Graph from '../../../utils/graph';
import { ThunkDispatch } from 'redux-thunk';

export interface IGraphRendererProps {
  resetLayout: () => void;
  selectedGraph: Graph;
  onAddNode: (nodeID: number) => void;
  toggleFreezeLayout: () => void;
  isSelectionMode: boolean;
  onNodeClick?: (node: ID3GraphNode) => void;
}

export interface IGraphRendererState {
  width: number;
  height: number;
}

const graphSettings = {
  nodeMouseOverCursor: 'pointer',
  nodeRadius: 13,
  nodeStrokeWidth: 2,
  nodeStroke: '#001529',
  nodeColission: 25,
  focusNodeColor: '#dcdcdc',
  contextNodeColor: '#eff1ef',
  contextNodeStrokeDashArray: '5, 5',
  linkStrokeWidth: 1,
  linkColor: '#c8c8c8',
  linkOpacity: 1,
  forceLinkDistance: 75,
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
  private tooltip?: any;

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

    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.shouldComponentUpdate(this.props);
  }

  public componentWillUnmount() {
    this.force.stop();
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

    nodes.exit().remove();
    nodes.call(this.updateNode);
    nodes
      .enter()
      .append('g')
      .call(this.enterNode);

    const links = this.graph.selectAll('.link').data(props.selectedGraph.links);
    links
      .enter()
      .insert('line', '.node')
      .call(this.enterLink);
    links.exit().remove();
    links.call(this.updateLink);

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
        if (this.props.isSelectionMode) {
          if (d.isContext) {
            this.props.onAddNode(Number(d.id));
          }
        } else {
          this.props.onNodeClick!(d);
        }
      })
      .style('cursor', graphSettings.nodeMouseOverCursor)
      .attr('r', graphSettings.nodeRadius)
      .on('mouseover.tooltip', (d: ID3GraphNode) => {
        this.tooltip
          .transition()
          .duration(300)
          .style('opacity', 0.8);
        this.tooltip
          .html(d.label)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px');
      })
      .on('mouseout.tooltip', () => {
        this.tooltip
          .transition()
          .duration(100)
          .style('opacity', 0);
      })
      .on('mousemove', () => {
        this.tooltip
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 10 + 'px');
      });

    selection
      .append('text')
      .attr(
        'x',
        graphSettings.labelDirection *
          (graphSettings.nodeRadius + graphSettings.labelDistance),
      )
      .attr('y', graphSettings.nodeRadius / 2)
      .text((d: ID3GraphNode) => {
        return d.label!.length > 20 ? d.label.slice(0, 20) + '...' : d.label;
      })
      .attr('class', 'Node-Label');
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
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>,
) {
  return {
    resetLayout: () => dispatch(actions.newLayout()),
    onAddNode: (nodeID: number) => dispatch(actions.addNode(nodeID)),
    toggleFreezeLayout: () => dispatch(actions.toggleFreezeLayout()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphRenderer);
