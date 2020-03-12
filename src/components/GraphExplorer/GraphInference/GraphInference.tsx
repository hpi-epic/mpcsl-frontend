import React, { useEffect, useState } from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import { GraphRenderer } from '../GraphRenderer/GraphRenderer';
import './GraphInference.scss';
import { IAPIGraphNode, ID3GraphNode } from '../../../types/graphTypes';
import { Card, Checkbox, message } from 'antd';
import { NodeSelection } from './NodeSearch';
import { IAPIDistribution } from '../../../types/types';

import {
  getNodeDataDistribution,
  getConditionalNodeDataDistribution,
  getInterventionNodeDataDistribution,
  getConfounders
} from '../../../restAPI/apiRequests';
import DataDistributionPlot from '../../DataDistributions/DataDistributionPlot';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { SizeMe } from 'react-sizeme';
import GraphDataModal from '../GraphDataModal';
import {
  ExternalFactorList,
  IExternalFactorNode
} from '../ExternalFactorsList/ExternalFactorsList';
import { GraphSingleton, GraphChanges } from '../../../graph/graph';

interface IGraphInferenceProps {
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
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

interface IGraphInferenceState {
  conditions: {};
  effectNode: INode | undefined;
  causalNode: INode | undefined;
  externalFactors: { [nodeID: string]: INode } | undefined;
  selectedExternalFactorID: string | undefined;
  dataModalVisible: boolean;
  selectedNodeDataDistribution: IAPIDistribution | undefined;
  isIntervention: boolean;
}

const cardBodyStyle = {
  height: '100%',
  padding: '12px 18px 12px 18px',
  display: 'flex',
  flexFlow: 'column'
};

const getApiCondition = (node: INode): ISelectionAPITypes | undefined => {
  if (node.distribution.categorical) {
    const values = Object.keys(node.selection as {}).map((bin: string) => bin);
    if (values.length > 0) {
      return {
        categorical: true,
        values: Object.keys(node.selection as {}).map((bin: string) => bin)
      };
    } else {
      return undefined;
    }
  } else {
    return {
      categorical: false,
      from_value: (node.selection as any).selectionStart,
      to_value: (node.selection as any).selectionEnd
    };
  }
};

class GraphInference extends React.Component<
  IGraphInferenceProps,
  IGraphInferenceState
> {
  constructor(props: IGraphInferenceProps) {
    super(props);

    this.state = {
      conditions: {},
      effectNode: undefined,
      causalNode: undefined,
      externalFactors: undefined,
      dataModalVisible: false,
      selectedExternalFactorID: undefined,
      selectedNodeDataDistribution: undefined,
      isIntervention: false
    };
  }
  public render() {
    const externalFactorsNodes = this.props.nodes.filter(
      (node: ID3GraphNode) =>
        this.state.effectNode &&
        node.id !== this.state.effectNode!.nodeID &&
        this.state.causalNode &&
        node.id !== this.state.causalNode!.nodeID
    );

    // add information about whether node distribution was edited
    const enrichedExternalFactorNodes = externalFactorsNodes.map(
      (node: ID3GraphNode): IExternalFactorNode => {
        if (
          this.state.externalFactors &&
          node.id in this.state.externalFactors! &&
          this.state.externalFactors![node.id].selection !== undefined
        ) {
          return {
            ...node,
            edited: true
          };
        } else {
          return {
            ...node,
            edited: false
          };
        }
      }
    );

    const elementMap: { [viewId: string]: JSX.Element } = {
      externFactors: (
        <ExternalFactorList
          onExternalFactorClick={this.onExternalFactorClick}
          externalFactorsNodes={enrichedExternalFactorNodes}
        />
      ),
      externFactorsDistribution: !this.state.selectedExternalFactorID ? (
        <div />
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
                      data
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
            key="test"
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
                nodes={this.props.nodes.filter(
                  (node: ID3GraphNode) =>
                    !node.isContext &&
                    ((this.state.effectNode &&
                      node.id !== this.state.effectNode!.nodeID) ||
                      !this.state.effectNode)
                )}
                placeholder="Select a Causal Node"
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
          <div>
            Intervention:
            <Checkbox onChange={this.toggleIntervention} />
          </div>
          <div style={{ flexGrow: 1 }}>
            {!this.state.effectNode ? (
              <NodeSelection
                onNodeSelection={this.onEffectNodeClick}
                nodes={this.props.nodes.filter(
                  (node: ID3GraphNode) =>
                    !node.isContext &&
                    ((this.state.causalNode &&
                      node.id !== this.state.causalNode!.nodeID) ||
                      !this.state.causalNode)
                )}
                placeholder="Select an Effect Node"
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
      )
    };

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          backgroundColor: 'white'
        }}
      >
        <Mosaic<string>
          renderTile={id => elementMap[id]}
          initialValue={{
            direction: 'row',
            first: {
              direction: 'column',
              first: 'externFactors',
              second: 'externFactorsDistribution',
              splitPercentage: 55
            },
            second: {
              direction: 'column',
              first: 'renderer',
              second: {
                direction: 'row',
                first: 'firstConditionNode',
                second: 'exploreNode'
              },
              splitPercentage: 55
            },
            splitPercentage: 20
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
        nodeLabel: distribution.node.name
      }
    });
  };

