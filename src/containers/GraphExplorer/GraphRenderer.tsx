import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../actions/graphExplorer';
import { IStoreState } from '../../types';
import { Dispatch } from 'redux';
import { D3Graph, D3GraphLink } from '../../types/graph';

export interface IGraphRendererProps {
  onFetchGraph: () => void;
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

  constructor(props: IGraphRendererProps) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.force = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-130))
      .force(
        'center',
        d3.forceCenter(this.state.width / 2, this.state.height / 2)
      )
      .force('collision', d3.forceCollide().radius(15));
  }

  componentDidMount() {
    this.force.on('tick', () => {
      this.forceUpdate();
    });
  }

  componentWillReceiveProps(nextProps: IGraphRendererProps) {
    this.force.nodes(nextProps.selectedGraph.nodes).force(
      'link',
      d3
        .forceLink(nextProps.selectedGraph.links)
        .distance(graphSettings.forceLinkDistance)
        .id(function(d: any) {
          return d.id;
        })
    );
    this.force.restart();
  }

  shouldComponentUpdate(
    nextProps: IGraphRendererProps,
    nextState: IGraphRendererState
  ) {
    if (nextProps.selectedGraph) {
      console.log(nextProps);
      return true;
    }
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
    const nodes = this.props.selectedGraph.nodes.map(node => {
      const transform = `translate(${node.x},${node.y})`;
      return (
        <g className="node" key={node.id} transform={transform}>
          <circle r={graphSettings.nodeRadius} fill={graphSettings.nodeColor}/>
          <text x={graphSettings.labelDirection * (graphSettings.nodeRadius + graphSettings.labelDistance)} y={graphSettings.nodeRadius / 2} color={graphSettings.labelColor}>
            {node.id}
          </text>
        </g>
      );
    });

    const links = this.props.selectedGraph.links.map(
      (link: D3GraphLink, id: number) => (
        <line
          className="link"
          key={id}
          strokeWidth={graphSettings.strokeWidth}
          stroke={graphSettings.linkColor}
          // @ts-ignore
          x1={link.source.x}
          // @ts-ignore
          x2={link.target.x}
          // @ts-ignore
          y1={link.source.y}
          // @ts-ignore
          y2={link.target.y}
          markerEnd="url(#arrow)"
          opacity={graphSettings.linkOpacity}
        />
      )
    );
    return (
      <svg width={this.state.width} height={this.state.height}>
        {defs}
        {links}
        {nodes}
      </svg>
    );
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
