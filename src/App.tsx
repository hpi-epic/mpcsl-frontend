import { Layout } from 'antd';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import colors from './constants/colors';

const { Header, Content }  = Layout;

import './App.css';
import DatasetManagement from './containers/DatasetManagement';
import ExperimentManagement from './containers/ExperimentManagement';
import GraphExplorer from './containers/GraphExplorer';
import RuntimeManager from './containers/RuntimeManager';

class App extends Component {
  public render() {
    return (
      <Layout className='layout'>
        <Header className='header'>
          TODO
        </Header>
        <Content style={{ background: colors.contentBackground }}>
          <Switch>
            <Route exact={true} path='/' component={DatasetManagement} />
            <Route path='/experiment-management' component={ExperimentManagement} />
            <Route path='/graph-explorer' component={GraphExplorer} />
            <Route path='/runtime-manager' component={RuntimeManager} />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default App;
