import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';
import { GraphSingleton } from '../../graph/graph';

const GraphExplorer = () => {
  useEffect(() => {
    GraphSingleton.resetGraph();
  }, []);
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

export { GraphExplorer };