import { Breadcrumb, Icon, Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import { getExperiment, getObservationMatrix } from '../../restAPI/apiRequests';
import { IExperiment, IObservationMatrix } from '../../types/types';
import { NewObservationMatrixButton } from '../ObservationMatrixView/NewObservationMatrixButton';
import { GraphExplorerHeader } from './GraphExplorerHeader';
import { ExperimentsListHeader } from './ExperimentListHeader';
import { shorten } from '../../helper/helper';

export const AppHeader = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const [dataset, setDataset] = useState<undefined | IObservationMatrix>();
  const [experiment, setExperiment] = useState<undefined | IExperiment>();
  useEffect(() => {
    if (pathSnippets.includes('experiments')) {
      getObservationMatrix(parseInt(pathSnippets[0], 10))
        .then(setDataset)
        .catch();
      if (pathSnippets.includes('jobs') || pathSnippets.includes('compare')) {
        getExperiment(parseInt(pathSnippets[2], 10))
          .then(setExperiment)
          .catch();
      } else {
        setExperiment(undefined);
      }
    } else {
      setDataset(undefined);
    }
  }, [location, pathSnippets]);

  const datasetName = dataset ? dataset.name : '<Loading...>';
  const experimentName = experiment ? experiment.name : '<Loading...>';
  const breadcrumbItems = [
    <Breadcrumb.Item key="datasets">
      <Link style={{ color: 'white' }} to="/">
        <Icon type="home" /> Home
      </Link>
    </Breadcrumb.Item>
  ];
  pathSnippets.forEach((element, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    switch (element) {
      case 'experiments':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Experiments of {shorten(datasetName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'jobs':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Jobs of {shorten(experimentName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'compare':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Comparison of {shorten(experimentName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'selection':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Selection of {shorten(experimentName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'exploration':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Exploration of {shorten(experimentName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'inference':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Inference of {shorten(experimentName, 25)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
    }
  });
  return (
    <Layout.Header
      className="Header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexGrow: 1,
          alignItems: 'center'
        }}
      >
        <div style={{ flexGrow: 4 }}>
          <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
        </div>
        <Switch>
          <Route
            path="/:datasetId/experiments/:experimentId/jobs/:resultId/:view"
            component={GraphExplorerHeader}
          />
          <Route
            path="/:datasetId/experiments"
            component={ExperimentsListHeader}
          />
          <Route exact path="" component={NewObservationMatrixButton} />
          <Route />
        </Switch>
      </div>
    </Layout.Header>
  );
};
