import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { ExperimentDetails } from '../ExperimentDetails/ExperimentDetails';
import { ExperimentsView } from '../ExperimentsView/ExperimentsView';
import { ExperimentComparison } from '../ExperimentComparison/ExperimentComparison';
import { GraphExplorer } from '../GraphExplorer/GraphExplorer';

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
