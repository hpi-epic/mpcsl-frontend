import React from 'react';
import { Routes } from '../../constants/routes';
import * as actions from '../../actions/graphExplorer';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';
import { IState } from '../../store';
import { ID3GraphNode, IAPIGraphNode } from '../../types/graphTypes';
import { ThunkDispatch } from 'redux-thunk';

import './index.css';

export interface IGraphExplorerState {
  view: typeof Routes;
  value: any;
  options: null | object[];
}

interface IMatchParams {
  result_id: string;
}

export interface IGraphExplorerProps extends RouteComponentProps<IMatchParams> {
  onAddNode: (nodeID: number) => void;
  availableNodes: IAPIGraphNode[];
  nodes: ID3GraphNode[];
}

class GraphExplorer extends React.Component<IGraphExplorerProps, any> {
  constructor(props: IGraphExplorerProps) {
    super(props);

    this.state = {
      view: this.props.location.pathname.replace(new RegExp('\\/\\d*$'), ''),
      value: '',
      options: null
    };
  }

  public render() {
    return (
      <Switch>
        <Route
          key="selection"
          path={
            '/:datasetId/experiments/:experimentId/jobs/:resultId/selection'
          }
          component={GraphSelection}
        />
        <Route
          key="annotate"
          path={
            '/:datasetId/experiments/:experimentId/jobs/:resultId/annotation'
          }
          component={GraphAnnotate}
        />
        <Route
          key="explorer"
          path={
            '/:datasetId/experiments/:experimentId/jobs/:resultId/exploration'
          }
          component={GraphCausalExplorer}
        />
        <Redirect
          exact={true}
          from={'/:datasetId/experiments/:experimentId/jobs/:resultId'}
          to={'/:datasetId/experiments/:experimentId/jobs/:resultId/selection'}
        />
      </Switch>
    );
  }
}

export function mapStateToProps(state: IState) {
  return {
    availableNodes: state.graphExplorer!.availableNodes,
    nodes: state.graphExplorer!.nodes
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>
) {
  return {
    onAddNode: (nodeID: number) => dispatch(actions.addNode(nodeID))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer);
