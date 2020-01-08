import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useLocation
} from 'react-router-dom';
import { Button, Layout, Col, Row } from 'antd';
import GraphViewRadioNavigation from './components/GraphExplorerNavigation/GraphViewRadioNavigation';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import * as actions from './actions/graphExplorer';
import { IState } from './store';
import { IGraphExplorerProps } from './containers/GraphExplorer';
import Select from 'react-virtualized-select';

const GraphExplorerHeader = (props: IGraphExplorerProps) => {
  const location = useLocation();
  console.log(location);
  const graphSearch = props.availableNodes
    ? props.availableNodes.map(node => {
        if (props.nodes.find(n => node.id.toString() === n.id) === undefined) {
          return {
            value: node.id,
            label: node.name
          };
        }
        return undefined;
      })
    : [];
  return (
    <Row>
      <Col span={location.pathname.includes('selection') ? 10 : 0}>
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
          // value={this.state.value}
          removeSelected={true}
          clearable={true}
          placeholder="Select nodes"
          style={{
            lineHeight: '14px',
            marginTop: '15px'
          }}
        />
      </Col>
      <Col span={location.pathname.includes('selection') ? 10 : 0} />
      <Col span={10} className="Nav-Switch">
        {/* <GraphViewRadioNavigation
                value={location.pathname}
              /> */}
      </Col>
    </Row>
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
  const history = useHistory();
  const params = useParams<{ resultId: string }>();
  return (
    <Layout.Header
      className="Header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Button onClick={() => history.push('/')} icon="home" ghost={true} />
      <Switch>
        <Route path="/graph-explorer" component={GraphExplorerHeaderRedux} />
        <Route />
      </Switch>
    </Layout.Header>
  );
};

export { AppHeader };
