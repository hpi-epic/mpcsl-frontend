import React from 'react';
import { Row, Button, Form } from 'antd';

import './style.css';
import NewExperimentModal, {
  IPropsNewExperimentModal, IFormExperiment
} from './NewExperimentModal';
import { IExperiment } from '../../types';
import { getExperiments, deleteExperiment } from '../../actions/apiRequests';
import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

interface IPropsExperimentManagement {
  newExperimentModalVisible: boolean;
  experiments: Array<IExperiment>;
  clickedExperiment: IFormExperiment | undefined;
}

class ExperimentManagement extends React.Component<
  {},
  IPropsExperimentManagement
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      newExperimentModalVisible: false,
      experiments: [],
      clickedExperiment: undefined,
    };
  }

  public componentDidMount = () => {
    this.getData();
  };

  public render() {
    const ExperimentModal = Form.create<IPropsNewExperimentModal>()(
      NewExperimentModal
    );

    // TODO if jobs for experiment endpoint is implemented
    const ExperimentList = this.state.experiments.map(
      (experiment: IExperiment) => (
        <ListElementExperiment
          key={experiment.id}
          title={experiment.name}
          status="success"
          statusText="Test"
          content="Last job"
          onDelete={() => this.onDeleteExperiment(experiment)}
          onDuplicate={() => this.onDuplicateExperiment(experiment)}
          onExplore={() => this.onExploreExperiment(experiment)}
          onRunStart={() => this.onRunExperiment(experiment)}
          onClick={() => this.onExperimentClick(experiment)}
        />
      )
    );

    return (
      <div className="Content">
        <Row>
          <div className="Experiment-Controls">
            <Button type="primary" onClick={this.onNewExperiment}>
              + New Experiment
            </Button>
          </div>
        </Row>
        <Row>
          {ExperimentList}
        </Row>
        <ExperimentModal
          visible={this.state.newExperimentModalVisible}
          onClose={this.onClose}
          experiment={this.state.clickedExperiment}
        />
      </div>
    );
  }

  private async getData() {
    const experiments = await getExperiments();
    this.setState({ experiments });
  }

  private onNewExperiment = () => {
    this.setState({
      newExperimentModalVisible: true
    });
  };

  private onClose = () => {
    this.setState({
      newExperimentModalVisible: false,
      clickedExperiment: undefined
    });
    this.getData();
  };

  private onDeleteExperiment = (experiment: IExperiment) => {
    deleteExperiment(experiment)
      .then(() => {
        this.getData();;
      });
  };

  private onExperimentClick = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      clickedExperiment: {
        name: experiment.name,
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        dataset_id: experiment.dataset_id,
      }
    })
  }

  private onRunExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }

  private onDuplicateExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }

  private onExploreExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }
}

export default ExperimentManagement;
