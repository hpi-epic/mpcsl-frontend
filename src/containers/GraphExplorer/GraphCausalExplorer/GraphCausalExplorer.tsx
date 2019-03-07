import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import GraphRenderer from '../GraphRenderer/GraphRenderer';
import { connect } from 'react-redux';
import './GraphCausalExplorer.css';
import { IState } from '../../../store';
import { IAPIGraphNode, ID3GraphNode } from '../../../types/graphTypes';
import { List, Tooltip, Card } from 'antd';
import Graph from '../../../utils/graph';
import { NodeSelection } from './NodeSearch';
import { IAPIDistribution } from '../../../types';

import {
  getNodeDataDistribution,
  getConditionalNodeDataDistribution,
} from '../../../actions/apiRequests';
import DataDistributionPlot from '../../../components/DataDistributions/DataDistributionPlot';
// @ts-ignore
import { SizeMe } from 'react-sizeme';

interface IGraphCausalExplorerProps {
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  selectedGraph: Graph;
}

type ISelectionTypes =
  | { [bin: string]: number }
  | { startSelection: number; endSelection: number };
type ISelectionAPITypes =
  | { categorical: boolean; values: string[] }
  | { categorical: boolean; from_value: number; to_value: number };

interface IGraphCausalExplorerState {
  conditions: {};
  effectNode:
    | {
        nodeID: string;
        distribution: IAPIDistribution;
        nodeLabel: string;
        selection?: ISelectionAPITypes;
      }
    | undefined;
  causalNode:
    | {
        nodeID: string;
        distribution: IAPIDistribution;
        nodeLabel: string;
        selection?: ISelectionAPITypes;
      }
    | undefined;
}

const cardBodyStyle = {
  height: '100%',
  padding: '12px 18px 12px 18px',
  display: 'flex',
  flexFlow: 'column',
};

class GraphCausalExplorer extends React.Component<
  IGraphCausalExplorerProps,
  IGraphCausalExplorerState
