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

import { getNodeDataDistribution } from '../../../actions/apiRequests';

interface IGraphCausalExplorerProps {
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  selectedGraph: Graph;
}

interface IGraphCausalExplorerState {
  conditions: {};
  effectNode:
    | { nodeID: string; distribution: IAPIDistribution; nodeLabel: string }
    | undefined;
  causalNode:
    | { nodeID: string; distribution: IAPIDistribution; nodeLabel: string }
    | undefined;
}

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
      (value: ID3GraphNode) => true, // TODO
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
        <Card title='Causal Node'>
          <div style={{ height: '100%' }}>
            {!this.state.causalNode ? (
              <NodeSelection
                onNodeSelection={this.onCausalNodeClick}
                nodes={this.props.selectedGraph.nodes.filter(
                  (node: ID3GraphNode) => !node.isContext,
                )}
                placeholder='Select a Causal Node'
              />
            ) : (
              <div />
            )}
          </div>
        </Card>
      ),
      exploreNode: (
        <Card title='Effect Node'>
          <div style={{ height: '100%' }}>
            {!this.state.effectNode ? (
              <NodeSelection
                onNodeSelection={this.onEffectNodeClick}
                nodes={this.props.selectedGraph.nodes.filter(
                  (node: ID3GraphNode) => !node.isContext,
                )}
                placeholder='Select an Effect Node'
              />
            ) : (
              <div />
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

  public onEffectNodeClick = async (nodeID: string) => {
    const distribution = await getNodeDataDistribution(nodeID);
    this.setState({
      effectNode: {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name,
      },
    });
  }

  public onCausalNodeClick = async (nodeID: string) => {
    const distribution = await getNodeDataDistribution(nodeID);
    this.setState({
      causalNode: {
        nodeID,
        distribution,
        nodeLabel: distribution.node.name,
      },
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

export default connect(mapStateToProps)(GraphCausalExplorer);
