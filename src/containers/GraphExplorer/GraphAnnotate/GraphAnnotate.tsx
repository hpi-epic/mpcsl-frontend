import React from 'react';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';
import GraphAnnotateDataModal from './GraphAnnotateDataModal';

import { Layout } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';
import { connect } from 'react-redux';
import { IState } from '../../../store';
import { IAPIDistribution } from '../../../types';
import { getNodeDataDistribution } from '../../../actions/apiRequests';

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
      selectedNodeDataDistribution: undefined,
    };
  }

  public render() {
    return (
      <div>
        <Layout>
          <Layout.Sider className='graphSelectionSider'>
            <GraphNodeList
              nodes={this.props.nodes}
              onNodeClick={this.showDataModal}
              isSelectionMode={false}
            />
          </Layout.Sider>
          <GraphAnnotateDataModal
            visible={this.state.dataModalVisible}
            data={this.state.selectedNodeDataDistribution}
            onClose={this.closeDataModal}
          />
          <GraphRenderer
            isSelectionMode={false}
            onNodeClick={this.showDataModal}
          />
        </Layout>
      </div>
    );
  }

  private showDataModal = async (node: ID3GraphNode) => {
    const nodeDistribution: IAPIDistribution = await getNodeDataDistribution(
      String(node.id),
    );
    console.log(nodeDistribution);
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
  };
}

export default connect(mapStateToProps)(GraphAnnotate);
