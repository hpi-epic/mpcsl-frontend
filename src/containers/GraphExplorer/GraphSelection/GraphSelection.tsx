import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import GraphRenderer from '../GraphRenderer/GraphRenderer';
import GraphNodeList from '../../../components/GraphNodeList/GraphNodeList';
import * as actions from '../../../actions/graphExplorer';

import './GraphSelection.css';
import { IState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { ID3GraphNode } from '../../../types/graphTypes';
import { CIGraph } from '../../../utils/graph';

interface IMatchParams {
  result_id: string;
}

interface IGraphSelectionProps extends RouteComponentProps<IMatchParams> {
  fetchGraph: (resultID: number) => void;
  onRemoveNode: (node: ID3GraphNode) => void;
  nodes: ID3GraphNode[];
  graph: CIGraph;
  currentResultID?: string;
}

class GraphSelection extends React.Component<IGraphSelectionProps, {}> {
  constructor(props: IGraphSelectionProps) {
    super(props);
  }

  public componentDidMount() {
    if (this.props.currentResultID !== this.props.match.params.result_id) {
      this.props.fetchGraph(Number(this.props.match.params.result_id));
    }
  }

  public render() {
    return (
      <Layout>
        <Layout.Sider className='graphSelectionSider'>
          <GraphNodeList
            nodes={this.props.nodes}
            onRemoveNode={this.props.onRemoveNode}
            isSelectionMode={true}
          />
        </Layout.Sider>
        <GraphRenderer isSelectionMode={true} />
      </Layout>
    );
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
    graph: state.graphExplorer!.graph,
    currentResultID: state.graphExplorer!.resultID!,
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>,
) {
  return {
    fetchGraph: (resultID: number) => dispatch(actions.fetchGraph(resultID)),
    onRemoveNode: (node: ID3GraphNode) => dispatch(actions.removeNode(node)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphSelection);