> {
  constructor(props: IGraphCausalExplorerProps) {
    super(props);

    this.state = {
      conditions: {},
      effectNode: undefined,
      causalNode: undefined,
    };
  }
  public render() {
    const externalFactorsNodes = this.props.selectedGraph.nodes.filter(
      (node: ID3GraphNode) =>
        (this.state.effectNode && node.id !== this.state.effectNode!.nodeID) ||
        (this.state.causalNode && node.id !== this.state.causalNode!.nodeID),
    );

    const externalFactorsList = (
      <List
        size='small'
        header={
          <div style={{ padding: '14px', fontWeight: 'bold' }}>
            External Factors
          </div>}
        dataSource={externalFactorsNodes}
        renderItem={(item: any) => (
          <Tooltip
            placement='topLeft'
            title={item.label}
            overlayStyle={{ paddingLeft: '4px' }}
          >
            <List.Item key={item.value} style={{ paddingLeft: '14px' }}>
              {item.label}
            </List.Item>
          </Tooltip>
        )}
      />
    );

    const elementMap: { [viewId: string]: JSX.Element } = {
      externFactors: (
        <div
          style={{
            backgroundColor: 'white',
            overflow: 'hidden',
            overflowY: 'scroll',
          }}
        >
          {externalFactorsList}
        </div>
      ),
      externFactorsDistribution: <div>Extern Factors Distribution</div>,
      renderer: (
        <div style={{ overflow: 'hidden' }}>
          <GraphRenderer key='test' isSelectionMode={false} showMenu={false} />
        </div>
      ),
      firstConditionNode: (
        <Card bodyStyle={cardBodyStyle}>
          <h3>
            Causal Node:{' '}
            {this.state.causalNode ? (
              <i>{this.state.causalNode.nodeLabel}</i>
            ) : null}
          </h3>
          <div style={{ flexGrow: 1 }}>
            {!this.state.causalNode ? (
              <NodeSelection
                onNodeSelection={this.onCausalNodeClick}
                nodes={this.props.selectedGraph.nodes.filter(
                  (node: ID3GraphNode) =>
                    !node.isContext &&
                    ((this.state.effectNode &&
                      node.id !== this.state.effectNode!.nodeID) ||
                      !this.state.effectNode),
                )}
                placeholder='Select a Causal Node'
              />
            ) : (
              <SizeMe monitorHeight={true}>
                {({ size }: any) => (
                  <DataDistributionPlot
                    selectable={true}
                    data={this.state.causalNode!.distribution}
                    plotHeight={size.height}
                    plotWidth={size.width}
                    onDataSelection={this.onCausalNodeDataChange}
                  />
                )}
              </SizeMe>
            )}
          </div>
        </Card>
      ),
      exploreNode: (
        <Card bodyStyle={cardBodyStyle}>
          <h3>
            Effect Node:{' '}
            {this.state.effectNode ? (
              <i> {this.state.effectNode.nodeLabel} </i>
            ) : null}
          </h3>
          <div style={{ flexGrow: 1 }}>
            {!this.state.effectNode ? (
              <NodeSelection
                onNodeSelection={this.onEffectNodeClick}
                nodes={this.props.selectedGraph.nodes.filter(
                  (node: ID3GraphNode) =>
                    !node.isContext &&
                    ((this.state.causalNode &&
                      node.id !== this.state.causalNode!.nodeID) ||
                      !this.state.causalNode),
                )}
                placeholder='Select an Effect Node'
              />
            ) : (
              <SizeMe monitorHeight={true}>
                {({ size }: any) => (
                  <DataDistributionPlot
                    selectable={false}
                    data={this.state.effectNode!.distribution}
                    plotHeight={size.height}
                    plotWidth={size.width}
                  />
                )}
              </SizeMe>
            )}
          </div>
        </Card>
      ),
    };

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          backgroundColor: 'white',
        }}
      >
        <Mosaic<string>
          renderTile={(id) => elementMap[id]}
          initialValue={{
            direction: 'row',
            first: {
              direction: 'column',
              first: 'externFactors',
              second: 'externFactorsDistribution',
              splitPercentage: 55,
            },
            second: {
              direction: 'column',
              first: 'renderer',
              second: {
                direction: 'row',
                first: 'firstConditionNode',
                second: 'exploreNode',
              },
              splitPercentage: 55,
            },
            splitPercentage: 20,
          }}
        />
      </div>
    );
  }

  private onEffectNodeClick = async (nodeID: string) => {
    const distribution = await getNodeDataDistribution(nodeID);
    this.setState({
      effectNode: {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name,
      },
    });
  }

  private onCausalNodeClick = async (nodeID: string) => {
    const distribution = await getNodeDataDistribution(nodeID);
    this.setState({
      causalNode: {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name,
      },
    });
  }

  private onCausalNodeDataChange = (data: ISelectionTypes) => {
    if ('selectionEnd' in data) {
      this.setState({
        causalNode: {
          ...this.state.causalNode!,
          selection: {
            categorical: false,
            from_value: data.selectionStart,
            to_value: data.selectionEnd,
          },
        },
      });
    } else {
      this.setState({
        causalNode: {
          ...this.state.causalNode!,
          selection: {
            categorical: true,
            values: Object.keys(data).map((value) => value.toString()),
          },
        },
      });
    }

    const distributions: any = {};
    distributions[this.state.causalNode!.nodeID] = {
      categorical: true,
      values: Object.keys(data).map((value) => value.toString()),
    };
    this.onDataDistributionChange(distributions);
  }

  private onDataDistributionChange = async (distributions: {
    [nodeID: number]: { [nodeID: number]: ISelectionAPITypes };
  }) => {
    if (this.state.effectNode && this.state.causalNode) {
      const distribution = await getConditionalNodeDataDistribution(
        this.state.effectNode.nodeID,
        distributions,
      );
      const effectNode = this.state.effectNode;
      this.setState({
        effectNode: {
          ...effectNode,
          distribution,
        },
      });
    }
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
    availableNodes: state.graphExplorer!.availableNodes,
    selectedGraph: state.graphExplorer!.selectedGraph,
  };
}

export default connect(mapStateToProps)(GraphCausalExplorer);
