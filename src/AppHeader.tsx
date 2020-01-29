import React, { useState, useEffect } from 'react';
import {
  Route,
  Switch,
  RouteComponentProps,
  useLocation,
  Link
} from 'react-router-dom';
import { Layout, Radio, Breadcrumb, Icon } from 'antd';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import * as actions from './actions/graphExplorer';
import { IState } from './store';
import { IGraphExplorerProps } from './containers/GraphExplorer';
import Select from 'react-virtualized-select';
import { IExperiment } from './types';
import { IObservationMatrix } from './types';
import { getExperiment, getObservationMatrix } from './actions/apiRequests';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import { NewExperimentButton } from './containers/ExperimentsView/ExperimentsView';
import { NewObservationMatrixButton } from './containers/ObservationMatrixView/ObservationMatrixView';

const GraphExplorerHeader = (
  props: IGraphExplorerProps & RouteComponentProps<{ view: string }>
) => {
  const [graphSearch, setGraphSearch] = useState<
    (
      | {
          value: number;
          label: string;
        }
      | undefined
    )[]
  >([]);
  useEffect(() => {
    if (props.availableNodes) {
      const result = props.availableNodes.map(node => {
        if (props.nodes.find(n => node.id.toString() === n.id) === undefined) {
          return {
            value: node.id,
            label: node.name
          };
        }
        return undefined;
      });
      setGraphSearch(result);
    } else {
      setGraphSearch([]);
    }
  }, [props.availableNodes, props.nodes]);
  return (
    <>
      <div style={{ flexGrow: 10 }}>
        <Select
          key={'a'}
          onChange={(option: any) => {
            props.onAddNode(option.value);
          }}
          options={
            graphSearch
              ? (graphSearch.filter(n => !!n) as {
                  value: number;
                  label: string;
                }[])
              : []
          }
          onSelectResetsInput={true}
          onBlurResetsInput={false}
          valueKey="value"
          labelKey="label"
          closeOnSelect={false}
          removeSelected={true}
          clearable={true}
          placeholder="Select nodes"
          style={{
            lineHeight: '14px',
            display:
              props.match.params.view !== 'selection' ? 'none' : undefined
          }}
        />
      </div>
      <div
        style={{ flexGrow: 10, justifyContent: 'flex-end', display: 'flex' }}
      >
        <Radio.Group
          value={props.match.params.view}
          onChange={e =>
            props.history.push(
              props.match.url.replace(props.match.params.view, e.target.value)
            )
          }
          buttonStyle="solid"
        >
          <Radio.Button value="selection">Selection</Radio.Button>
          <Radio.Button value="annotation">Expl. &#38; Valid.</Radio.Button>
          <Radio.Button value="exploration">Causal Inference</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    availableNodes: state.graphExplorer!.availableNodes,
    nodes: state.graphExplorer!.nodes
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>
) => {
  return {
    onAddNode: (nodeID: number) => dispatch(actions.addNode(nodeID))
  };
};

const shorten = (s: string) => {
  if (s.length < 25) {
    return s;
  } else {
    return s.substr(0, 22) + '...';
  }
};

const GraphExplorerHeaderRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphExplorerHeader);

const AppHeader = () => {
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
              Experiments of {shorten(datasetName)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'jobs':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Jobs of {shorten(experimentName)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'compare':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Comparison of {shorten(experimentName)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'selection':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Selection of {shorten(experimentName)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'annotation':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Annotation of {shorten(experimentName)}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'exploration':
        breadcrumbItems.pop();
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Exploration of {shorten(experimentName)}
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
          alignItems: 'baseline'
        }}
      >
        <div style={{ flexGrow: 4 }}>
          <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
        </div>
        <Switch>
          <Route
            path="/:datasetId/experiments/:experimentId/jobs/:resultId/:view"
            component={GraphExplorerHeaderRedux}
          />
          <Route
            path="/:datasetId/experiments"
            component={NewExperimentButton}
          />
          <Route exact path="" component={NewObservationMatrixButton} />
          <Route />
        </Switch>
      </div>
    </Layout.Header>
  );
};

export { AppHeader };
