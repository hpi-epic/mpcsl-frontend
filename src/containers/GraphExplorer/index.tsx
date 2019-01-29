import React from 'react';
import { Routes } from '../../constants/routes';
import { Layout, Row, Col, Button, Select } from 'antd';
import * as actions from '../../actions/graphExplorer';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import colors from '../../constants/colors';
import GraphSelection from './GraphSelection/GraphSelection';
import GraphViewRadioNavigation from '../../components/GraphExplorerNavigation/GraphViewRadioNavigation';
import { RadioChangeEvent } from 'antd/lib/radio';
import GraphAnnotate from './GraphAnnotate/GraphAnnotate';
import GraphCausalExplorer from './GraphCausalExplorer/GraphCausalExplorer';
import { Dispatch } from 'redux';
import { CIGraph } from '../../utils/graph';
import { IState } from '../../store';
import { ID3GraphNode } from '../../types/graphTypes';

const { Header, Content } = Layout;

export interface IGraphExplorerState {
  view: typeof Routes;
}

interface IMatchParams {
  result_id: string;
}

export interface IGraphExplorerProps extends RouteComponentProps<IMatchParams> {
  onAddNode: (graph: CIGraph, node: string) => void;
  graph: CIGraph;
  nodes: ID3GraphNode[];
}

class GraphExplorer extends React.Component<IGraphExplorerProps, any> {
  constructor(props: IGraphExplorerProps) {
    super(props);

    this.state = {
      view: this.props.location.pathname.replace(new RegExp('\\/\\d*$'), ''),
    };
  }

  public render() {
    const graphSearch = (
      <Select
        showSearch={true}
        style={{ width: 200 }}
        placeholder='Add a node'
        optionFilterProp='children'
        onSelect={(value) =>
          this.props.onAddNode(this.props.graph, value.toString())
        }
      >
        {this.props.graph
          ? this.props.graph.nodes().map((node: string) => {
              if (
                this.props.nodes.find((n: ID3GraphNode) => node === n.id) ===
                undefined
              ) {
                return (
                  <Select.Option key={node} value={node}>
                    {this.props.graph.node(node)}
                  </Select.Option>
                );
              }
            })
          : null}
      </Select>
    );

    return (
      <Layout className='Layout'>
        <Header className='Header'>
          <Row>
            <Col span={this.state.view === '/graph-explorer/selection' ? 10 : 0}>{graphSearch}</Col>
            <Col span={this.state.view === '/graph-explorer/selection' ? 0 : 10} />
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
    graph: state.graphExplorer!.graph,
    nodes: state.graphExplorer!.nodes,
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.GraphExplorerAction>,
) {
  return {
    onAddNode: (graph: CIGraph, node: string) =>
      dispatch(actions.addNode(graph, node)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphExplorer);