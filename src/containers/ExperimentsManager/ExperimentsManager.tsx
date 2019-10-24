import React from 'react';
import { Row, Button, Form } from 'antd';

import './style.css';
import NewExperimentModal, {
  IPropsNewExperimentModal,
  IFormExperiment
} from './NewExperimentModal';
import { IExperiment, IJob } from '../../types';

import {
  getExperiments,
  deleteExperiment,
  runExperiment,
  getObservationMatrices
} from '../../actions/apiRequests';

import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

import { RouteComponentProps } from 'react-router-dom';

interface IStateExperimentManagement {
  newExperimentModalVisible: boolean;
  experiments: IExperiment[];
  clickedExperiment: IFormExperiment | undefined;
  editExperiment: boolean;
  jobListVisible: boolean;
  noObservationMatricePresent: boolean;
  jobList: IJob[];
}

class ExperimentsManager extends React.Component<
  RouteComponentProps,
  IStateExperimentManagement
> {
  public mounted = false;

  private jobBadgeMap: any = {
    running: 'processing',
    done: 'success',
    error: 'error',
    cancelled: 'warning'
  };

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      editExperiment: true,
      newExperimentModalVisible: false,
      experiments: [],
      clickedExperiment: undefined,
      jobListVisible: false,
      noObservationMatricePresent: true,
      jobList: []
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchExperiments();
    this.fetchObservationMatrices();
  };

  public componentWillUnmount = () => {
    this.mounted = false;
  };

  public render() {
    const ExperimentModal = Form.create<IPropsNewExperimentModal>()(
      NewExperimentModal
    );
    const ExperimentList = this.state.experiments.map(
      (experiment: IExperiment) => (
        <ListElementExperiment
          key={experiment.id}
          title={experiment.name}
          status={
            experiment.last_job! === null
              ? 'default'
              : this.jobBadgeMap[experiment.last_job!.status]
          }
          statusText={
            experiment.last_job! === null
              ? 'Experiment was not started yet.'
              : experiment.last_job!.status
          }
          content={experiment.description || '-'}
          onDelete={() => this.onDeleteExperiment(experiment)}
          onDuplicate={() => this.onDuplicateExperiment(experiment)}
          onExplore={() =>
            this.onExploreExperiment(experiment.last_job!.result!.id)
          }
          onRunStart={() => this.onRunExperiment(experiment)}
          onView={() => this.onExperimentClick(experiment)}
          onShowDetails={() => this.showDetails(experiment.id!)}
        />
      )
    );

    return (
      <div className="Content">
        <Row>
          <div className="Experiment-Controls">
            <Button
              type="primary"
              onClick={this.onNewExperiment}
              disabled={this.state.noObservationMatricePresent}
            >
              + New Experiment
            </Button>
          </div>
        </Row>
        <Row>{ExperimentList}</Row>
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

  private async fetchObservationMatrices() {
    const observationMatrices = await getObservationMatrices();
    if (observationMatrices.length > 0) {
      this.setState({
        noObservationMatricePresent: false
      });
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
      jobListVisible: false
    });
    this.fetchExperiments();
  };

  private onDeleteExperiment = (experiment: IExperiment) => {
    deleteExperiment(experiment).then(() => {
      this.fetchExperiments();
    });
  };

  private onExperimentClick = (experiment: IExperiment) => {
    const params: { [name: string]: any } = {};
    Object.keys(experiment.parameters).forEach((parameter: any) => {
      params[parameter] = experiment.parameters[parameter];
    });
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: false,
      clickedExperiment: {
        name: experiment.name,
        description: experiment.description || '-',
        observationMatrix_id: experiment.dataset_id,
        algorithm_id: experiment.algorithm_id,
        parameters: params
      }
    });
  };

  private showDetails = (experimentId: number) => {
    this.props.history.push(`/manager/experimentdetails/${experimentId}`);
  };

  private onDuplicateExperiment = (experiment: IExperiment) => {
    const params: { [name: string]: any } = {};
    Object.keys(experiment.parameters).forEach((parameter: any) => {
      params[parameter] = experiment.parameters[parameter];
    });
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true,
      clickedExperiment: {
        name: `${experiment.name} - Copy`,
        description: experiment.description || '-',
        observationMatrix_id: experiment.dataset_id,
        algorithm_id: experiment.algorithm_id,
        parameters: params
      }
    });
  };

  private async onRunExperiment(experiment: IExperiment) {
    await runExperiment(experiment);
    this.fetchExperiments();
  }

  private onExploreExperiment = (resultId: number) => {
    this.props.history.push(`/graph-explorer/selection/${resultId}`);
  };
}

export default ExperimentsManager;
