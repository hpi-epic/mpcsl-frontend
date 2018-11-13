import { Layout } from 'antd';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import colors from './colors';

const { Header, Content, Footer }  = Layout;

import './App.css';
import DatasetManagement from './container/DatasetManagement';
import ExperimentManagement from './container/ExperimentManagement';

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
