import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';
import { ThunkDispatch } from 'redux-thunk';
import * as actions from '../../actions/graphExplorer';
import { IState } from '../../store';
import { connect } from 'react-redux';

const mapDispatchToProps = (
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>
) => {
  return {
    reset: () => dispatch(actions.reset())
  };
};

const GraphExplorer = (props: ReturnType<typeof mapDispatchToProps>) => {
  const { reset } = props;
  useEffect(() => {
    return (): void => {
      reset();
    };
  }, [reset]);
  return (
    <Switch>
      <Route
        key="selection"
        path={'/:datasetId/experiments/:experimentId/jobs/:resultId/selection'}
        component={GraphSelection}
      />
      <Route
        key="annotate"
        path={'/:datasetId/experiments/:experimentId/jobs/:resultId/annotation'}
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
};

const GraphExplorerRedux = connect(null, mapDispatchToProps)(GraphExplorer);

export { GraphExplorerRedux };
