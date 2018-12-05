import { Layout } from 'antd';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
// import * as d3 from 'd3';
import ListElement from './components/listElement/ListElement';
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
          <ListElement title={'Experiement1'} status={'error'} statusText={'Failed'} content={'Show content'}/>
        </Content>
      </Layout>
    );
  }
}

export default App;
