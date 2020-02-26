import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Row, Col, Button, Checkbox } from 'antd';
import { GraphSingleton, GraphChanges } from '../../../graph/graph';
import { ID3GraphNode, ID3GraphLink } from '../../../types/graphTypes';
import { useParams } from 'react-router-dom';
import styles from './GraphRenderer.module.scss';

/**
 * Settings for the D3 graph rendering
 */
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
  labelDirection: 1
};

type D3Nodes = d3.Selection<Element, ID3GraphNode, SVGGElement | null, unknown>;
type D3Graph = d3.Selection<SVGGElement, unknown, null, undefined>;
type D3SVG = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type Tooltip = d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

const updateNodes = (selection: D3Nodes) => {
  selection
    .attr('transform', d => `translate(${d.x ? d.x : 0},${d.y ? d.y : 0})`)
    .select('circle')
    .attr('fill', (d: ID3GraphNode): string => {
      return d.isContext
        ? graphSettings.contextNodeColor
        : graphSettings.focusNodeColor;
    })
    .attr('stroke', graphSettings.nodeStroke)
    .attr('stroke-width', graphSettings.nodeStrokeWidth)
    .attr('stroke-dasharray', (d: ID3GraphNode): string => {
      return d.isContext ? graphSettings.contextNodeStrokeDashArray : 'none';
    });
};

const enterNodes = (
  nodes: d3.Selection<
    d3.EnterElement,
    ID3GraphNode,
    SVGGElement | null,
    unknown
  >,
  onClick: (d: ID3GraphNode) => void,
  tooltip: Tooltip
) => {
  const selection = nodes.append('g');
  selection.classed('node', true);
  selection
    .append('circle')
    .on('click', onClick)
    .style('cursor', graphSettings.nodeMouseOverCursor)
    .attr('r', graphSettings.nodeRadius)
    .on('mouseover.tooltip', (d: ID3GraphNode) => {
      tooltip
        .transition()
        .duration(300)
        .style('opacity', 0.8);
      tooltip
        .html(d.label)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px');
    })
    .on('mouseout.tooltip', () => {
      tooltip
        .transition()
        .duration(100)
        .style('opacity', 0);
    })
    .on('mousemove', () => {
      tooltip
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 10 + 'px');
    });

  selection
    .append('text')
    .attr(
      'x',
      graphSettings.labelDirection *
        (graphSettings.nodeRadius + graphSettings.labelDistance)
    )
    .attr('y', graphSettings.nodeRadius / 2)
    .text(d => {
      return d.label.length > 20 ? d.label.slice(0, 20) + '...' : d.label;
    })
    .attr('class', styles.NodeLabel);
};

const enterLinks = (selection: d3.Selection<any, any, any, any>) => {
  selection
    .classed('link', true)
    .attr('stroke-width', d => d.size)
    .attr('stroke', graphSettings.linkColor)
    .attr('stroke-width', graphSettings.linkStrokeWidth)
    .attr('opacity', graphSettings.linkOpacity)
    .attr('marker-end', 'url(#arrow)');
};

const updateLinks = (selection: d3.Selection<any, any, any, any>) => {
  selection
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
};

const force = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-300))
  .force(
    'center',
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  )
  .force('collision', d3.forceCollide().radius(graphSettings.nodeColission));

const GraphMenu = () => {
  return (
    <Row
      type="flex"
      justify="start"
      style={{ marginTop: '5px', marginLeft: '5px' }}
    >
      <Col span={3}>
        <Button onClick={GraphSingleton.resetLayout}>Re-Layout</Button>
      </Col>
      <Col span={4} className={styles.GraphRendererMenu}>
        <Checkbox defaultChecked={true} onChange={GraphSingleton.toggleFreeze}>
          Freeze Layout
        </Checkbox>
      </Col>
      <Col span={5} />
    </Row>
  );
};

const updateGraph = (graph: D3Graph) => {
  updateNodes(graph.selectAll('.node'));
  updateLinks(graph.selectAll('.link'));
};

