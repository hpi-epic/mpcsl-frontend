import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import GraphRenderer from '../GraphRenderer/GraphRenderer';
import { connect } from 'react-redux';
import './GraphCausalExplorer.css';
import { IState } from '../../../store';
import { IAPIGraphNode, ID3GraphNode } from '../../../types/graphTypes';
import { Card } from 'antd';
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
import GraphDataModal from '../GraphDataModal';
import ExternalFactorList from '../../../components/GraphCausalExplorer/ExternalFactorsList';

interface IGraphCausalExplorerProps {
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  selectedGraph: Graph;
}

interface INode {
  nodeID: string;
  distribution: IAPIDistribution;
  nodeLabel: string;
  selection?: ISelectionTypes;
}

type ISelectionTypes =
  | { [bin: string]: number }
  | { startSelection: number; endSelection: number };
export type ISelectionAPITypes =
  | { categorical: boolean; values: string[] }
  | { categorical: boolean; from_value: number; to_value: number };

interface IGraphCausalExplorerState {
  conditions: {};
  effectNode: INode | undefined;
  causalNode: INode | undefined;
  externalFactors: { [nodeID: string]: INode } | undefined;
  selectedExternalFactorID: string | undefined;
  dataModalVisible: boolean;
  selectedNodeDataDistribution: IAPIDistribution | undefined;
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
      externalFactors: undefined,
      dataModalVisible: false,
      selectedExternalFactorID: undefined,
      selectedNodeDataDistribution: undefined,
    };
  }
  public render() {
    const externalFactorsNodes = this.props.selectedGraph.nodes.filter(
      (node: ID3GraphNode) =>
        this.state.effectNode &&
        node.id !== this.state.effectNode!.nodeID &&
        (this.state.causalNode && node.id !== this.state.causalNode!.nodeID),
    );

    const elementMap: { [viewId: string]: JSX.Element } = {
      externFactors: (
        <ExternalFactorList
          onExternalFactorClick={this.onExternalFactorClick}
          externalFactorsNodes={externalFactorsNodes}
        />
      ),
      externFactorsDistribution: !this.state.selectedExternalFactorID ? (
        <div>Extern Factors Distribution</div>
      ) : (
        <Card bodyStyle={cardBodyStyle}>
          <h3>
            External Factor:{' '}
            <i>
              {
                this.state.externalFactors![
                  this.state.selectedExternalFactorID!
                ].nodeLabel
              }
            </i>
          </h3>
          <div style={{ flexGrow: 1 }}>
            <SizeMe monitorHeight={true}>
              {({ size }: any) => (
                <DataDistributionPlot
                  key={this.state.selectedExternalFactorID!}
                  selectable={true}
                  data={
                    this.state.externalFactors![
                      this.state.selectedExternalFactorID!
                    ].distribution
                  }
                  plotHeight={size.height}
                  plotWidth={size.width}
                  onDataSelection={(data: ISelectionTypes) =>
                    this.onExternalFactorDataChange(
                      this.state.selectedExternalFactorID!,
                      data,
                    )
                  }
                  selection={
                    this.state.externalFactors![
                      this.state.selectedExternalFactorID!
                    ].selection
                      ? this.state.externalFactors![
                          this.state.selectedExternalFactorID!
                        ].selection
                      : undefined
                  }
                />
              )}
            </SizeMe>
          </div>
        </Card>
      ),
      renderer: (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <GraphRenderer
            key='test'
            isSelectionMode={false}
            showMenu={false}
            onNodeClick={this.showDataModal}
          />
          <GraphDataModal
            resizable={false}
            visible={this.state.dataModalVisible}
            data={this.state.selectedNodeDataDistribution}
            onClose={this.closeDataModal}
            position={{ bottom: 0, right: 0, type: 'absolute' }}
          />
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

  private onExternalFactorClick = async (nodeID: string) => {
    if (
      this.state.externalFactors === undefined ||
      !(nodeID in this.state.externalFactors!)
    ) {
      const distribution = await getNodeDataDistribution(nodeID);
      const externalFactors = this.state.externalFactors || {};

      externalFactors[nodeID] = {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name,
      };

      this.setState({
        selectedExternalFactorID: nodeID,
        externalFactors,
      });
    } else {
      this.setState({
        selectedExternalFactorID: nodeID,
      });
    }
  }

  private onExternalFactorDataChange = (
    nodeID: string,
    data: ISelectionTypes,
  ) => {
    const externalFactors = this.state.externalFactors;
    externalFactors![nodeID].selection = {
      ...data,
    };

    this.setState(
      {
        externalFactors,
      },
      () => this.onDataDistributionChange(),
    );
  }

  private onCausalNodeDataChange = (data: ISelectionTypes) => {
    if ('selectionEnd' in data) {
      if (data.selectionStart && data.selectionEnd) {
        const causalNode = {
          ...this.state.causalNode!,
          selection: data,
        };

        this.setState(
          {
            causalNode,
          },
          () => this.onDataDistributionChange(),
        );
      }
    } else {
      this.setState(
        {
          causalNode: {
            ...this.state.causalNode!,
            selection: data,
          },
        },
        () => this.onDataDistributionChange(),
      );
    }
  }

  private onDataDistributionChange = async () => {
    if (this.state.effectNode && this.state.causalNode) {
      const distributions: { [nodeID: string]: ISelectionAPITypes } = {};

      // causal node
      const causalNodeID = this.state.causalNode.nodeID;
      if (this.state.causalNode.selection) {
        distributions[causalNodeID] = getApiCondition(this.state.causalNode);
      }

      // external factors
      if (this.state.externalFactors) {
        Object.keys(this.state.externalFactors!).forEach((nodeID: string) => {
          const externalFactor = this.state.externalFactors![nodeID];
          if (externalFactor.selection) {
            distributions[nodeID] = getApiCondition(externalFactor);
          }
        });
      }

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

  private showDataModal = async (node: ID3GraphNode) => {
    const nodeDistribution: IAPIDistribution = await getNodeDataDistribution(
      String(node.id),
    );
    this.setState({
      dataModalVisible: true,
      selectedNodeDataDistribution: nodeDistribution,
    });
  }

  private closeDataModal = () => {
    this.setState({
      dataModalVisible: false,
    });
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
    availableNodes: state.graphExplorer!.availableNodes,
    selectedGraph: state.graphExplorer!.selectedGraph,
  };
}

const getApiCondition = (node: INode): ISelectionAPITypes => {
  if (node.distribution.categorical) {
    return {
      categorical: true,
      values: Object.keys(node.selection as {}).map((bin: string) => bin),
    };
  } else {
    return {
      categorical: false,
      from_value: (node.selection as any).selectionStart,
      to_value: (node.selection as any).selectionEnd,
    };
  }
};

export default connect(mapStateToProps)(GraphCausalExplorer);
