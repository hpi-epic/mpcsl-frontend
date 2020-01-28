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

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
            marginTop: '15px',
            display:
              props.match.params.view !== 'selection' ? 'none' : undefined
          }}
        />
      </div>
      <div
        style={{ flexGrow: 10, justifyContent: 'flex-end', display: 'flex' }}
      >
        <RadioGroup
          buttonStyle="solid"
          value={props.match.params.view}
          onChange={e =>
            props.history.push(
              props.match.url.replace(props.match.params.view, e.target.value)
            )
          }
          size="small"
        >
          <RadioButton value="selection">Selection</RadioButton>
          <RadioButton value="annotate">Expl. &#38; Valid.</RadioButton>
          <RadioButton value="causal-exploration">Causal Inference</RadioButton>
        </RadioGroup>
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
        <Icon type="home" /> Observation Matrices
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
              {datasetName}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'jobs':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              {experimentName}
            </Link>
          </Breadcrumb.Item>
        );
        break;
      case 'compare':
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              {experimentName}
            </Link>
          </Breadcrumb.Item>
        );
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link style={{ color: 'white' }} to={url}>
              Compare
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
            path="/graph-explorer/:view/:resultid"
            component={GraphExplorerHeaderRedux}
          />
          <Route />
        </Switch>
      </div>
    </Layout.Header>
  );
};

export { AppHeader };
