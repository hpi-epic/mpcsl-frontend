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

interface IMatchParams {
  result_id: string;
}

interface IGraphSelectionProps extends RouteComponentProps<IMatchParams> {
  fetchGraph: (resultID: number) => void;
  onRemoveNode: (nodeID: string) => void;
  nodes: string[];
}

class GraphSelection extends React.Component<IGraphSelectionProps, {}> {
  constructor(props: IGraphSelectionProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.fetchGraph(Number(this.props.match.params.result_id));
  }

  public render() {
    return (
      <Layout>
        <Layout.Sider className='graphSelectionSider'>
          <GraphNodeList
            nodes={this.props.nodes}
            onRemoveNode={this.props.onRemoveNode}
          />
        </Layout.Sider>
        <GraphRenderer />
      </Layout>
    );
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>,
) {
  return {
    fetchGraph: (resultID: number) => dispatch(actions.fetchGraph(resultID)),
    onRemoveNode: (nodeID: string) => dispatch(actions.removeNode(nodeID)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphSelection);
