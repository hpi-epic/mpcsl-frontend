import React from 'react';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';
import GraphAnnotateDataModal from './GraphAnnotateDataModal';

import { Layout } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';
import { connect } from 'react-redux';
import { IState } from '../../../store';

interface IGraphExplorationProps {
  nodes: ID3GraphNode[];
}

interface IGraphExplorationState {
  dataModalVisible: boolean;
}

class GraphAnnotate extends React.Component<
  IGraphExplorationProps,
  IGraphExplorationState
> {
  constructor(props: IGraphExplorationProps) {
    super(props);

    this.state = {
      dataModalVisible: false,
    };
  }

  public render() {
    return (
      <div>
        <Layout>
          <Layout.Sider className='graphSelectionSider'>
            <GraphNodeList
              nodes={this.props.nodes}
              onNodeClick={(node: ID3GraphNode) => console.log(node)}
            />
          </Layout.Sider>
          <GraphAnnotateDataModal visible={this.state.dataModalVisible} />
          <GraphRenderer
            isSelectionMode={false}
            onNodeClick={this.showDataModal} // example function
          />
        </Layout>
      </div>
    );
  }

  private showDataModal = (node: ID3GraphNode) => {
    this.setState({
      dataModalVisible: true,
    });
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
  };
}

export default connect(mapStateToProps)(GraphAnnotate);
