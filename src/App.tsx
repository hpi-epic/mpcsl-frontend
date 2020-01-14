import React from 'react';
import colors from './constants/colors';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import { Layout, Button, Breadcrumb } from 'antd';
import { ObservationMatrixView } from './components/ObservationMatrixView/ObservationMatrixView';
import { ExperimentRoutes } from './ExperimentRoutes';
import GraphExplorer from './containers/GraphExplorer';
import { AppHeader } from './AppHeader';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';

const { Header, Content } = Layout;

const breadcrumbNameMap: { [key: string]: string } = {
  experiments: 'Experiments',
  jobs: 'Jobs'
};

const App = withRouter(props => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = [
    <Breadcrumb.Item key="datasets">
      <Link to="/">Observation Matrices</Link>
    </Breadcrumb.Item>
  ];
  pathSnippets.forEach((element, index) => {
    if (element in breadcrumbNameMap) {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[element]}</Link>
        </Breadcrumb.Item>
      );
    }
  });
  return (
    <div style={{ background: colors.contentBackground }}>
      <Layout className="Layout">
        <AppHeader />
        <Content style={{ background: colors.contentBackground }}>
          <Breadcrumb className="Breadcrumb">{breadcrumbItems}</Breadcrumb>
          <Switch>
            <Route path="/graph-explorer" component={GraphExplorer} />
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
});

export default App;
