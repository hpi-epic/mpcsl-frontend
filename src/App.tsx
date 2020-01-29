import React from 'react';
import colors from './constants/colors';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { Layout } from 'antd';
import { ObservationMatrixView } from './containers/ObservationMatrixView/ObservationMatrixView';
import { ExperimentRoutes } from './ExperimentRoutes';
import { AppHeader } from './AppHeader';

const { Content } = Layout;

const App = () => {
  return (
    <div style={{ background: colors.contentBackground }}>
      <Layout className="Layout">
        <AppHeader />
        <Content style={{ background: colors.contentBackground }}>
          <Switch>
            <Route
              path="/:datasetId/experiments"
              component={ExperimentRoutes}
            />
            <Route path="/" component={ObservationMatrixView} />
          </Switch>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
