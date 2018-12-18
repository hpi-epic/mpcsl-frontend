import React from 'react';
import { Routes, IStoreState } from '../types';
import { Layout, Row, Col, Button } from 'antd';
import * as actions from '../actions/graphExplorer';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router';
import colors from '../constants/colors';
import GraphSelection from './GraphExplorer/GraphSelection';
import GraphViewRadioNavigation from '../components/GraphExplorerNavigation/GraphViewRadioNavigation';
import { RadioChangeEvent } from 'antd/lib/radio';
import GraphAnnotate from './GraphExplorer/GraphAnntotate';
import GraphCausalExplorer from './GraphExplorer/GraphCausalExplorer';
import { Dispatch } from 'redux';
import CIGraph from '../utils/graph';

const { Header, Content } = Layout;

export interface IGraphExplorerState {
  view: typeof Routes;
}

export interface IGraphExplorerProps extends RouteComponentProps {
  onFetchGraph: () => void;
  graph: CIGraph;
}


class GraphExplorer extends React.Component<IGraphExplorerProps, any> {
  constructor(props: IGraphExplorerProps) {
    super(props);

    this.state = {
      view: this.props.location.pathname
    };
  }

  componentDidMount() {
    this.props.onFetchGraph();
  }


  public render() {
    return (
      <Layout className='Layout'>
        <Header className='Header'>
          <Row>
            <Col span={10} />
            <Col span={4} className='Home'>
              <Button onClick={this.onHomeClick} icon='home' ghost={true}/>
            </Col>
            <Col span={10} className='Nav-Switch'>
              <GraphViewRadioNavigation value={this.state.view} onChange={this.onViewChange}/>
            </Col>
          </Row>
        </Header>
        <Content style={{ background: colors.contentBackground }}>
        <Switch>
          <Route path={Routes.graphExplorerSelection} component={GraphSelection} />
          <Route path={Routes.graphExplorerAnnotate} component={GraphAnnotate} />
          <Route path={Routes.graphExplorerCausalExploration} component={GraphCausalExplorer} />
          <Redirect exact={true} from={Routes.graphExplorer} to={Routes.graphExplorerSelection} />
        </Switch>
        </Content>
      </Layout>
    );
  }

  private onViewChange = (e: RadioChangeEvent) => {
    this.changeView(e.target.value);
  }

  private onHomeClick = () => {
    this.changeView(Routes.projectManager);
  }

  private changeView = (newView: string) => {
    this.setState({
      view: newView,
    });
    this.props.history.push(newView);
  }
}

export function mapStateToProps({ graph }: IStoreState) {
  return {
    graph
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.GraphExplorerAction>
) {
  return {
    onFetchGraph: () => dispatch(actions.fetchGraph())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphExplorer);
