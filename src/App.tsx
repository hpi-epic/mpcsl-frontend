import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import colors from './constants/colors';

import './App.css';
import GraphExplorer from './containers/GraphExplorer';
import PipelineManager from './containers/PipelineManager';
import RuntimeManager from './containers/RuntimeManager';
import { Routes } from './types';

class App extends Component {
  public render() {
    return (
      <div style={{ background: colors.contentBackground }}>
        <Switch>
          <Route path={Routes.manager} component={PipelineManager} />
          <Route path={Routes.graphExplorer} component={GraphExplorer} />
          <Route path={Routes.runtimeManager} component={RuntimeManager} />
          <Redirect from='/' to={Routes.experimentManager} />
        </Switch>
      </div>
    );
  }
}

export default App;
