import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import ExperimentDetails from './containers/ExperimentDetails/ExperimentDetails';
import { ExperimentsList } from './containers/ExperimentsList/ExperimentsList';

const ExperimentRoutes = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  return (
    <Switch>
      <Route
        path={`${match?.path}/:experimentId/jobs`}
        component={ExperimentDetails}
      />
      <Route path={match?.path} exact component={ExperimentsList} />
      <Route render={() => <h1>404 - Not Found</h1>} />
    </Switch>
  );
};

export { ExperimentRoutes };
