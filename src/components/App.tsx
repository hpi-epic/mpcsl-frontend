import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.scss';
import { Layout } from 'antd';
import { ObservationMatrixView } from './ObservationMatrixView/ObservationMatrixView';
import { ExperimentRoutes } from './ExperimentRoutes/ExperimentRoutes';
import { AppHeader } from './Header/AppHeader';

const { Content } = Layout;

const App = () => {
  return (
    <div style={{ background: '#eff1ef' }}>
      <Layout className="Layout">
        <AppHeader />
        <Content style={{ background: '#eff1ef' }}>
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
