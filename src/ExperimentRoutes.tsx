import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import ExperimentDetails from './containers/ExperimentDetails/ExperimentDetails';
import { ExperimentsView } from './containers/ExperimentsView/ExperimentsView';
import { ExperimentComparison } from './containers/ExperimentComparison/ExperimentComparison';
import { GraphExplorer } from './containers/GraphExplorer/GraphExplorer';

const ExperimentRoutes = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  return (
    <Switch>
      <Route
        from={`${match?.path}/:experimentId/jobs/:resultId`}
        component={GraphExplorer}
      />
      <Route
        path={`${match?.path}/:experimentId/jobs`}
        component={ExperimentDetails}
      />
      <Route
        path={`${match?.path}/:experimentId/compare`}
        component={ExperimentComparison}
      />
      <Route path={match?.path} exact component={ExperimentsView} />
      <Route render={() => <h1>404 - Not Found</h1>} />
    </Switch>
  );
};

export { ExperimentRoutes };
