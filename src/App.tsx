import { Layout } from 'antd';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import colors from './constants/colors';

const { Header, Content, Footer }  = Layout;

import './App.css';
import DatasetManagement from './containers/DatasetManagement';
import ExperimentManagement from './containers/ExperimentManagement';
import GraphExplorer from './containers/GraphExplorer';

class App extends Component {
  public render() {
    return (
      <Layout className='layout'>
        <Header className='header'>
          hjlasd
        </Header>
        <Content style={{ background: colors.contentBackground }}>
          <Switch>
            <Route exact={true} path='/' component={DatasetManagement} />
            <Route path='/experiment-management' component={ExperimentManagement} />
            <Route path='/graph-explorer' component={GraphExplorer} />
          </Switch>
        </Content>
        <Footer>
          Made by HPI
        </Footer>
      </Layout>
    );
  }
}

export default App;