  private onCausalNodeClick = async (nodeID: string) => {
    const distribution = await getNodeDataDistribution(nodeID);
    this.setState({
      causalNode: {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name
      }
    });
  };

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
        nodeLabel: distribution.node.name
      };

      this.setState({
        selectedExternalFactorID: nodeID,
        externalFactors
      });
    } else {
      this.setState({
        selectedExternalFactorID: nodeID
      });
    }
  };

  private onExternalFactorDataChange = (
    nodeID: string,
    data: ISelectionTypes
  ) => {
    const externalFactors = this.state.externalFactors;
    externalFactors![nodeID].selection = {
      ...data
    };

    this.setState(
      {
        externalFactors
      },
      () => this.onDataDistributionChange()
    );
  };

  private onCausalNodeDataChange = (data: ISelectionTypes) => {
    if ('selectionEnd' in data) {
      if (data.selectionStart && data.selectionEnd) {
        const causalNode = {
          ...this.state.causalNode!,
          selection: data
        };

        this.setState(
          {
            causalNode
          },
          () => this.onDataDistributionChange()
        );
      }
    } else {
      this.setState(
        {
          causalNode: {
            ...this.state.causalNode!,
            selection: data
          }
        },
        () => this.onDataDistributionChange()
      );
    }
  };

  private onDataDistributionChange = async () => {
    if (this.state.effectNode && this.state.causalNode) {
      let distribution;

      if (this.state.isIntervention) {
        if (this.state.causalNode.selection) {
          const condition = getApiCondition(this.state.causalNode);

          const confounders = await getConfounders(
            this.state.causalNode.nodeID
          );
          distribution = await getInterventionNodeDataDistribution(
            +this.state.causalNode.nodeID,
            +this.state.effectNode.nodeID,
            confounders.confounders[0].map(x => +x),
            condition
          );
          const effectNode = this.state.effectNode;
          this.setState({
            effectNode: {
              ...effectNode,
              distribution
            }
          });
        } else {
          message.info('Please select a category');
        }
      } else {
        const distributions: { [nodeID: string]: ISelectionAPITypes } = {};

        // causal node
        const causalNodeID = this.state.causalNode.nodeID;
        if (this.state.causalNode.selection) {
          const condition = getApiCondition(this.state.causalNode);
          if (condition) {
            distributions[causalNodeID] = condition;
          }
        }

        // external factors
        if (this.state.externalFactors) {
          Object.keys(this.state.externalFactors!).forEach((nodeID: string) => {
            const externalFactor = this.state.externalFactors![nodeID];
            if (externalFactor.selection) {
              const condition = getApiCondition(externalFactor);
              if (condition) {
                distributions[nodeID] = condition;
              }
            }
          });
        }

        if (Object.keys(distributions).length < 1) {
          distribution = await getNodeDataDistribution(
            this.state.effectNode.nodeID
          );
        } else {
          distribution = await getConditionalNodeDataDistribution(
            this.state.effectNode.nodeID,
            distributions
          );
        }

        const effectNode = this.state.effectNode;
        this.setState({
          effectNode: {
            ...effectNode,
            distribution
          }
        });
      }
    }
  };

  private showDataModal = async (node: ID3GraphNode) => {
    const nodeDistribution: IAPIDistribution = await getNodeDataDistribution(
      String(node.id)
    );
    this.setState({
      dataModalVisible: true,
      selectedNodeDataDistribution: nodeDistribution
    });
  };

  private closeDataModal = () => {
    this.setState({
      dataModalVisible: false
    });
  };

  private toggleIntervention = () => {
    const isInterv = this.state.isIntervention;
    this.setState(
      {
        isIntervention: !isInterv
      },
      this.onDataDistributionChange
    );
  };
}

const ConnectedGraphInference = () => {
  const [availableNodes, setAvailableNodes] = useState(
    GraphSingleton.availableNodes
  );
  const [nodes, setNodes] = useState(GraphSingleton.nodes);
  useEffect(() => {
    const sub = GraphSingleton.subscribeToGraphChanges(e => {
      switch (e) {
        case GraphChanges.AvailableNodeChanged:
          setAvailableNodes(GraphSingleton.availableNodes);
          break;
        case GraphChanges.NodesChanged:
          setNodes(GraphSingleton.nodes.filter(node => !node.isContext));
          break;
      }
    });
    return () => sub.unsubscribe();
  }, []);
  return <GraphInference nodes={nodes} availableNodes={availableNodes} />;
};

export default ConnectedGraphInference;
