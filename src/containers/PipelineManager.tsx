import { Button, Col, Layout, Row } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import ViewRadioNavigation from '../components/Navigation/ViewRadioNavigation';
import colors from '../constants/colors';
import { Routes } from '../constants/routes';
import ObservationMatricesManagement from './ObservationMatricesManager/ObservationMatricesManagement';
import ExperimentManagement from './ExperimentManager/ExperimentManagement';

const { Header, Content } = Layout;

interface IStatePipelineManager {
  view: Routes | string;
}

class PipelineManager extends React.Component<
  RouteComponentProps,
  IStatePipelineManager
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      view: this.props.location.pathname,
    };
  }

  public render() {
    return (
      <Layout className='Layout'>
        <Header className='Header'>
          <Row>
            <Col span={11} />
            <Col span={2} className='Home'>
              <Button onClick={this.onHomeClick} icon='home' ghost={true} />
            </Col>
            <Col span={11} className='Nav-Switch'>
              <ViewRadioNavigation
                value={this.state.view}
                onChange={this.onViewChange}
              />
            </Col>
          </Row>
        </Header>
        <Content style={{ background: colors.contentBackground }}>
          <Route
            exact={true}
            path={Routes.experimentManager}
            component={ExperimentManagement}
          />
          <Route
            path={Routes.observationMatricesManager}
            component={ObservationMatricesManagement}
          />
        </Content>
      </Layout>
    );
  }

  private onViewChange = (e: RadioChangeEvent) => {
    this.changeView(e.target.value);
  }

  private onHomeClick = () => {
    this.changeView(Routes.experimentManager);
  }

  private changeView = (newView: Routes) => {
    this.setState({
      view: newView,
    });
    this.props.history.push(newView);
  }
}

export default PipelineManager;
