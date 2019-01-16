import React from 'react';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';
import { Layout } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';

interface IGraphExplorationProps {
  nodes: ID3GraphNode[];
}

class GraphAnnotate extends React.Component<
{},
IGraphExplorationProps
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      nodes: [ {id: 1, label: 'a'} ],
    };
  }

  public render() {
    return(
    <div>
      <Layout>
          <Layout.Sider className='graphSelectionSider'>
            <GraphNodeList nodes={this.state.nodes} />
          </Layout.Sider>
        <GraphRenderer />
      </Layout>
    </div>
    );
  }
}

export default GraphAnnotate;
