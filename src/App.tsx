import React from 'react';
import colors from './constants/colors';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { Layout, Button } from 'antd';
import { ObservationMatrixList } from './components/ObservationMatrixList/ObservationMatrixList';
import { ExperimentRoutes } from './ExperimentRoutes';

const { Header, Content } = Layout;

const App = () => {
  return (
    <div style={{ background: colors.contentBackground }}>
      <Layout className="Layout">
        <Header
          className="Header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            onClick={() => console.log('Home')}
            icon="home"
            ghost={true}
          />
        </Header>
        <Content style={{ background: colors.contentBackground }}>
          <Switch>
            {/* <Route
              path="/:datasetId/experiments/:experimentId/explore"
              component={GraphExplorer}
            /> */}
            <Route
              path="/:datasetId/experiments"
              component={ExperimentRoutes}
            />
            <Route path="/" component={ObservationMatrixList} />
          </Switch>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
