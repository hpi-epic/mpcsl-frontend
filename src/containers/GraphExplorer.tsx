import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../actions/graphExplorer';
import { IStoreState } from '../types';

export interface IProps {
  onFetchGraph?: () =>  void;
}

class GraphExplorer extends React.Component<IProps, any> {
  public render() {
    return (
      <div><button onClick={this.props.onFetchGraph}>Test</button></div>
    );
  }
}

export function mapStateToProps({ graph, subGraph }: IStoreState) {
  return {
    graph,
    subGraph,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.GraphExplorerAction>) {
  return {
    onFetchGraph: () => dispatch(actions.fetchGraph()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer);
