import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';

const GraphExplorer = () => {
  return (
    <Switch>
      <Route
        key="selection"
        path={`/:datasetId/experiments/:experimentId/jobs/:jobId/selection`}
        component={GraphSelection}
      />
      <Route
        key="annotate"
        path={`/:datasetId/experiments/:experimentId/jobs/:jobId/annotation`}
        component={GraphAnnotate}
      />
      <Route
        key="explorer"
        path={`/:datasetId/experiments/:experimentId/jobs/:jobId/explorer`}
        component={GraphCausalExplorer}
      />
      <Redirect
        exact={true}
        from={`/:datasetId/experiments/:experimentId/jobs/:jobId`}
        to={`/:datasetId/experiments/:experimentId/jobs/:jobId/selection`}
      />
    </Switch>
  );
};

export { GraphExplorer };
