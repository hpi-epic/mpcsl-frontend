import React from 'react';
import { Routes } from '../../constants/routes';
import { Layout, Row, Col, Button } from 'antd';
import * as actions from '../../actions/graphExplorer';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import colors from '../../constants/colors';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphViewRadioNavigation from '../../components/GraphExplorerNavigation/GraphViewRadioNavigation';
import { RadioChangeEvent } from 'antd/lib/radio';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';
import { IState } from '../../store';
import { ID3GraphNode, IAPIGraphNode } from '../../types/graphTypes';
import { ThunkDispatch } from 'redux-thunk';
import Select from 'react-virtualized-select';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

import './index.css';

const { Header, Content } = Layout;

export interface IGraphExplorerState {
  view: typeof Routes;
  value: any;
  options: null | object[];
}

interface IMatchParams {
  result_id: string;
}

export interface IGraphExplorerProps extends RouteComponentProps<IMatchParams> {
  onAddNode: (nodeID: number) => void;
  availableNodes: IAPIGraphNode[];
  nodes: ID3GraphNode[];
}

class GraphExplorer extends React.Component<IGraphExplorerProps, any> {
  constructor(props: IGraphExplorerProps) {
    super(props);

    this.state = {
      view: this.props.location.pathname.replace(new RegExp('\\/\\d*$'), ''),
      value: '',
      options: null,
    };
  }

  public render() {
    const graphSearch = this.props.availableNodes
      ? this.props.availableNodes.map((node: IAPIGraphNode) => {
          if (
            this.props.nodes.find(
              (n: ID3GraphNode) => node.id.toString() === n.id,
            ) === undefined
          ) {
            return {
              value: node.id,
              label: node.name,
            };
          }
        })
      : new Array();

    return (
      <Layout className='Layout'>
        <Header className='Header'>
          <Row>
            <Col
              span={this.state.view === '/graph-explorer/selection' ? 10 : 0}
            >
              <Select
                key={'a'}
                onChange={(option: any) => {
                  this.setState({
                    value: null,
                  });
                  this.forceUpdate();
                  this.props.onAddNode(option!.value);
                }}
                options={
                  graphSearch ? graphSearch.filter((n) => (n ? true : false)) : []
                }
                async={false}
                onSelectResetsInput={true}
                onBlurResetsInput={false}
                valueKey='value'
                labelKey='label'
                closeOnSelect={false}
                value={this.state.value}
                removeSelected={true}
                clearable={true}
                placeholder='Select nodes'
                style={{
                  lineHeight: '14px',
                  marginTop: '15px',
                }}
              />
            </Col>
            <Col
              span={this.state.view === '/graph-explorer/selection' ? 0 : 10}
            />
            <Col span={4} className='Home'>
              <Button onClick={this.onHomeClick} icon='home' ghost={true} />
            </Col>
            <Col span={10} className='Nav-Switch'>
              <GraphViewRadioNavigation
                value={this.state.view}
                onChange={this.onViewChange}
              />
            </Col>
          </Row>
        </Header>
        <Content style={{ background: colors.contentBackground }}>
          <Switch>
            <Route
              path={`${Routes.graphExplorerSelection}/:result_id`}
              component={GraphSelection}
            />
            <Route
              path={`${Routes.graphExplorerAnnotate}/:result_id`}
              component={GraphAnnotate}
            />
            <Route
              path={`${Routes.graphExplorerCausalExploration}/:result_id`}
              component={GraphCausalExplorer}
            />
            <Redirect
              exact={true}
              from={Routes.graphExplorer}
              to={Routes.graphExplorerSelection}
            />
          </Switch>
        </Content>
      </Layout>
    );
  }

  private onViewChange = (e: RadioChangeEvent) => {
    const resultID = window.location.href.match(new RegExp('\\/\\d*$'));
    this.changeView(e.target.value, resultID ? resultID[0] : '');
  }

  private onHomeClick = () => {
    this.changeView(Routes.experimentManager, '');
  }

  private changeView = (newView: string, resultID: string | null) => {
    this.setState({
      view: newView,
    });
    this.props.history.push(newView + resultID);
  }
}

export function mapStateToProps(state: IState) {
  return {
    availableNodes: state.graphExplorer!.availableNodes,
    nodes: state.graphExplorer!.nodes,
  };
}

export function mapDispatchToProps(
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>,
) {
  return {
    onAddNode: (nodeID: number) => dispatch(actions.addNode(nodeID)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphExplorer);
