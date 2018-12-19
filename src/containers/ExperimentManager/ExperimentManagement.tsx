import React from 'react';
import { Row, Button, Form } from 'antd';

import './style.css';
import NewExperimentModal, {
  IPropsNewExperimentModal, IFormExperiment
} from './NewExperimentModal';
import { IExperiment } from '../../types';
import { getExperiments, deleteExperiment } from '../../actions/apiRequests';
import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

interface IStateExperimentManagement {
  newExperimentModalVisible: boolean;
  experiments: Array<IExperiment>;
  clickedExperiment: IFormExperiment | undefined;
  editExperiment: boolean;
}

class ExperimentManagement extends React.Component<
  {},
  IStateExperimentManagement
> {
  mounted = false;

  constructor(props: {}) {
    super(props);

    this.state = {
      editExperiment: true,
      newExperimentModalVisible: false,
      experiments: [],
      clickedExperiment: undefined
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchExperiments();
  };

  public componentWillUnmount = () => {
    this.mounted = false;
  }

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
          onView={() => this.onExperimentClick(experiment)}
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
          editDisabled={!this.state.editExperiment}
        />
      </div>
    );
  }

  private async fetchExperiments() {
    const experiments = await getExperiments();
    if (this.mounted) {
      this.setState({ experiments });
    }
  }

  private onNewExperiment = () => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true
    });
  };

  private onClose = () => {
    this.setState({
      newExperimentModalVisible: false,
      clickedExperiment: undefined,
      editExperiment: true,
    });
    this.fetchExperiments();
  };

  private onDeleteExperiment = (experiment: IExperiment) => {
    deleteExperiment(experiment)
      .then(() => {
        this.fetchExperiments();;
      });
  };

  private onExperimentClick = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: false,
      clickedExperiment: {
        name: experiment.name,
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.observationMatrix_id,
      }
    })
  }

  private onDuplicateExperiment = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true,
      clickedExperiment: {
        name: `${experiment.name} - Copy`,
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.observationMatrix_id,
      }
    })
  }

  private onRunExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }

  private onExploreExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }
}

export default ExperimentManagement;
