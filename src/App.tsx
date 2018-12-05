import React, { Component } from 'react';
import { Route } from 'react-router-dom';
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
        <Route exact={true} path='/' component={PipelineManager} />
        <Route path={Routes.manager} component={PipelineManager} />
        <Route path={Routes.graphExplorer} component={GraphExplorer} />
        <Route path={Routes.runtimeManager} component={RuntimeManager} />
      </div>
    );
  }
}

export default App;
