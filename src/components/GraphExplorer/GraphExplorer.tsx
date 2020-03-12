import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphExplore from './GraphExplore/GraphExplore';
import GraphInference from './GraphInference/GraphInference';
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
        key="exploration"
        path={
          '/:datasetId/experiments/:experimentId/jobs/:resultId/exploration'
        }
        component={GraphExplore}
      />
      <Route
        key="inference"
        path={'/:datasetId/experiments/:experimentId/jobs/:resultId/inference'}
        component={GraphInference}
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
