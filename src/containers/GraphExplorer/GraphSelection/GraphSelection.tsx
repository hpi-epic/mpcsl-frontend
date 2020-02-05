import React from 'react';
import { Col, Row } from 'antd';
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
  resultId: string;
}

interface IGraphSelectionProps extends RouteComponentProps<IMatchParams> {
  fetchAvailableNodes: (resultID: number) => void;
  onRemoveNode: (node: ID3GraphNode) => void;
  nodes: ID3GraphNode[];
  availableNodes: IAPIGraphNode[];
  currentResultID?: string;
}

class GraphSelection extends React.Component<IGraphSelectionProps, {}> {
  public componentDidMount() {
    this.props.fetchAvailableNodes(Number(this.props.match.params.resultId));
  }

  public render() {
    return (
      <Row style={{ height: '100%' }}>
        <Col span={4} style={{ height: 'inherit' }}>
          <GraphNodeList
            nodes={this.props.nodes}
            onRemoveNode={this.props.onRemoveNode}
            isSelectionMode={true}
          />
        </Col>
        <Col span={20} style={{ height: 'inherit' }}>
          <GraphRenderer showMenu={true} isSelectionMode={true} />
        </Col>
      </Row>
    );
  }
}

export function mapStateToProps(state: IState) {
  return {
    nodes: state.graphExplorer!.nodes,
    availableNodes: state.graphExplorer!.availableNodes,
    currentResultID: state.graphExplorer!.resultID!
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>
) {
  return {
    fetchAvailableNodes: (resultID: number) =>
      dispatch(actions.fetchAvailableNodes(resultID)),
    onRemoveNode: (node: ID3GraphNode) => dispatch(actions.removeNode(node))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphSelection);
