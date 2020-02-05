import React from 'react';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';

import { Row, Col } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';
import { connect } from 'react-redux';
import { IState } from '../../../store';
import { IAPIDistribution } from '../../../types';
import { getNodeDataDistribution } from '../../../actions/apiRequests';
import GraphDataModal from '../GraphDataModal';

interface IGraphExplorationProps {
  nodes: ID3GraphNode[];
}

interface IGraphExplorationState {
  dataModalVisible: boolean;
  selectedNodeDataDistribution: IAPIDistribution | undefined;
}

class GraphAnnotate extends React.Component<
  IGraphExplorationProps,
  IGraphExplorationState
> {
  constructor(props: IGraphExplorationProps) {
    super(props);

    this.state = {
      dataModalVisible: false,
      selectedNodeDataDistribution: undefined
    };
  }

  public render() {
    return (
      <Row style={{ height: '100%' }}>
        <Col span={4} style={{ height: 'inherit' }}>
          <GraphNodeList
            nodes={this.props.nodes}
            onNodeClick={this.showDataModal}
            isSelectionMode={false}
          />
        </Col>
        <Col span={20} style={{ height: 'inherit' }}>
          <GraphDataModal
            resizable={true}
            visible={this.state.dataModalVisible}
            data={this.state.selectedNodeDataDistribution}
            onClose={this.closeDataModal}
            position={{ bottom: 0, right: 0, type: 'fixed' }}
          />
          <GraphRenderer
            showMenu={false}
            isSelectionMode={false}
            onNodeClick={this.showDataModal}
          />
        </Col>
      </Row>
    );
  }

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
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes
  };
}

export default connect(mapStateToProps)(GraphAnnotate);
