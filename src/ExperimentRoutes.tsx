import React from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';
import ExperimentDetails from './containers/ExperimentDetails/ExperimentDetails';
import { ExperimentsView } from './containers/ExperimentsList/ExperimentsView';
import GraphExplorer from './containers/GraphExplorer/';

const ExperimentRoutes = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  return (
    <Switch>
      <Redirect
        from={`${match?.path}/:experimentId/jobs/:resultId`}
        to={`/graph-explorer/selection/:resultId`}
      />
      <Route
        path={`${match?.path}/:experimentId/jobs`}
        component={ExperimentDetails}
      />
      <Route path={match?.path} exact component={ExperimentsView} />
      <Route render={() => <h1>404 - Not Found</h1>} />
    </Switch>
  );
};

export { ExperimentRoutes };
