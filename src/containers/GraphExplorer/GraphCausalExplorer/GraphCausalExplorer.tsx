import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import GraphRenderer from '../GraphRenderer/GraphRenderer';
import { connect } from 'react-redux';
import './GraphCausalExplorer.css';
import { IState } from '../../../store';
import { IAPIGraphNode, ID3GraphNode } from '../../../types/graphTypes';
import { List, Tooltip } from 'antd';
import Graph from '../../../utils/graph';

interface IGraphCausalExplorerProps {
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  selectedGraph: Graph;
}

interface IGraphCausalExplorerState {
  conditions: {};
}

class GraphCausalExplorer extends React.Component<
  IGraphCausalExplorerProps,
  IGraphCausalExplorerState
> {
  constructor(props: IGraphCausalExplorerProps) {
    super(props);

    this.state = {
      conditions: {},
    };
  }
  public render() {
    const externFactorsNodes = this.props.selectedGraph.nodes.filter(
      (value: ID3GraphNode) => true, // TODO
    );

    const externFactorsList = (
      <List
        size='small'
        header={
          <div style={{ padding: '14px', fontWeight: 'bold' }}>
            External Factors
          </div>}
        dataSource={externFactorsNodes}
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
          {externFactorsList}
        </div>
      ),
      externFactorsDistribution: <div>Extern Factors Distribution</div>,
      renderer: (
        <div style={{ overflow: 'hidden' }}>
          <GraphRenderer key='test' isSelectionMode={false} showMenu={false} />
        </div>
      ),
      firstConditionNode: <div>First Condition Node</div>,
      exploreNode: <div>Exploration Node</div>,
    };

    return (
      <div style={{ width: '100%', height: '100%', margin: 0 }}>
        <Mosaic<string>
          renderTile={(id) => elementMap[id]}
          initialValue={{
            direction: 'row',
            first: {
              direction: 'column',
              first: 'externFactors',
              second: 'externFactorsDistribution',
              splitPercentage: 70,
            },
            second: {
              direction: 'column',
              first: 'renderer',
              second: {
                direction: 'row',
                first: 'firstConditionNode',
                second: 'exploreNode',
              },
              splitPercentage: 70,
            },
            splitPercentage: 20,
          }}
        />
      </div>
    );
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
