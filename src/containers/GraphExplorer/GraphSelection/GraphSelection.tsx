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
import { ID3GraphNode, IAPIGraphNode } from '../../../types/graphTypes';

interface IMatchParams {
  result_id: string;
}

interface IGraphSelectionProps extends RouteComponentProps<IMatchParams> {
  fecthAvailableNodes: (resultID: number) => void;
  onRemoveNode: (node: ID3GraphNode) => void;
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  currentResultID?: string;
}

class GraphSelection extends React.Component<IGraphSelectionProps, {}> {
  constructor(props: IGraphSelectionProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.fecthAvailableNodes(Number(this.props.match.params.result_id));
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
    availableNodes: state.graphExplorer!.availableNodes,
    currentResultID: state.graphExplorer!.resultID!,
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>,
) {
  return {
    fecthAvailableNodes: (resultID: number) =>
      dispatch(actions.fetchAvailableNodes(resultID)),
    onRemoveNode: (node: ID3GraphNode) => dispatch(actions.removeNode(node)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphSelection);