interface IProps {
  showMenu: boolean;
  isSelectionMode: boolean;
  onNodeClick?: (node: ID3GraphNode) => void;
}

const GraphRenderer = (props: IProps) => {
  const [d3Graph, setD3Graph] = useState<undefined | D3Graph>();
  const [d3SVG, setD3SVG] = useState<undefined | D3SVG>();
  const [tooltip, setTooltip] = useState<undefined | Tooltip>();
  const { resultId } = useParams<{ resultId: string }>();
  useEffect(() => {
    if (d3Graph) {
      force.on('tick', () => updateGraph(d3Graph));
      return () => {
        force.stop();
      };
    }
  }, [d3Graph]);
  useEffect(() => {
    if (d3SVG && d3Graph) {
      const zoomHandler = d3
        .zoom()
        .on('zoom', () => d3Graph.attr('transform', d3.event.transform));
      zoomHandler(d3SVG as any);
    }
  }, [d3SVG, d3Graph]);
  useEffect(() => {
    if (!tooltip) {
      setTooltip(
        d3
          .select('body')
          .append('div')
          .attr('class', styles.Tooltip)
          .style('opacity', 0)
      );
    } else {
      return () => {
        tooltip?.remove();
      };
    }
  }, [tooltip]);
  const { isSelectionMode, onNodeClick } = props;
  useEffect(() => {
    if (d3Graph && tooltip) {
      const updateAllNodes = () => {
        const nodes = d3Graph
          .selectAll<Element, ID3GraphNode>('.node')
          .data(GraphSingleton.nodes, node => node.id);
        nodes.exit().remove();
        updateNodes(nodes);
        enterNodes(
          nodes.enter(),
          d => {
            if (isSelectionMode) {
              GraphSingleton.addNode(parseInt(d.id), parseInt(resultId));
            } else if (onNodeClick) {
              onNodeClick(d);
            }
          },
          tooltip
        );
      };
      const updateAllLinks = () => {
        const links = d3Graph
          .selectAll<Element, ID3GraphLink>('.link')
          .data(GraphSingleton.links);
        enterLinks(links.enter().insert('line', '.node'));
        links.exit().remove();
        updateLinks(links);
      };
      const resetForce = () => {
        force.nodes(GraphSingleton.nodes).force(
          'links',
          d3
            .forceLink(GraphSingleton.links)
            .distance(graphSettings.forceLinkDistance)
            .id((d: any) => d.id)
        );
        force.alpha(1).restart();
      };
      updateAllNodes();
      updateAllLinks();
      resetForce();
      const sub = GraphSingleton.subscribeToGraphChanges(e => {
        if (e === GraphChanges.NodesChanged) {
          updateAllNodes();
        } else if (e === GraphChanges.LinksChanged) {
          updateAllLinks();
        }
        if (
          e === GraphChanges.NodesChanged ||
          e === GraphChanges.LinksChanged
        ) {
          resetForce();
        }
      });
      return () => sub.unsubscribe();
    }
  }, [d3Graph, tooltip, isSelectionMode, onNodeClick, resultId]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {props.showMenu ? <GraphMenu /> : null}
      <svg
        ref={ref => {
          if (ref && !d3SVG) {
            setD3SVG(d3.select(ref));
          }
        }}
        height={props.showMenu ? '95%' : '100%'}
        width="100%"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="-0 -5 10 10"
            refX={graphSettings.nodeRadius + 7}
            refY="0"
            orient="auto"
            markerWidth="13"
            markerHeight="13"
            opacity={graphSettings.linkOpacity}
          >
            <path
              d="M 0,-5 L 10 ,0 L 0,5"
              fill={graphSettings.linkColor}
              style={{ stroke: 'none' }}
            />
          </marker>
        </defs>
        <g
          ref={ref => {
            if (ref && !d3Graph) {
              setD3Graph(d3.select(ref));
            }
          }}
        />
      </svg>
    </div>
  );
};

export { GraphRenderer };
