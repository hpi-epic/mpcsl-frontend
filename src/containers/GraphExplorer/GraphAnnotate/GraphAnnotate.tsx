import React from 'react';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';
import { Layout } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';
import { connect } from 'react-redux';

import { IState } from '../../../store';

interface IGraphExplorationProps {
  nodes: ID3GraphNode[];
}

class GraphAnnotate extends React.Component<IGraphExplorationProps, {}> {
  constructor(props: IGraphExplorationProps) {
    super(props);
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
          <GraphRenderer
            isSelectionMode={false}
            onNodeClick={(node: ID3GraphNode) => console.log(node)} // example function
          />
        </Layout>
      </div>
    );
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
  };
}

export default connect(mapStateToProps)(GraphAnnotate);
